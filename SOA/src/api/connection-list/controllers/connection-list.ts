/**
 * connection-list controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::connection-list.connection-list',
  ({ strapi }) => ({
    async find(ctx) {
      const { username } = ctx.state.user;
      ctx.request.query.filters.dramaMakerName = { $eq: username };
      return await super.find(ctx);
    },
  })
);
