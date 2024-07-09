import utils from '@strapi/utils';
const { errors } = utils;
import _ from 'lodash';

export default {
  // async beforeUpdate({ params }) {
  //   const userId = strapi.requestContext.get().state.user.id;
  //   const currentRecord = await strapi
  //     .service('api::notification.notification')
  //     .find({
  //       filters: {
  //         id: params.where.id,
  //         user: {
  //           id: userId,
  //         },
  //       },
  //     });
  //   if (!_.get(currentRecord, 'results.length')) {
  //     throw new errors.NotFoundError();
  //   }
  //   params.data = {
  //     status: params.data.status,
  //   };
  //   params.populate = [];
  // },
};
