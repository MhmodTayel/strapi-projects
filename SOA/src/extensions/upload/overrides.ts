import { fromStream } from 'file-type';
import utils from '@strapi/utils';
const { errors } = utils;
import {
  GENERAL_ALLOWED_UPLOAD_MIME_TYPES,
  ALLOWED_UPLOAD_MIME_TYPES_FOR_STRAPI_USERS,
} from '../../helpers/constants';
const { soaApisCallersSides } = require('../../helpers/generalHelpers');

export const checkFileTypeAndUpload = async (file, callerSide) => {
  // const fileType = await fromStream(file.getStream());

  const allowedTypes =
    callerSide === soaApisCallersSides.strapiPortal
      ? GENERAL_ALLOWED_UPLOAD_MIME_TYPES
      : GENERAL_ALLOWED_UPLOAD_MIME_TYPES.concat(
          ALLOWED_UPLOAD_MIME_TYPES_FOR_STRAPI_USERS
        );

  if (!file || !allowedTypes.includes(file.mime))
    throw new errors.ApplicationError('Unsupported file type');
};
