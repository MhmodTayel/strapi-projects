import crypto from 'crypto';

import { getService } from '@strapi/plugin-users-permissions/server/utils';
import utils from '@strapi/utils';
const { errors } = utils;
const { getUser } = require('./generalHelpers');

const otpTypes = {
  registrationOTP: 'registration',
  forgetPasswordOTP: 'forgetPassword',
  changeMobileNumberOTP: 'changeMobileNumber',
  updateUserMobileNumberOTP: 'updateUserMobileNumber',
};

const createExpiredDate = (minutes = 5) =>
  new Date(new Date().getTime() + minutes * 60 * 1000);

const generateCode = (identifier, otpRequestNum, serviceType) => {
  const code = crypto.randomInt(100000, 999999);
  const expireDate = createExpiredDate(5);
  const nextOTPResendTime = new Date(
    new Date().getTime() + otpRequestNum * 30 * 1000
  );
  return {
    code,
    identifier,
    serviceType,
    expireDate,
    otpRequestNum,
    nextOTPResendTime,
  };
};

const predictOtpType = (ctx) => {
  let otpType;
  if (ctx.state?.user) {
    otpType = otpTypes.updateUserMobileNumberOTP;
  } else if (ctx.request.query?.code) {
    otpType = otpTypes.registrationOTP;
  } else {
    otpType = otpTypes.forgetPasswordOTP;
  }
  return otpType;
};

const getUserData = async (ctx, otpType) => {
  let user;
  if (otpType === otpTypes.registrationOTP) {
    let tokenData;
    try {
      const code = ctx.request.query?.code;
      tokenData = await getService('jwt').verify(code);
    } catch (error) {
      throw new errors.ValidationError('INVALID_TOKEN');
    }
    user = getUser(tokenData.id, tokenData.role);
  } else if (otpType === otpTypes.forgetPasswordOTP) {
    const { identifier, role } = ctx.request.body;
    if (
      (!identifier.match(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/) &&
        !identifier.match(/^01[0125][0-9]{8}$/)) ||
      identifier.includes('soatest.com')
    ) {
      throw new errors.ValidationError('INVALID_IDENTIFIER', {
        errors: [
          {
            path: ['OTP'],
            message: 'Invalid identifier',
            name: 'ValidationError',
          },
        ],
      });
    }
    user = getUser(identifier, role);
  } else if (otpType === otpTypes.updateUserMobileNumberOTP) {
    user = ctx.state.user;
  }
  return user;
};
const validateCode = async (code, OTP) => {
  if (OTP.code !== code) {
    throw new errors.ValidationError('INVALID_OTP', {
      errors: [
        {
          path: ['OTP'],
          message: 'Invalid OTP',
          name: 'ValidationError',
        },
      ],
    });
  }
  const date = new Date();
  const expireDate = new Date(OTP.expireDate);
  const otpValidation =
    date.getDate() == expireDate.getDate() &&
    date.getTime() <= expireDate.getTime();

  if (!otpValidation) {
    throw new errors.ValidationError('INVALID_OTP', {
      errors: [
        {
          path: ['OTP'],
          message: 'Invalid OTP',
          name: 'ValidationError',
        },
      ],
    });
  }
  return { otpValidation: true };
};

const createOtpSMSTemplate = (code) => {
  return `الكود المتغير الخاص بكم هو ${code} برجاء عدم مشاركته مع أحد للحفاظ على أمان حسابك`;
};

const createOtpForgotPasswordSMSTemplate = (code, username) => {
  return `لقد تلقينا للتو أنك نسيت كلمة المرور الخاصة بـ${username} يمكنك إعادة تعيين كلمة المرور الخاصة بك من خلال ادخال هذا الكود السرى, ${code} \nبرجاء عدم مشاركتة مع احد للحفاظ على امان حسابك`;
};

const sendOTP = (user, otpType) => {
  if (
    otpType === otpTypes.forgetPasswordOTP &&
    user.OTP.identifier.match(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/)
  ) {
    strapi
      .service('api::notification.notification')
      .sendForgotPasswordOTP(user.email, user.OTP.code);
  } else if (
    otpType === otpTypes.forgetPasswordOTP &&
    user.OTP.identifier.match(/^01[0125][0-9]{8}$/)
  ) {
    strapi.service('api::notification.notification').sendSMS({
      to: user.phone,
      text: createOtpForgotPasswordSMSTemplate(user.OTP.code, user.username),
    });
  } else if (otpType === otpTypes.registrationOTP) {
    strapi.service('api::notification.notification').sendSMS({
      to: user.phone,
      text: createOtpSMSTemplate(user.OTP.code),
    });
  }
};
module.exports = {
  otpTypes,
  predictOtpType,
  getUserData,
  generateCode,
  validateCode,
  sendOTP,
  createOtpSMSTemplate,
  createOtpForgotPasswordSMSTemplate,
};
