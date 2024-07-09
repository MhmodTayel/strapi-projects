import utils from '@strapi/utils';
import _ from 'lodash';
const { errors } = utils;

export default {
  async beforeUpdate(event) {
    if (event.params?.options && event.params.options.ignoreLifecycle) return;
    const { data, where } = event.params;
    const oldData = await strapi.db
      .query('api::syndicate-member.syndicate-member')
      .findOne({ where, populate: ['user'] });
    if (oldData.disabled) {
      throw new errors.ValidationError(
        'action not allowed, member is disabled'
      );
    }
    let userData: any = {};

    if (data.syndicateID !== oldData.syndicateID) {
      userData.syndicateID = data.syndicateID;
    }
    if (data.division !== oldData.division) {
      userData.division = data.division;
    }
    if (data.active !== oldData.active) {
      userData.renewalRequestStatus = data.active ? 'done' : 'none';
      event.params.data.renewalRequestStatus = data.active ? 'done' : 'none';
    }
    if (data.disabled) {
      userData.syndicateID = null;
      data.syndicateID = null;
    }

    if (Object.keys(userData).length) {
      if (oldData.user) {
        await strapi.db.query('plugin::users-permissions.user').update({
          where: {
            syndicateID: oldData.syndicateID,
          },
          data: userData,
        });
      }
    }
    if (event.params.data.active === false && oldData.active) {
      await strapi.db
        .query('api::unique-renewal-request.unique-renewal-request')
        .delete({
          where: { memberId: oldData.id },
        });
    }
  },
};
