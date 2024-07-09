import utils from '@strapi/utils';
import _ from 'lodash';
const { errors } = utils;
const {
  soaApisCallersSides,
  detectApiCallerSide,
  replaceWildcard,
} = require('../../../../helpers/generalHelpers');

const {
  checkActivityValidations,
} = require('../../../../helpers/dynamicServiceHelpers/helperFunctions');

const {
  serviceUser,
} = require('../../../../helpers/dynamicServiceHelpers/constants');

const {
  getTemplates,
  sendPushToken,
  createInAppNotification,
} = require('../../../../helpers/notificationHelpers');
const dynamicServices = require('../../../../helpers/dynamicServiceHelpers/seed');

async function sendNotification(slug, user, renewalRequestId) {
  const templates = await getTemplates(slug);

  const notifications = templates.map((template) => ({
    ...template,
    body: replaceWildcard(template.body, 'ID', renewalRequestId),
  }));
  if (user) {
    await createInAppNotification(slug, user, renewalRequestId);

    await sendPushToken(user, notifications, renewalRequestId);
  }
}

export default {
  async beforeCreate(event) {
    const ctx = strapi.requestContext.get();
    const callerSide = detectApiCallerSide(ctx);
    const userType = serviceUser[callerSide];
    const { renewalRequestStatus } = ctx.state.user;
    if (renewalRequestStatus !== 'none' && userType != 'employee') {
      throw new errors.ValidationError('Renewal not allowed');
    }

    const statusFrom = 'N/A';
    if (!ctx.request.body.admin) {
      const user = await strapi.db
        .query('plugin::users-permissions.user')
        .findOne({
          where: { id: ctx.state.user.id },
          populate: ['member'],
        });
      await checkActivityValidations({
        event,
        userType,
        statusFrom,
        dynamicServices,
      });
      event.params.data.user = ctx.state.user.id;
      event.params.data.member = user?.member;
      event.params.data.memberId = user?.member.id;
      event.params.data.userId = ctx.state.user.id;
      event.params.data.talent_name = ctx.state.user.arabicName;
      event.params.data.phone = ctx.state.user.phone;
      event.params.data.division = ctx.state.user.division;
      event.params.data.syndicateID = ctx.state.user.syndicateID;
    } else {
      const user = await strapi.db
        .query('plugin::users-permissions.user')
        .findOne({
          where: { syndicateID: ctx.request.body.syndicateID },
        });
      const { name, mobile, id } = ctx.request.body.member;
      event.params.data = {
        ...event.params.data,
        ...(user && { user: user.id, userId: user.id }),
      };
      event.params.data.status = 'reviewing';
      event.params.data.memberId = id;
      event.params.data.talent_name = user?.arabicName || name || '';
      event.params.data.phone = user?.phone || mobile || '';
      event.params.data.history = [
        {
          updatedAt: event.params.data.updatedAt,
          statusFrom: 'NA',
          status: event.params.data.status,
          user: `${ctx.state.user.firstname} ${ctx.state.user.lastname || ''}`,
        },
      ];
    }
    const date = new Date();

    event.params.data.year =
      date.getMonth() == 11 && date.getDate() > 15
        ? date.getFullYear() + 1
        : date.getFullYear();
    await strapi.db
      .query('api::unique-renewal-request.unique-renewal-request')
      .create({
        data: { memberId: event.params.data.memberId },
      });
  },
  async afterCreate(event) {
    const ctx = strapi.requestContext.get();
    const isAdmin = ctx.request.body.admin;

    await strapi.db.query('plugin::users-permissions.user').update({
      where: {
        ...(isAdmin
          ? { syndicateID: ctx.request.body.syndicateID }
          : { id: ctx.state.user.id }),
      },
      data: { renewalRequestStatus: 'processing' },
    });
    await strapi.db.query('api::syndicate-member.syndicate-member').update({
      where: { id: event.params.data.member.id },
      data: {
        renewalRequestStatus: 'processing',
      },
      options: { ignoreLifecycle: true },
    });
  },
  async afterUpdate(event) {
    const {
      data: { status },
      where,
    } = event.params;

    const { syndicateID } = event.result;
    const { user, member } = await strapi.db
      .query('api::soa-request-renewal.soa-request-renewal')
      .findOne({
        where,
        populate: ['user', 'member'],
      });

    const userData =
      user &&
      (await strapi.db.query('plugin::users-permissions.user').findOne({
        where: {
          id: user.id,
        },
        populate: ['pushTokens', 'role'],
      }));

    const statusSlug = {
      rejected: 'renewal-request_rejected',
      waitForPayment: 'renewal-request_accepted',
      missingData: 'renewal-request_missingData',
    };

    let renewalRequestStatus;
    if (status === 'paid' || status === 'readyToPick' || status === 'picked') {
      renewalRequestStatus = 'done';
    } else if (status === 'cancelled') {
      renewalRequestStatus = 'none';
      await strapi.db
        .query('api::unique-renewal-request.unique-renewal-request')
        .delete({ where: { memberId: member.id } });
    } else if (
      status === 'reviewing' ||
      status === 'rejected' ||
      status === 'missingData' ||
      status === 'waitForPayment'
    ) {
      renewalRequestStatus = 'processing';
    }

    user &&
      (await strapi.db.query('plugin::users-permissions.user').update({
        where: { id: user.id },
        data: { renewalRequestStatus },
      }));
    member &&
      (await strapi.db.query('api::syndicate-member.syndicate-member').update({
        where: { id: member.id },
        data: { renewalRequestStatus },
        options: { ignoreLifecycle: true },
      }));
    if (status === 'paid') {
      await strapi.db.query('api::syndicate-member.syndicate-member').update({
        where: { syndicateID: syndicateID },
        data: { active: true },
      });
    }

    if (Object.keys(statusSlug).includes(status) && user)
      await sendNotification(statusSlug[status], userData, where.id);
  },
  async beforeUpdate(event) {
    if (event.params?.options && event.params.options.ignoreLifecycle) return;
    if (event.params?.options && event.params.options.updatePayment) {
      if (event.params.data.status === 'paid') {
        const { where } = event.params;
        const oldData = await strapi.db.query(event.model.uid).findOne({
          where,
        });
        const historyItem = {
          statusFrom: oldData.status,
          status: 'paid',
          updatedAt: event.params.data.updatedAt,
        };
        event.params.data.history = oldData.history
          ? [historyItem, ...oldData.history]
          : [historyItem];
        event.params.data.paymentMethod = 'credit';
      }
      return;
    }
    const ctx = strapi.requestContext.get();
    const callerSide = detectApiCallerSide(ctx);
    const userType = serviceUser[callerSide];
    const { id } = ctx.request.params;
    const request = await strapi.db.query(event.model.uid).findOne({
      where: {
        id,
      },
      populate: ['user', 'member'],
    });
    if (
      callerSide === soaApisCallersSides.strapiPortal &&
      request?.userId != ctx.state.user.id
    ) {
      throw new errors.UnauthorizedError('unauthorized');
    }

    const { where, data } = event.params;
    const oldData = await strapi.db.query(event.model.uid).findOne({
      where,
    });
    const statusFrom = oldData.status;

    await checkActivityValidations({
      event,
      userType,
      statusFrom,
      dynamicServices,
    });

    let historyItem: any = {
      updatedAt: event.params.data.updatedAt,
      statusFrom,
      status: event.params.data.status,
    };
    if (callerSide === soaApisCallersSides.strapiAdmin) {
      historyItem.user = `${ctx.state.user.firstname} ${
        ctx.state.user.lastname || ''
      }`;
      historyItem.data = _.omit(event.params.data.validatedFields, ['status']);
    }
    event.params.data.history = oldData.history
      ? [historyItem, ...oldData.history]
      : [historyItem];
    const { status, newSyndicateID } = data;
    const userData =
      request.user &&
      (await strapi.db.query('plugin::users-permissions.user').findOne({
        where: {
          id: request.user.id,
        },
        populate: ['member'],
      }));
    if (status === 'paid') {
      event.params.data.paymentMethod = 'offline';
    }

    if (
      status == 'readyToPick' &&
      newSyndicateID != request.member?.syndicateID
    ) {
      try {
        const existingMember = await strapi.db
          .query('api::syndicate-member.syndicate-member')
          .findOne({
            where: { syndicateID: newSyndicateID },
          });
        console.log({ existingMember });
        if (existingMember) throw 'رقم العضويه مستخدم بالفعل';
        else {
          await strapi.db
            .query('api::syndicate-member.syndicate-member')
            .update({
              where: { syndicateID: request.syndicateID },
              data: { syndicateID: newSyndicateID },
            });
          event.params.data = {
            ...event.params.data,
            syndicateID: newSyndicateID,
          };
        }
      } catch (error) {
        console.log({ error });
        throw new errors.ValidationError(JSON.stringify(error), {
          errors: [{ path: 'newSyndicateID' }],
        });
      }
    }
  },
};
