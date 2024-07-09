import utils from '@strapi/utils';
const { errors } = utils;
import RandExp from 'randexp';

const userModels = {
  talent: 'plugin::users-permissions.user',
  drama_maker: 'api::drama-maker.drama-maker',
};
const userRoles = {
  TALENT: 'talent',
  DRAMA_MAKER: 'drama_maker',
};
const requestStatus = {
  CREATE: 'create',
  UPDATE: 'update',
  PUBLISH: 'publish',
  DRAFT: 'draft',
};
const soaApisCallersSides = {
  strapiAdmin: 'adminPanal',
  strapiPortal: 'portal',
};
const getUser = async (identifier, role) => {
  if (role !== 'talent' && role !== 'drama_maker') {
    throw new errors.ValidationError('INVALID_ROLE', {
      errors: [
        {
          path: ['OTP'],
          message: 'Invalid role',
          name: 'ValidationError',
        },
      ],
    });
  }
  const UID = userModels[role];
  let user;
  let userQuery: any = [];
  if (typeof identifier === 'number') {
    userQuery.push({ id: identifier });
  } else if (role === 'talent') {
    userQuery.push({ phone: identifier }, { email: identifier.toLowerCase() });
  } else {
    userQuery.push({ email: identifier.toLowerCase() });
  }
  user = await strapi.db.query(UID).findOne({
    where: {
      $or: userQuery,
    },
    populate: ['role'],
  });

  return user;
};

const checkRequestStatus = (data, oldData) => {
  let result;
  if (data.publishedAt) result = requestStatus.PUBLISH;
  else if (!data.publishedAt && oldData.publishedAt)
    result = requestStatus.UPDATE;
  else result = requestStatus.DRAFT;
  return result;
};

const addLink = async (event) => {
  const {
    action,
    params: { data, where },
    model: { tableName, uid },
  } = event;

  let oldData;
  let status;
  if (action == 'beforeUpdate') {
    oldData = await strapi.db.query(uid).findOne({
      where,
    });
    status = checkRequestStatus(data, oldData);
  }
  if (status == requestStatus.PUBLISH) return;
  if (status == requestStatus.UPDATE && (!data.Title || !data.Name)) return;
  const url = data.Title || data.Name;
  if (url) data.Link = `/${tableName}/${encodeURIComponent(url.trim())}`;
  else data.Link = null;
};

const detectApiCallerSide = (ctx) => {
  let callerSide;

  if (
    ctx.request.url.includes('/content-manager/') ||
    ctx.request.url.includes('/services')
  ) {
    callerSide = soaApisCallersSides.strapiAdmin;
  } else {
    callerSide = soaApisCallersSides.strapiPortal;
  }
  return callerSide;
};

const replaceWildcard = (original, wildcard_code, wildcard_value) => {
  const regexp_txt = `<${wildcard_code}>`;
  const regexp = new RegExp(regexp_txt, 'g');
  const ret = original.replace(regexp, wildcard_value || '');
  return ret;
};

const generateRandPassword = (regex) => {
  let password = '';
  do {
    password = new RandExp(regex).gen();
  } while (!password.match(regex));
  return password;
};

module.exports = {
  userModels,
  userRoles,
  requestStatus,
  soaApisCallersSides,
  getUser,
  checkRequestStatus,
  addLink,
  detectApiCallerSide,
  replaceWildcard,
  generateRandPassword,
};
