import _ from 'lodash';
import { randomBytes } from 'crypto';
const {
  getUser,
  userModels,
  userRoles,
  generateRandPassword,
} = require('../../helpers/generalHelpers');
const {
  generateCode,
  createOtpForgotPasswordSMSTemplate,
  createOtpSMSTemplate,
  otpTypes,
} = require('../../helpers/otpHelpers');
import { getService } from '@strapi/plugin-users-permissions/server/utils';
import { validateCallbackBody } from '@strapi/plugin-users-permissions/server/controllers/validation/auth';
const auth = require('@strapi/admin/server/services/auth');
import utils from '@strapi/utils';
const { errors, parseMultipartData, validateYupSchemaSync, yup, sanitize } =
  utils;

const sanitizeUser = (user, ctx) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel('plugin::users-permissions.user');

  return sanitize.contentAPI.output(user, userSchema, { auth });
};

function generateUniqueEmail() {
  const domain = 'soatest.com';
  const uniqueId = Math.random().toString(36).substr(2, 9); // Generate a random unique ID

  return `soa-email-${uniqueId}@${domain}`;
}

export default (plugin) => {
  plugin.controllers.auth.callback = async (ctx) => {
    let jwtKey;
    const { role } = ctx.request.body;
    if (!role) {
      throw new errors.ApplicationError('role is required');
    }
    if (!userModels[role]) {
      throw new errors.ValidationError('invalid role');
    }
    const provider = ctx.params.provider || 'local';
    const params = ctx.request.body;
    const UID = userModels[role];

    const store = strapi.store({ type: 'plugin', name: 'users-permissions' });
    const grantSettings = await store.get({ key: 'grant' });
    const grantProvider = provider === 'local' ? 'email' : provider;

    if (!_.get(grantSettings, [grantProvider, 'enabled'])) {
      throw new errors.ApplicationError('This provider is disabled');
    }

    if (provider === 'local') {
      await validateCallbackBody(params);
      const { identifier } = params;

      if (identifier.includes('soatest.com'))
        throw new errors.ValidationError('Invalid identifier or password');
      const identifiers: any = [
        { email: identifier.toLowerCase() },
        { username: identifier },
      ];
      if (role === userRoles.TALENT) identifiers.push({ phone: identifier });
      const user = await strapi.db.query(UID).findOne({
        where: {
          provider,
          $or: identifiers,
        },
        populate: ['role', 'avatar'],
      });
      if (!user) {
        throw new errors.ValidationError('Invalid identifier or password');
      }
      if (!user.password) {
        throw new errors.ValidationError('Invalid identifier or password');
      }
      const validPassword = await getService('user').validatePassword(
        params.password,
        user.password
      );
      if (!validPassword) {
        throw new errors.ValidationError('Invalid identifier or password');
      }

      if (user.blocked === true) {
        throw new errors.ApplicationError(
          'Your account has been blocked by an administrator'
        );
      }
      if (!user.jwtKey) {
        jwtKey = randomBytes(8).toString('hex');

        await strapi.db.query(UID).update({
          where: {
            id: user.id,
          },
          data: {
            jwtKey,
          },
        });
      } else {
        jwtKey = user.jwtKey;
      }

      if (
        !user.confirmed &&
        !user.addedFromAdminPortal &&
        (!user.OTP || user.OTP.serviceType !== otpTypes.registrationOTP)
      ) {
        const otpInfo = generateCode(user.phone, 1, otpTypes.registrationOTP);
        await strapi.db.query('plugin::users-permissions.user').update({
          where: {
            id: user.id,
          },
          data: {
            OTP: otpInfo,
          },
        });
        strapi.service('api::notification.notification').sendSMS({
          to: user.phone,
          text: createOtpSMSTemplate(otpInfo.code),
        });
      }
      if (user.addedFromAdminPortal && !user.confirmed) {
        user.code = user.resetPasswordToken;
      }

      return ctx.send({
        jwt: getService('jwt').issue({
          id: user.id,
          role: role,
          jwtKey,
        }),
        user: await sanitizeUser(user, ctx),
      });
    }

    // Connect the user with the third-party provider.
    try {
      const user = await getService('providers').connect(provider, ctx.query);

      return ctx.send({
        jwt: getService('jwt').issue({ id: user.id }),
        user: await sanitizeUser(user, ctx),
      });
    } catch (error) {
      throw new errors.ApplicationError(error.message);
    }
  };

  const userRegister = plugin.controllers.auth.register;
  plugin.controllers.auth.register = async (ctx) => {
    try {
      const { data, files } = parseMultipartData(ctx);
      ctx.request.body = data;
      const { username, email, syndicateID, division, phone, avatar } = data;

      const validationErrors = [];
      const existingEmail = await strapi
        .query('plugin::users-permissions.user')
        .count({
          where: { email },
        });
      if (existingEmail) {
        validationErrors.push({
          path: 'email',
          errorMsg: 'Email must be unique',
        });
      }

      const existingUsername = await strapi
        .query('plugin::users-permissions.user')
        .count({
          where: { username },
        });

      if (existingUsername) {
        validationErrors.push({
          path: 'username',
          errorMsg: 'Username must be unique',
        });
      }

      const existingphone = await strapi
        .query('plugin::users-permissions.user')
        .count({
          where: { phone },
        });

      if (existingphone) {
        validationErrors.push({
          path: 'phone',
          errorMsg: 'This attribute must be unique',
        });
      }
      const syndicateMember = await strapi.db
        .query('api::syndicate-member.syndicate-member')
        .findOne({
          where: {
            syndicateID: syndicateID,
            division: division,
          },
          populate: ['renewalRequests'],
        });

      if (!syndicateMember) {
        validationErrors.push({
          path: 'syndicateID',
          errorMsg: 'syndicateID not valid',
        });
      }
      const syndicate = await strapi.db
        .query('plugin::users-permissions.user')
        .findOne({
          where: {
            syndicateID: syndicateID,
            division: division,
          },
        });

      if (syndicate) {
        validationErrors.push({ path: 'syndicateID' });
      }

      if (validationErrors.length) {
        throw new errors.ValidationError('UNIQUE_FIELDS', {
          errors: validationErrors.map((field) => ({
            path: [field.path],
            message: field.errorMsg || `${field.path} must be unique`,
            name: 'ValidationError',
          })),
        });
      }
      if (
        !avatar ||
        (Array.isArray(avatar) && !avatar.length) ||
        !Object.keys(avatar).length
      ) {
        throw new errors.ValidationError('AVATAR_IS_REQUIRED', {
          errors: [
            {
              path: ['avatar'],
              message: 'avatar is required',
              name: 'ValidationError',
            },
          ],
        });
      }
      ctx.request.body.email = ctx.request.body.email || generateUniqueEmail();
      // ctx.request.body.confirmed = false;
      // ctx.request.body.member = syndicateMember;
      // console.log({ syndicateMember: JSON.stringify(syndicateMember) });

      // ctx.request.body = {
      //   ...ctx.request.body,
      //   ...(syndicateMember.renewalRequests && {
      //     renewalRequests: syndicateMember.renewalRequests,
      //   }),
      // };
      // ctx.request.body.renewalRequestStatus =
      //   syndicateMember.renewalRequestStatus;
    } catch (error) {
      throw error;
    }
    await userRegister(ctx);
  };
  const userCreate = plugin.controllers.contentmanageruser.create;
  const userUpdate = plugin.controllers.contentmanageruser.update;

  plugin.controllers.contentmanageruser.create = async (ctx) => {
    ctx.request.body.email = ctx.request.body.email || generateUniqueEmail();

    const password = generateRandPassword(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_])[A-Za-z\d@$!%*?&#_]{8,10}$/
    );
    ctx.request.body.password = password;
    ctx.request.body.mailedPassword = password;
    ctx.request.body.confirmed = false;
    const role: any = await strapi.db
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'talent' } });

    ctx.request.body.role = {
      disconnect: [],
      connect: [
        {
          id: role.id,
          position: {
            end: true,
          },
        },
      ],
    };
    await userCreate(ctx);
  };
  plugin.controllers.contentmanageruser.update = async (ctx) => {
    ctx.request.body.email = ctx.request.body.email || generateUniqueEmail();
    const role: any = await strapi.db
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'talent' } });
    console.log({ role });
    ctx.request.body.role = {
      disconnect: [],
      connect: [
        {
          id: role.id,
          position: {
            end: true,
          },
        },
      ],
    };
    await userUpdate(ctx);
  };
  plugin.controllers.auth.forgotPassword = async (ctx) => {
    const { role, identifier } = ctx.request.body;
    if (role !== 'talent' && role !== 'drama_maker') {
      throw new errors.ValidationError('INVALID_ROLE');
    }
    let identifierType;
    if (
      identifier.match(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/)
      // && !identifier.includes('soatest.com')
    ) {
      identifierType = 'email';
    } else if (identifier.match(/^01[0125][0-9]{8}$/)) {
      identifierType = 'phone';
    } else {
      throw new errors.ValidationError('INVALID_IDENTIFIER', {
        errors: [
          {
            path: ['identifier'],
            message: 'invalid identifier',
            name: 'ValidationError',
          },
        ],
      });
    }

    if (
      (role === 'drama_maker' && identifierType === 'phone') ||
      (role === 'talent' && identifierType === 'email')
    ) {
      throw new errors.ValidationError('INVALID_IDENTIFIER', {
        errors: [
          {
            path: ['identifier'],
            message: 'invalid identifier',
            name: 'ValidationError',
          },
        ],
      });
    }
    const UID = userModels[role];
    const user = await getUser(identifier, role);

    if (!user) {
      throw new errors.ValidationError('wrong_credientials');
    }
    if (user.blocked) {
      throw new errors.ValidationError('INVALID_METHOD');
    }
    const otpInfo = generateCode(user[identifierType], 1, 'forgetPassword');

    await strapi.db.query(UID).update({
      where: {
        [identifierType]: identifier.toLowerCase(),
      },
      data: {
        OTP: otpInfo,
      },
    });
    if (identifierType === 'phone') {
      strapi.service('api::notification.notification').sendSMS({
        to: user.phone,
        text: createOtpForgotPasswordSMSTemplate(otpInfo.code, user.username),
      });
    } else {
      strapi
        .service('api::notification.notification')
        .sendForgotPasswordOTP(user.email, otpInfo.code, user.username);
    }

    return { success: true, nextOTPResendTime: otpInfo.nextOTPResendTime };
  };
  plugin.controllers.auth.resetPassword = async (ctx) => {
    const { newPassword } = ctx.request.body;
    const { code } = ctx.request.query;
    let userData;
    try {
      userData = await getService('jwt').verify(code);
    } catch (error) {
      throw new errors.ValidationError('INVALID_TOKEN');
    }
    const { id, role } = userData;
    const UID = userModels[role];
    const user = await strapi.db.query(UID).findOne({
      where: { id },
      populate: ['pushTokens'],
    });
    if (!user) {
      throw new errors.ValidationError('wrong_credientials');
    }
    if (user.blocked || user.resetPasswordToken !== code) {
      throw new errors.ValidationError('INVALID_METHOD');
    }

    if (
      !newPassword.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_])[A-Za-z\d@$!%*?&#_]{8,}$/
      )
    ) {
      throw new errors.ValidationError('PASSWORD_DOES_NOT_MATCH_REGEX', {
        errors: [
          {
            path: ['password'],
            message: "password doesn't match regex",
            name: 'ValidationError',
          },
        ],
      });
    }

    if (role == 'drama_maker') {
      for (let i = 0; i < user.pushTokens.length; i++) {
        await strapi
          .service('api::push.push')
          .unsubscribe(user.pushTokens[i].token, [
            `drama_maker_${user.pushTokens[i].locale}`,
          ]);
      }
    }
    const hashedPassword = await auth.hashPassword(newPassword);
    const data: any = {
      password: hashedPassword,
      resetPasswordToken: null,
      jwtKey: null,
      pushTokens: null,
    };
    if (user.addedFromAdminPortal && !user.confirmed) {
      data.confirmed = true;
    }
    await strapi.db.query(UID).update({
      where: { id },
      data,
    });
    return { sucess: true };
  };
  plugin.controllers.user.changeMobileNumber = async (ctx) => {
    const {
      header: { authorization: token },
      body: { phone },
    } = ctx.request;

    if (!token) {
      throw new errors.ApplicationError('UNAUTHORIZED', {
        errors: [
          {
            message: 'unauthorized',
            name: 'ValidationError',
          },
        ],
      });
    }
    if (!phone) {
      throw new errors.ValidationError('PHONE_NUMBER_IS_REQUIRED', {
        errors: [
          {
            path: ['phone'],
            message: 'phone number is required',
            name: 'ValidationError',
          },
        ],
      });
    }

    const userId = (await getService('jwt').verify(token)).id;
    const existingPhoneNumber = await strapi.db
      .query('plugin::users-permissions.user')
      .findOne({
        where: {
          phone,
        },
      });

    if (existingPhoneNumber) {
      throw new errors.ValidationError('PHONE_NUMBER_MUST_BE_UNIQUE', {
        errors: [
          {
            path: ['phone'],
            message: 'This attribute must be unique',
            name: 'ValidationError',
          },
        ],
      });
    }
    const updatedUser = await strapi.db
      .query('plugin::users-permissions.user')
      .update({
        where: {
          id: userId,
        },
        data: {
          phone,
        },
      });
    const otpRequestNum = updatedUser.OTP.otpRequestNum + 1;
    const otpInfo = generateCode(
      updatedUser.phone,
      otpRequestNum,
      otpTypes.registrationOTP
    );
    await strapi.db.query('plugin::users-permissions.user').update({
      where: {
        id: userId,
      },
      data: {
        OTP: otpInfo,
      },
    });
    strapi.service('api::notification.notification').sendSMS({
      to: updatedUser.phone,
      text: createOtpSMSTemplate(otpInfo.code),
    });
    return { success: true, nextOTPResendTime: otpInfo.nextOTPResendTime };
  };

  
  const changePassword = plugin.controllers.auth.changePassword;
  plugin.controllers.auth.changePassword = async (ctx) => {
    const { password } = ctx.request.body;
    if (
      !password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_])[A-Za-z\d@$!%*?&#_]{8,}$/
      )
    ) {
      throw new errors.ValidationError('PASSWORD_DOES_NOT_MATCH_REGEX', {
        errors: [
          {
            path: ['password'],
            message: "password doesn't match regex",
            name: 'ValidationError',
          },
        ],
      });
    }

    await changePassword(ctx);

    const {
      role: { type },
    } = ctx.state.user;

    const id = ctx.state.user.id;

    const user = await strapi.db.query(userModels[type]).findOne({
      where: {
        id,
      },
      populate: ['pushTokens'],
    });
    if (type == 'drama_maker') {
      for (let i = 0; i < user.pushTokens.length; i++) {
        await strapi
          .service('api::push.push')
          .unsubscribe(user.pushTokens[i].token, [
            `drama_maker_${user.pushTokens[i].locale}`,
          ]);
      }
    } else {
      await strapi.db.query(userModels[type]).update({
        where: {
          id: id,
        },
        data: {
          pushTokens: null,
        },
      });
    }
  };
  plugin.controllers.user.deleteAccount = async (ctx) => {
    const { password: accountPassword } = ctx.request.body;
    const {
      id,
      role: { type },
      password,
    } = ctx.state.user;

    const validPassword = await getService('user').validatePassword(
      accountPassword,
      password
    );
    if (!validPassword) throw new errors.ValidationError('Invalid password');
    const UID = userModels[type];
    const user = await strapi.db.query(UID).findOne({
      where: {
        id,
      },
      populate: ['pushTokens'],
    });
    if (type == 'drama_maker') {
      for (let i = 0; i < user.pushTokens.length; i++) {
        await strapi
          .service('api::push.push')
          .unsubscribe(user.pushTokens[i].token, [
            `drama_maker_${user.pushTokens[i].locale}`,
          ]);
      }
    }

    await strapi.db.query(UID).delete({
      where: {
        id,
      },
    });
    return { success: true };
  };
  plugin.controllers.user.update = async (ctx) => {
    try {
      const { id } = ctx.params;
      const { role } = ctx.state.user;
      const UID = userModels[role.type];
      if (+id !== ctx.state.user.id) {
        throw new errors.UnauthorizedError('unauthorized user');
      }
      const allowedTalentAttributesToUpdate = [
        'email',
        'arabicName',
        'englishName',
        'avatar',
      ];
      const allowedDramaMakerAttributesToUpdate = ['email', 'avatar'];
      const allowedDataAttributesToUpdate =
        role.type === 'talent'
          ? allowedTalentAttributesToUpdate
          : allowedDramaMakerAttributesToUpdate;
      const updatedData = _.pick(
        ctx.request.body,
        allowedDataAttributesToUpdate
      );

      let sendOTP = false;
      const { phone, email, arabicName } = ctx.request.body;
      if (role.type === 'talent' && phone && phone !== ctx.state.user.phone) {
        const existingPhone = await strapi.query(UID).count({
          where: { phone },
        });
        if (!phone.match(/^01[0125][0-9]{8}$/)) {
          throw new errors.ValidationError('INVALID_IDENTIFIER', {
            errors: [
              {
                path: ['phone'],
                message: 'Invalid Phone Number',
                name: 'ValidationError',
              },
            ],
          });
        } else if (existingPhone) {
          throw new errors.ValidationError('INVALID_IDENTIFIER', {
            errors: [
              {
                path: ['phone'],
                message: 'Phone must be unique',
                name: 'ValidationError',
              },
            ],
          });
        } else {
          sendOTP = true;
        }
      }
      if (!email && role.type === 'talent') {
        updatedData.email = generateUniqueEmail();
      }

      if (sendOTP) {
        const otpInfo = generateCode(
          phone,
          1,
          otpTypes.updateUserMobileNumberOTP
        );
        updatedData.OTP = otpInfo;
      }
      await strapi.entityService.update(UID, id, {
        data: updatedData,
      });
      if (sendOTP) {
        await strapi.service('api::notification.notification').sendSMS({
          to: phone,
          text: createOtpSMSTemplate(updatedData.OTP.code),
        });
      }

      if (role.type == 'talent' && arabicName) {
        await strapi.db
          .query('api::soa-request-renewal.soa-request-renewal')
          .updateMany({
            where: {
              userId: ctx.state.user.id,
            },
            data: {
              talent_name: arabicName,
            },
            options: { ignoreLifecycle: true },
          });
      }
      return {
        success: true,
        sendOTP,
        ...(sendOTP && {
          nextOTPResendTime: updatedData.OTP.nextOTPResendTime,
        }),
      };
    } catch (error) {
      throw error;
    }
  };
  const findUser = plugin.controllers.user.findOne;
  plugin.controllers.user.findOne = async (ctx) => {
    const { id: userId } = ctx.state.user;
    const { id } = ctx.request.params;
    if (userId != id) throw new errors.UnauthorizedError('unauthorized');
    await findUser(ctx);
  };

  // const findAllUser = plugin.controllers.user.find;
  plugin.controllers.user.find = async (ctx) => {
    //find all users for populating user on profiles
    // const {
    //   role: { type: role },
    // } = ctx.state.user;
    // console.log({ role });
    // if (role !== 'drama_maker')
    throw new errors.UnauthorizedError('unauthorized');

    // const { id } = ctx.request.params;
    // if (userId != id) throw new errors.UnauthorizedError('unauthorized');
    // await findAllUser(ctx);
  };

  plugin.controllers.user.logout = async (ctx) => {
    const user = _.get(ctx, 'state.user');
    const { role } = user;
    const {
      header: { authorization: token },
    } = ctx.request;
    const { pushToken, locale } = ctx.request.body;
    const UID = userModels[role.type];
    await strapi.entityService.update(UID, user.id, {
      data: {
        pushTokens: null,
      },
    });

    await strapi.db
      .query('api::push-token.push-token')
      .delete({ where: { token: pushToken } });

    if (role.type === 'drama_maker' && pushToken) {
      await strapi
        .service('api::push.push')
        .unsubscribe(pushToken, [`drama_maker_${locale}`]);
    }
    await strapi.service('api::black-listed-token.black-listed-token').create({
      data: {
        token,
      },
    });
    return { success: true };
  };

  // custom route
  plugin.routes['content-api'].routes.push(
    {
      method: 'POST',
      path: '/user/changeMobileNumber',
      handler: 'user.changeMobileNumber',
      config: {
        prefix: '',
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/user/deleteAccount',
      handler: 'user.deleteAccount',
      config: {
        prefix: '',
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/users/logout',
      handler: 'user.logout',
      config: {
        prefix: '',
      },
    }
  );

  return plugin;
};
