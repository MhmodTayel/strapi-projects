'use strict';
// Import necessary modules and libraries
const _ = require('lodash');
const utils = require('@strapi/utils');
const { errors } = utils;
const auth_email = require('./controllers/Auth_email');
var url = require('url');
const { sanitizeEntity } = require('strapi-utils');
const auth = require('@strapi/admin/server/services/auth');
const emailRegExp = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const createUser = async (params) => {
  const user = strapi.entityService.create('plugin::users-permissions.user', {
    data: params,
    populate: ['role'],
  });
  return user;
};
const createCustomer = async (params) => {
  const user = strapi.entityService.create('api::customer.customer', {
    data: params,
  });
  return user;
};
const formatError = (error) => [
  { messages: [{ id: error.id, message: error.message, field: error.field }] },
];

const getTranslationStrings = async (locale) => {
  let _translationStrings = await strapi.entityService.findMany(
    'api::translation-string.translation-string',
    {
      locale,
    }
  );
  //create a more usable structure for the translation_strings
  let tr = {};
  _translationStrings.forEach((node) => {
    tr[node.category] = node.content;
  });
  return tr;
};
// Export the plugin function
module.exports = (plugin) => {
  plugin.controllers.auth.register = async (ctx) => {
    try {
      const { locale, customerType, company_name } = ctx.request.body;
      if (!locale || locale === 'undefined') locale = 'en';
      console.log('Auth.js register endpoint. locale:', locale);
      const tr = await getTranslationStrings(locale);
      const pluginStore = await strapi.store({
        environment: '',
        type: 'plugin',
        name: 'users-permissions',
      });

      const settings = await pluginStore.get({
        key: 'advanced',
      });

      // check that registration is allowed in CMS
      if (!settings.allow_register) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.advanced.allow_register',
            message:
              tr?.['authentication']?.['errors']?.[
                'Registration is currently disabled.'
              ],
          })
        );
      }

      if (customerType == 'company') {
        if (!company_name)
          throw new errors.ValidationError(
            'Please provide a valid company name.'
          );
      }
      //create a "params" object from the request body, to add more properties needed to create the new user
      const params = {
        ..._.omit(ctx.request.body, [
          'confirmed',
          'confirmationToken',
          'resetPasswordToken',
        ]),
        provider: 'local',
      };
      // check if password is supplied
      if (!params.password) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.password.provide',
            message:
              tr?.['authentication']?.['errors']?.[
                'Please provide your password.'
              ],
          })
        );
      }

      // check if email is provided
      if (!params.email) {
        return ctx.badRequest(
          tr?.['authentication']?.['errors']?.['Please provide your email.']
        );
      }

      // get the default role
      const default_role = await strapi
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: settings.default_role } });

      const role = await strapi
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: customerType } });

      if (!default_role) {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.role.notFound',
            message: "Can't find the default role.",
          })
        );
      }

      params.role = role ? role.id : default_role.id;

      // Check if the provided email is valid or not.
      const isEmail = emailRegExp.test(params.email);
      if (isEmail) {
        params.email = params.email.toLowerCase();
      } else {
        return ctx.badRequest(
          null,
          formatError({
            id: 'Auth.form.error.email.format',
            message:
              tr?.['authentication']?.['errors']?.[
                'Please provide a valid email address.'
              ],
          })
        );
      }

      // check that no user already exists with the same email address (and 'local' - email login provider)

      const identifierFilter = {
        $or: [
          { email: params.email.toLowerCase() },
          { username: params.email.toLowerCase() },
          { username: params.username },
          { email: params.username },
        ],
      };

      const conflictingUserCount = await strapi
        .query('plugin::users-permissions.user')
        .count({
          where: { ...identifierFilter },
        });

      if (conflictingUserCount > 0) {
        throw new errors.ValidationError('Email or Username are already taken');
      }

      if (settings.unique_email) {
        const conflictingUserCount = await strapi
          .query('plugin::users-permissions.user')
          .count({
            where: { ...identifierFilter },
          });

        if (conflictingUserCount > 0) {
          throw new errors.ValidationError(
            'Email or Username are already taken'
          );
        }
      }

      try {
        // if no confirmation is needed --> set to confirmed
        if (!settings.email_confirmation) {
          params.confirmed = true;
        }

        //--------------------
        // create the new user
        //--------------------
        params.lastLocale = locale;
        params.registered = true;
        const user = await createUser(params);
        //find the corresponding customer and attach to the user object
        //(automatically created right after createUser - see /extensions/users-permissions/controllers/models/User.js)
        const customer = await strapi.db
          .query('api::customer.customer')
          .findOne({ where: { user: user.id } });

        user.customer = customer
          ? customer
          : await createCustomer({
              ...params,
              user: user.id,
              type: customerType,
            });

        // check if a confirmation email is needed (see CMS settings)
        // if yes --> send email and return response
        const jwt = strapi.plugins['users-permissions'].services.jwt.issue(
          _.pick(user, ['id'])
        );
        const sanitizedUser = _.omit(user, 'password');
        if (settings.email_confirmation) {
          try {
            //CHANGED: make sending of the confirmation email asynchronous, so that the frontend doesn't have to wait for it
            // await strapi.plugins['users-permissions'].services.user.sendConfirmationEmail(user);
            //TODO: replace this with my own email sending procedure
            auth_email.sendConfirmEmailMessage(user, user.customer, locale);
            // strapi.plugins['users-permissions'].services.user.sendConfirmationEmail(user);
          } catch (err) {
            return ctx.badRequest(null, err);
          }

          //return a response with only the user object (no JWT token yet, waiting for email confirmation)
          return ctx.send({ user: sanitizedUser, jwt });
        } else {
          if (customerType === 'individual') {
            auth_email.sendWelcomeEmailIndividual(user, user.customer, locale);
          } else {
            auth_email.sendWelcomeEmailCompany(user, user.customer, locale);
          }
        }

        // if no confirmation email is needed
        // --> return a response with a JWT token and the user object

        return ctx.send({
          jwt,
          user: sanitizedUser,
        });
      } catch (err) {
        console.log({ err });

        throw err;
      }
    } catch (err) {
      console.log('Auth.js register error:', err);
      throw err;
    }
  };

  /**
   * Controller function for handling forgot password requests.
   * @param {Object} ctx - Koa context object containing request and response details.
   */
  plugin.controllers.auth.forgotPassword = async (ctx) => {
    try {
      // Extract email and locale from the request body
      const { email, locale } = ctx.request.body;

      // Find user by email in the users-permissions plugin database
      const user = await strapi.db
        .query('plugin::users-permissions.user')
        .findOne({ where: { email: email.toLowerCase() } });

      // Throw an error if user not found or blocked
      if (!user || user.blocked)
        throw new errors.NotFoundError('Email address not found');

      // Send a reset password email using the auth_email helper function
      await auth_email.sendResetPasswordMail(user, null, locale);

      // Send a success response
      ctx.send({ ok: true });
    } catch (error) {
      // Catch and rethrow any errors as ApplicationError
      throw new errors.ApplicationError(error);
    }
  };


  plugin.controllers.auth.emailConfirmation = async (ctx, next, returnUser) => {
    try {
      const { confirmation: confirmationToken, locale = 'en' } = ctx.query;
      const { user: userService, jwt: jwtService } =
        strapi.plugins['users-permissions'].services;
      if (_.isEmpty(confirmationToken)) {
        return ctx.badRequest('token.invalid');
      }

      const [user] = await userService.fetchAll({
        filters: { confirmationToken },
      });
      if (!user) {
        throw new errors.ValidationError('Invalid token');
      }

      await userService.edit(user.id, {
        confirmed: true,
        confirmationToken: null,
      });

      const customer = await strapi.db
        .query('api::customer.customer')
        .findOne({ where: { user: user.id } });
      if (customer.type === 'individual') {
        auth_email.sendWelcomeEmailIndividual(user, customer, locale);
      } else {
        auth_email.sendWelcomeEmailCompany(user, customer, locale);
      }

      if (returnUser) {
        ctx.send({
          jwt: jwtService.issue({ id: user.id }),
          user: _.omit(user, 'password'),
        });
      } else {
        const settings = await strapi
          .store({
            environment: '',
            type: 'plugin',
            name: 'users-permissions',
            key: 'advanced',
          })
          .get();

        ctx.redirect(settings.email_confirmation_redirection || '/');
      }
    } catch (error) {
      throw new errors.ApplicationError(error);
    }
  };

  /**
   * Controller function for handling the second step of user registration.
   * @param {Object} ctx - Koa context object containing request and response details.
   */
  plugin.controllers.user.registrationStepTwo = async (ctx) => {
    try {
      // Extract relevant data from the request body
      const {
        name_first,
        name_last,
        company_name,
        email,
        locale,
        customerType,
      } = ctx.request.body;
      const user = ctx.state.user;

      // Check if the customerType is valid
      if (!['individual', 'company'].includes(customerType))
        throw 'Not allowed role';

      // Proceed only if the user is not already registered
      if (!user.registered) {
        // Find the role associated with the given customerType
        const role = await strapi
          .query('plugin::users-permissions.role')
          .findOne({ where: { type: customerType } });

        // Update user details to mark registration completion
        const updatedUser = await strapi.db
          .query('plugin::users-permissions.user')
          .update({
            where: { id: user.id },
            data: {
              registered: true,
              lastLocale: locale,
              role: role.id,
              ...(user.provider == 'weChat' && { email }),
            },
          });

        // Create a customer record for the user
        const customer = await createCustomer({
          user: user.id,
          type: customerType,
          company_name,
          name_last,
          name_first,
        });

        // Attach customer and role details to the updated user object
        updatedUser.customer = customer;
        updatedUser.role = role;

        // Issue a JWT token for the user
        const jwt = strapi.plugins['users-permissions'].services.jwt.issue(
          _.pick(user, ['id'])
        );

        // Send a welcome email based on the customer type
        if (customer.type === 'individual') {
          auth_email.sendWelcomeEmailIndividual(user, customer, locale);
        } else {
          auth_email.sendWelcomeEmailCompany(user, customer, locale);
        }

        // Return the updated user object and JWT token
        return { user: updatedUser, jwt };
      }
    } catch (error) {
      // Catch and rethrow any errors as ApplicationError
      throw new errors.ApplicationError(error);
    }
  };


  // Define the routes for uploading and getting document URLs
  plugin.routes['content-api'].routes.push({
    method: 'POST',
    path: '/auth/register/step-two',
    handler: 'user.registrationStepTwo',
    config: {
      prefix: '',
      policies: ['global::isAuthenticated'],
    },
  });

  return plugin;
};
