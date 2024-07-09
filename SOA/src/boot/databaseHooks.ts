import utils from '@strapi/utils';
const { errors } = utils;
import { getService } from '@strapi/plugin-users-permissions/server/utils';
const {
  generateCode,
  createOtpSMSTemplate,
  otpTypes,
} = require('../helpers/otpHelpers');

export default (strapi) => {
  strapi.db.lifecycles.subscribe({
    models: ['plugin::users-permissions.user'],
    beforeCreate: async (event) => {
      const ctx = strapi.requestContext.get();
      const misc = await strapi.db.query('api::misc.misc').findOne({});
      event.params.data.confirmed = misc?.disableOTP || false;
      if (!ctx.request.url.includes('/content-manager/')) {
        event.params.data.addedFromAdminPortal = false;
        const otpInfo = generateCode(
          event.params.data.phone,
          1,
          otpTypes.registrationOTP
        );
        event.params.data.OTP = otpInfo;
      } else {
        event.params.data.mailedPassword = event.params.data.mailedPassword;
      }
      const syndicateMember = await strapi.db
        .query('api::syndicate-member.syndicate-member')
        .findOne({
          where: {
            syndicateID: event.params.data.syndicateID,
            division: event.params.data.division,
          },
          populate: ['renewalRequests'],
        });
      event.params.data.member = syndicateMember;
      console.log({ syndicateMember: JSON.stringify(syndicateMember) });

      event.params.data = {
        ...event.params.data,
        ...(syndicateMember.renewalRequests && {
          renewalRequests: syndicateMember.renewalRequests,
        }),
      };
      event.params.data.renewalRequestStatus =
        syndicateMember.renewalRequestStatus;
      event.params.populate = { renewalRequests: '*' };
    },
    afterCreate: async (event) => {
      const user = event.result;
      const { mailedPassword } = event.params.data;
      const ctx = strapi.requestContext.get();
      if (user.renewalRequests && user.renewalRequests.length) {
        user.renewalRequests.forEach(async (req) => {
          const result = await strapi.db
            .query('api::soa-request-renewal.soa-request-renewal')
            .update({
              where: { id: req.id },
              data: { userId: user.id },
              options: { ignoreLifecycle: true },
            });
        });
      }
      try {
        if (!ctx.request.url.includes('/content-manager/')) {
          user.nextOTPResendTime = new Date(user.OTP.nextOTPResendTime);
          strapi.service('api::notification.notification').sendSMS({
            to: user.phone,
            text: createOtpSMSTemplate(user.OTP.code),
          });
        } else {
          const resetPasswordToken = getService('jwt').issue({
            id: event.result.id,
            role: 'talent',
          });
          await strapi.db.query('plugin::users-permissions.user').update({
            where: { id: event.result.id },
            data: { resetPasswordToken },
          });
          strapi.service('api::notification.notification').sendSMS({
            to: user.phone,
            text:
              'نقابة المهن التمثيلية- معلومات حسابك للدخول:\nنوع المستخدم: عضو نقابة' +
              '\n' +
              user.username +
              ' :اسم المستخدم' +
              '\n' +
              mailedPassword +
              ' :كلمة المرور',
          });
        }
      } catch (err) {
        strapi.log.debug('error:', err);
      }
    },
    beforeDelete: async (event) => {
      const { where } = event.params;
      const user = await strapi.db
        .query('plugin::users-permissions.user')
        .findOne({
          where,
          populate: ['profile', 'renewalRequests'],
        });
      if (user.renewalRequests && user.renewalRequests.length) {
        user.renewalRequests.forEach(async (req) => {
          const result = await strapi.db
            .query('api::soa-request-renewal.soa-request-renewal')
            .update({
              where: { id: req.id },
              data: { userId: null },
              options: { ignoreLifecycle: true },
            });
        });
      }
      if (user.profile) {
        await strapi.db.query('api::profile.profile').delete({
          where: {
            id: user.profile.id,
          },
        });
      }
    },
  }),
    strapi.db.lifecycles.subscribe({
      models: ['admin::user'],
      afterCreate: async ({ result: user }) => {
        if (user) {
          try {
            await strapi
              .service('api::notification.notification')
              .adminRegistration(user);
          } catch (err) {
            strapi.log.debug('error:', err);
          }
        }
      },
    });
};
