/**
 * otp controller
 */
import utils from '@strapi/utils';
const { errors } = utils;
import { getService } from '@strapi/plugin-users-permissions/server/utils';
const { userModels } = require('../../../helpers/generalHelpers');
const {
  validateCode,
  generateCode,
  otpTypes,
  predictOtpType,
  getUserData,
  sendOTP,
} = require('../../../helpers/otpHelpers');

export default {
  verify: async (ctx, next) => {
    try {
      const otpType = predictOtpType(ctx);
      const user = await getUserData(ctx, otpType);
      if (!user) {
        throw new errors.ValidationError('wrong_credientials', {
          errors: [
            {
              path: ['OTP'],
              message: 'wrong_credientials',
              name: 'ValidationError',
            },
          ],
        });
      }

      if (!user.OTP || user.OTP.serviceType !== otpType) {
        throw new errors.ValidationError('INVALID_METHOD', {
          errors: [
            {
              path: ['OTP'],
              message: 'User does not exist',
              name: 'ValidationError',
            },
          ],
        });
      }
      const { code } = ctx.request.body;
      let data;
      let result;
      const { otpValidation } = await validateCode(code, user.OTP);
      if (otpValidation && otpType === otpTypes.registrationOTP) {
        data = { confirmed: { set: true }, OTP: null };
        result = { otpValidation };
      } else if (otpValidation && otpType === otpTypes.forgetPasswordOTP) {
        const code = getService('jwt').issue({
          id: user.id,
          role: user.role.type,
        });
        data = { resetPasswordToken: code, OTP: null };
        if (
          user.role.type === 'talent' &&
          !user.addedFromAdminPortal &&
          !user.confirmed
        )
          data.confirmed = true;
        result = { otpValidation, code };
      } else if (
        otpValidation &&
        otpType === otpTypes.updateUserMobileNumberOTP
      ) {
        data = { phone: user.OTP.identifier, OTP: null };
        result = { otpValidation };
      }
      const UID = userModels[user.role.type];
      await strapi.db.query(UID).update({
        where: { id: user.id },
        data,
      });
      return result;
    } catch (error) {
      throw error;
    }
  },

  resend: async (ctx, next) => {
    try {
      const otpType = predictOtpType(ctx);
      let user = await getUserData(ctx, otpType);
      if (!user) {
        throw new errors.ValidationError('wrong_credientials', {
          errors: [
            {
              path: ['OTP'],
              message: 'wrong_credientials',
              name: 'ValidationError',
            },
          ],
        });
      }

      if (!user.OTP || user.OTP.serviceType !== otpType) {
        throw new errors.ValidationError('INVALID_METHOD', {
          errors: [
            {
              path: ['OTP'],
              message: 'User does not exist',
              name: 'ValidationError',
            },
          ],
        });
      }
      const date = new Date();
      const resendDate = new Date(user.OTP.nextOTPResendTime);
      const otpResendValidation =
        date.getDate() == resendDate.getDate() &&
        date.getTime() < resendDate.getTime();
      if (otpResendValidation) {
        throw new errors.ValidationError('TIME_TO_RESEND_OTP_DOSE_NOT_END', {
          errors: [
            {
              path: ['OTP'],
              message: 'Time to resend otp does not end',
              name: 'ValidationError',
            },
          ],
        });
      }
      const otpRequestNum = user.OTP.otpRequestNum + 1;
      const otpInfo = generateCode(
        user.OTP.identifier,
        otpRequestNum,
        user.OTP.serviceType
      );
      const UID = userModels[user.role.type];
      user = await strapi.db.query(UID).update({
        where: { id: user.id },
        data: {
          OTP: otpInfo,
        },
      });
      sendOTP(user, otpType);
      return { success: true, nextOTPResendTime: otpInfo.nextOTPResendTime };
    } catch (error) {
      throw error;
    }
  },
};
