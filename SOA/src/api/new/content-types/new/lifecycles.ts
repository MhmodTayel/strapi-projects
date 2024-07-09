import utils from '@strapi/utils';
const { errors } = utils;
const { addLink } = require('../../../../helpers/generalHelpers');

const checkHomeAndEvents = async ({ action, params: { data, where } }) => {
  const oldData = await strapi.db.query('api::new.new').findOne({
    where,
    populate: ['tags', 'categories'],
  });
  const homePageData = await strapi.db
    .query('api::home-page.home-page')
    .findOne({
      where: { publishedAt: { $ne: null }, locale: oldData.locale },
      populate: ['slider'],
    });
  const eventsData = await strapi.db.query('api::event.event').findMany({
    where: { publishedAt: { $ne: null }, locale: oldData.locale },
  });
  if (eventsData.length || !homePageData) return;

  if (oldData.publishedAt) {
    const checkIfUsedInHomePageSlider = homePageData.slider.find(
      (slider) => slider.Title === oldData.Title
    );
    if (homePageData.slider.length === 1 && checkIfUsedInHomePageSlider) {
      const oldDataHasCategorySlider = oldData.categories.find(
        (cat) => cat.Title === 'slider'
      );

      if (action === 'beforeDelete' || data.hasOwnProperty('publishedAt')) {
        throw new errors.ValidationError('Action not allowed', {
          errors: [
            {
              path: [''],
              message:
                'This news is the only on on home page slider and there is no published events yet',
              name: 'ValidationError',
            },
          ],
        });
      } else if (
        oldDataHasCategorySlider &&
        data.categories.disconnect.length
      ) {
        const checkIfDesconnectSlider = data.categories.disconnect.find(
          ({ id }) =>
            oldData.categories.find(
              (cat) => cat.id === id && cat.Title === 'slider'
            )
        );
        if (checkIfDesconnectSlider) {
          throw new errors.ValidationError('Action not allowed', {
            errors: [
              {
                path: [''],
                message:
                  'This news is the only on on home page slider and there is no published events yet',
                name: 'ValidationError',
              },
            ],
          });
        }
      }
    }
  }
};
export default {
  async beforeCreate(event) {
    addLink(event);
  },
  async beforeUpdate(event) {
    const { data, where } = event.params;

    const oldData = await strapi.db.query('api::new.new').findOne({
      where,
      populate: ['tags', 'categories'],
    });

    await checkHomeAndEvents(event);

    if (data.publishedAt || (!data.publishedAt && oldData.publishedAt)) {
      if (
        (data.type == 'خبر' && !data.description) ||
        (oldData.type == 'خبر' && !oldData.description)
      ) {
        throw new errors.ValidationError('DESCRIPTION_IS_REQUIRED', {
          errors: [
            {
              path: ['description'],
              message: 'description field is required',
              name: 'ValidationError',
            },
          ],
        });
      }
      if (
        !data.tags?.connect.length &&
        (oldData.tags.length === 0 ||
          data.tags?.disconnect.length === oldData.tags.length)
      ) {
        throw new errors.ValidationError('TAGS_FIELD_IS_REQUIRED', {
          errors: [
            {
              path: ['tags'],
              message: 'tags field is required',
              name: 'ValidationError',
            },
          ],
        });
      }
    }
    addLink(event);
  },
  async afterUpdate(event) {
    const { id, locale } = event.result;
    const homePageData = await strapi.db
      .query('api::home-page.home-page')
      .findOne({
        where: { publishedAt: { $ne: null }, locale },
        populate: ['slider', 'slider.categories'],
      });
    if (!homePageData) return;
    const checkHomeSlider = homePageData.slider.find(
      (slider) => slider.id === id
    );
    if (
      checkHomeSlider &&
      (!checkHomeSlider.publishedAt ||
        !checkHomeSlider.categories.find((cat) => cat.Title === 'slider'))
    ) {
      await strapi.db.query('api::home-page.home-page').update({
        where: { publishedAt: { $ne: null }, locale },
        data: { slider: { disconnect: [{ id }] } },
        options: { ignoreBeforeUpdateHook: true },
      });
    }
  },
  async beforeDelete(event) {
    await checkHomeAndEvents(event);
  },
};
