import databaseHooks from './boot/databaseHooks';
import seedMenus from './boot/seedMenus';
import seedServices from './boot/seedServices';
import seedNotificationsTemplates from './boot/seedNotificationsTemplates';
import componentsLifecycles from './boot/componentsLifecycles';
import createIndexes from './boot/createIndexes';
import utils from '@strapi/utils';
const { errors } = utils;
import { checkFileTypeAndUpload } from './extensions/upload/overrides';
const { soaApisCallersSides } = require('./helpers/generalHelpers');
// const checkHeaderValidations = (items) => {
//   items.forEach((item) => {
//     if (item.parent) {
//       throw new errors.ApplicationError(
//         `can\'t add sub items in header, please remove  ${item.title} sub item`
//       );
//     }
//   });
//   if (items.length > 6) {
//     throw new errors.ApplicationError(`can\'t add more than 6 items in header`);
//   }
// };

const checkFooterValidations = (items) => {
  const checkIfExistMoreThanTwoItems = items.find(
    (item) => item.order > 1 && !item.parent
  );
  if (checkIfExistMoreThanTwoItems) {
    throw new errors.ValidationError('must have maximum two main menu');
  }
  items.forEach((item1) => {
    if (!item1.parent) {
      let subMenus = 0;
      items.forEach((item2) => {
        if (item2.parent?.id === item1.id) {
          if (!item2.url) {
            throw new errors.ValidationError(`${item2.title} doesn't have url`);
          }
          subMenus++;
        }
      });
      if (item1.order === 0 && (!subMenus || subMenus > 6)) {
        throw new errors.ValidationError(
          'first menu must have at least one sub menu and maximum 6 sub menus'
        );
      }
      if (item1.order === 1 && (!subMenus || subMenus > 3)) {
        throw new errors.ValidationError(
          'second menu must have at least one sub menu and maximum 3 sub menus'
        );
      }
    }
  });
};

const checkIfSuperAdmin = (ctx) => {
  return ctx.state.user.roles.find(
    (role) => role.code === 'strapi-super-admin'
  );
};
export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    // menus-plugin validation
    const updateMenu = strapi.plugin('menus').controllers['menu'].update;
    strapi.plugin('menus').controllers['menu'].update = function (ctx) {
      const CTX = strapi.requestContext.get();
      const { slug, items } = CTX.request.body.data;
      // if (slug === 'header') {
      //   checkHeaderValidations(items);
      // } else if (slug === 'footer') {
      //   checkFooterValidations(items);
      // }
      checkFooterValidations(items);
      return updateMenu.call(this, ctx);
    };

    // upload-plugin restriction for public users
    const uploadService = strapi.plugins.upload.services.upload.upload;
    strapi.plugins.upload.services.upload.upload = function (ctx) {
      let { files } = ctx;

      const CTX = strapi.requestContext.get();
      if (!(CTX.state && CTX.state.user)) {
        if (!Array.isArray(files)) files = [files];
        files.forEach((ele) => {
          const type = ele.type.split('/')[0];

          if (type !== 'image' || ele.type.includes('svg')) {
            throw new errors.ValidationError(`Invalid File Type`);
          }
        });
      }
      return uploadService.call(this, ctx);
    };

    // upload-plugin meme type restriction
    const originalUpload = strapi.plugins.upload.services.provider.upload;
    strapi.plugins.upload.services.provider.upload = async (file) => {
      const CTX = strapi.requestContext.get();

      const callerSide =
        CTX.request.url.includes('/api') && CTX.state && CTX.state.user?.role
          ? soaApisCallersSides.strapiPortal
          : soaApisCallersSides.strapiAdmin;
      try {
        await checkFileTypeAndUpload(file, callerSide);
      } catch (error) {
        throw error;
      }

      return originalUpload(file);
    };

    // show super admin users only for users with superAdmin roles
    const findAdminUsers = strapi.admin.controllers.user.find;
    strapi.admin.controllers.user.find = async (ctx) => {
      const isSuper = checkIfSuperAdmin(ctx);
      if (!isSuper) {
        await findAdminUsers(ctx);
        ctx.body.data.results = ctx.body.data.results.filter((user) => {
          return user.roles.find((role) => role.code !== 'strapi-super-admin');
        });

        return ctx.body.data;
      }

      await findAdminUsers(ctx);
    };

    // show super admin role only for superAdmins users
    const findAdminRoles = strapi.admin.controllers.role.findAll;
    strapi.admin.controllers.role.findAll = async (ctx) => {
      const isSuper = checkIfSuperAdmin(ctx);
      if (!isSuper) {
        await findAdminRoles(ctx);
        ctx.body.data = ctx.body.data.filter((role) => {
          return role.code !== 'strapi-super-admin';
        });
        return ctx.body.data;
      }
      await findAdminRoles(ctx);
    };
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    seedMenus(strapi);
    databaseHooks(strapi);
    seedServices(strapi);
    seedNotificationsTemplates(strapi);
    componentsLifecycles(strapi);
    createIndexes(strapi);
  },
};
