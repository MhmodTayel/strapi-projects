
import { factories } from '@strapi/strapi';
import utils from '@strapi/utils';
import template from '../../../templates/employeeInvitation';
import otpTemplate from '../../../templates/otp';

const { getAbsoluteAdminUrl } = utils;
import credentialsTemplate from '../../../templates/credentials';

import otpForgotPasswordTemplate from '../../../templates/otpForgotPassword';

type SMS = {
  phoneNumber: string;
  message: string;
};

type USER = {
  email: string;
  registrationToken: string;
};

export default factories.createCoreService(
  'api::notification.notification',
  ({ strapi }) => ({
    adminRegistration: async (user: USER) => {
      await strapi.plugins.email.service('email').sendTemplatedEmail(
        {
          to: user.email,
        },
        template,
        {
          user,
          url: `${getAbsoluteAdminUrl(
            strapi.config
          )}/auth/register?registrationToken=${user.registrationToken}`,
        }
      );
    },
    sendOTP: async (email, code) => {
      await strapi.plugins.email.service('email').sendTemplatedEmail(
        {
          to: email,
        },
        otpTemplate,
        {
          code,
        }
      );
    },
    sendCredentials: async (email, credentials) => {
      await strapi.plugins.email.service('email').sendTemplatedEmail(
        {
          to: email,
        },
        credentialsTemplate,
        credentials
      );
    },
    sendForgotPasswordOTP: async (email, code, username) => {
      await strapi.plugins.email.service('email').sendTemplatedEmail(
        {
          to: email,
        },
        otpForgotPasswordTemplate,
        {
          username,
          code
        } 
      );
    },
    sendSMS: async (sms: SMS) => {
      // strapi.plugin('strapi-amqplib-wrapper').instance.publish('x-notification', {
      //   means: 'sms',
      //   msgConfig: sms,
      // });
    },
  })
);
