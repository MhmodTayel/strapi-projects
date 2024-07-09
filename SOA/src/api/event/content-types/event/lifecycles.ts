import utils from '@strapi/utils';
const { errors } = utils;

const checkHomePage = async ({ action, params: { data, where } }) => {
  const oldData = await strapi.db.query('api::event.event').findOne({
    where,
    populate: ['Source'],
  });
  const eventsOtherData = await strapi.db.query('api::event.event').findOne({
    where: {
      id: { $ne: oldData.id },
      publishedAt: { $ne: null },
      locale: oldData.locale,
    },
  });
  const homePageData = await strapi.db
    .query('api::home-page.home-page')
    .findOne({
      where: { publishedAt: { $ne: null }, locale: oldData.locale },
      populate: ['slider'],
    });
  if (eventsOtherData || !homePageData || homePageData.slider.length) return;
  if (oldData.publishedAt) {
    if (action === 'beforeDelete' || data.hasOwnProperty('publishedAt')) {
      throw new errors.ValidationError('Action not allowed', {
        errors: [
          {
            path: [''],
            message:
              'this is the only published event and there is no slider on home page',
            name: 'ValidationError',
          },
        ],
      });
    }
  }
};
export default {
  async beforeUpdate(event) {
    await checkHomePage(event);
  },
  async beforeDelete(event) {
    await checkHomePage(event);
  },
};
