/**
 * profile controller
 */

import { factories } from '@strapi/strapi';
import utils from '@strapi/utils';
const { errors } = utils;

const updatePopulatedFields = (ctx) => {
  const unpopulatedFields = [
    'license_front',
    'license_back',
    'syndicate_card_front',
    'syndicate_card_back',
    'national_id_front',
    'national_id_back',
  ];
  ctx.request.query.populate = ctx.request.query.populate?.filter(
    (ele) => !unpopulatedFields.includes(ele)
  );
};
export default factories.createCoreController(
  'api::profile.profile',
  ({ strapi }) => ({
    async update(ctx) {
      const { id: profileId } = ctx.state.user.profile;
      const { id } = ctx.request.params;
      if (id != profileId) throw new errors.UnauthorizedError('unauthorized');
      return await super.update(ctx);
    },

    async findOne(ctx) {
      const {
        role: { type: role },
        profile,
      } = ctx.state.user;
      if (role === 'drama_maker') {
        updatePopulatedFields(ctx);
      } else if (
        ctx.request.params.id &&
        profile?.id != ctx.request.params.id
      ) {
        throw new errors.UnauthorizedError('unauthorized');
      }

      return await super.findOne(ctx);
    },
    async find(ctx) {
      const {
        role: { type: role },
      } = ctx.state.user;
      if (role !== 'drama_maker')
        throw new errors.UnauthorizedError('unauthorized');
      updatePopulatedFields(ctx);
      const oldFilter = ctx.request.query.filters;
      const addedFilters = {
        user: {
          renewalRequestStatus: 'done',
          syndicateID: { $ne: null },
          blocked: false,
        },
      };
      ctx.request.query.filters = { ...oldFilter, ...addedFilters };

      return await super.find(ctx);
    },
  })
);
