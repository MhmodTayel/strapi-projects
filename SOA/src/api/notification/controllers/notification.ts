import { factories } from '@strapi/strapi';
import { getService } from '@strapi/plugin-users-permissions/server/utils';
import utils from '@strapi/utils';
const { errors } = utils;

export default factories.createCoreController(
  'api::notification.notification',
  ({ strapi }) => ({
    async find(ctx) {
      // if (ctx.state.user.role.type == 'drama_maker') {
      //   ctx.request.query.filters = { role: { $eq: 'drama-maker' } };
      //   const res = await super.find(ctx);
      //   return res;
      // } else {
      const role = ctx.state.user.role.type;
      ctx.request.query.filters = {
        ...(role == 'talent' && {
          user: { id: { $eq: `${ctx.state.user.id}` } },
        }),
        ...(role == 'drama_maker' && {
          drama_maker: { id: { $eq: `${ctx.state.user.id}` } },
        }),
      };
      const res = await super.find(ctx);
      return res;
    },
    // },
  })
);
