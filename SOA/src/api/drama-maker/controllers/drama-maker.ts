/**
 * drama-maker controller
 */

import { factories } from '@strapi/strapi';
import utils from '@strapi/utils';
const { errors } = utils;
export default factories.createCoreController(
  'api::drama-maker.drama-maker',
  ({ strapi }) => ({
    async findOne(ctx) {
      const { id } = ctx.request.params;
      const { id: userId } = ctx.state.user;

      if (id != userId) throw new errors.UnauthorizedError('unauthorized');
      const res = await super.findOne(ctx);
      return {
        id: res.data.id,
        ...res.data.attributes,
        role: res.data.attributes.role?.data && {
          id: res.data.attributes.role.data.id,
          ...res.data.attributes.role.data.attributes,
        },
        avatar: res.data.attributes.avatar?.data && {
          id: res.data.attributes.avatar.data.id,
          ...res.data.attributes.avatar.data.attributes,
        },
      };
    },
  })
);
