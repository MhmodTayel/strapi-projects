import utils from '@strapi/utils';
const { errors } = utils;
import _ from 'lodash';
export default {
  async beforeUpdate(event) {
    if (event.params?.options && event.params.options.ignoreBeforeUpdateHook)
      return;
    const fields = [
      'NewsTitle1.category',
      'NewsTitle2.category',
      'NewsTitle3.category',
      'NewsTitle4.category',
    ];
    const { data, where } = event.params;
    const oldData = await strapi.db.query('api::home-page.home-page').findOne({
      where,
      populate: ['slider', ...fields],
    });

    const newsNum =
      oldData.slider.length +
      data.slider?.connect.length -
      data.slider?.disconnect.length;
    if (newsNum > 5)
      throw new errors.ValidationError('SLIDER_FIELD_MAX_LENGTH', {
        errors: [
          {
            path: ['slider'],
            message: 'slider should not have more than 5 news',
            name: 'ValidationError',
          },
        ],
      });

    const eventsData = await strapi.db.query('api::event.event').findMany({
      where: { publishedAt: { $ne: null }, locale: oldData.locale },
    });
    if (data.publishedAt || (!data.publishedAt && oldData.publishedAt)) {
      if (
        !data.slider?.connect.length &&
        (oldData.slider.length === 0 ||
          data.slider?.disconnect.length === oldData.slider.length) &&
        !eventsData.length
      ) {
        throw new errors.ValidationError('SLIDER_FIELD_IS_REQUIRED', {
          errors: [
            {
              path: ['slider'],
              message: 'slider field is required',
              name: 'ValidationError',
            },
          ],
        });
      }

      // const errorPathes = fields.filter((field) => !_.get(oldData, field));

      // if (errorPathes.length) {
      //   throw new errors.ValidationError(`FIELD_REQUIRED`, {
      //     errors: errorPathes.map((field) => ({
      //       path: [field, field.split('.')[0]],
      //       message: `${field} is required`,
      //       name: 'ValidationError',
      //     })),
      //   });
      // }
    }
  },
};
