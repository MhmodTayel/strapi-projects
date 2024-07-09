'use strict';

/**
 * upload service
 */
// Import necessary modules and libraries
const _ = require('lodash');
const utils = require('@strapi/utils');
const validateUploadBody = require('@strapi/plugin-upload/server/controllers/validation/content-api/upload');
const { supported_files } = require('../../../../util/S3');
const { sanitize, errors } = utils;

const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3Configuration = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_SECRET,
  },
  region: process.env.AWS_REGION,
};
const s3 = new S3Client(s3Configuration);

// Sanitize the output data before sending it as a response
const sanitizeOutput = async (data, ctx) => {
  const schema = strapi.getModel('plugin::upload.file');
  const { auth } = ctx.state;
  return sanitize.contentAPI.output(data, schema, { auth });
};
async function createFolder(folderName, parentFolderName) {
  const folder = {
    name: folderName,
  };

  const parentFolder = await strapi.query('plugin::upload.folder').findOne({
    where: {
      name: parentFolderName,
    },
  });

  if (parentFolder) {
    folder['parent'] = parentFolder.id;
  }
  const existingFolder = await strapi.query('plugin::upload.folder').findOne({
    where: folder,
  });

  const folderData = existingFolder
    ? existingFolder
    : await strapi.plugins.upload.services.folder.create(folder);
  return folderData;
}

async function createPresignedUrl(key) {
  return await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: key,
    }),
    { expiresIn: +process.env.AWS_SIGNED_URL_EXPIRES }
  );
}
const UID = {
  customer: 'api::customer.customer',
  user: 'plugin::users-permissions.user',
};

module.exports = () => ({
  uploadFiles: async ({ ctx, model = 'customer', fieldId }) => {
    const {
      request: { body, files: { document } = {} },
    } = ctx;

    try {
      // Check if the uploaded files have supported file formats
      if (Array.isArray(document)) {
        document.forEach((file) => {
          if (!supported_files.includes(file.type)) {
            throw new errors.ForbiddenError('UNSUPPORTED_FILE_FORMAT');
          }
        });
      } else {
        if (!supported_files.includes(document.type)) {
          throw new errors.ForbiddenError('UNSUPPORTED_FILE_FORMAT');
        }
      }

      // Validate the upload body
      const data = await validateUploadBody(body, Array.isArray(document));

      // Find the customer associated with the user
      const customer = await strapi.db.query(UID.customer).findOne({
        where: { user: ctx.state.user.id },
      });

      if (!customer.uuid)
        throw new errors.ForbiddenError('CUSTOMER_UUID_NOT_FOUND');

      // Create or find a folder based on the customer's UUID
      const apiUploadFolder = await createFolder(
        `${customer.uuid}`,
        'customer-docs'
      );

      // Set the folder and alternative text for uploaded files
      if (Array.isArray(document)) {
        data.fileInfo = data.fileInfo || [];
        data.fileInfo = document.map((_f, i) => ({
          ...data.fileInfo[i],
          folder: +apiUploadFolder.id,
          alternativeText: apiUploadFolder.name,
        }));
      } else {
        data.fileInfo = {
          ...data.fileInfo,
          folder: apiUploadFolder.id,
          alternativeText: apiUploadFolder.name,
        };
      }

      data.path = 'customer-docs/' + apiUploadFolder.name;

      // Upload the files to AWS S3
      const uploadedFiles = await strapi.plugins.upload.services.upload.upload({
        data,
        files: document,
      });

      // attach file to model field id
      const user = strapi.db.query(UID[model]).findOne({
        where: { id: model == 'user' ? ctx.state.user.id : customer.id },
        populate: [fieldId],
      });

      const uploaded_documents = [...uploadedFiles];
      user.uploaded_documents &&
        uploaded_documents.push(...user.uploaded_documents);
      await strapi.db.query(UID[model]).update({
        where: { id: model == 'user' ? ctx.state.user.id : customer.id },
        data: {
          [fieldId]: uploaded_documents,
        },
      });

      // Generate presigned URLs for the uploaded files
      const expiry_date = new Date();
      expiry_date.setMinutes(
        expiry_date.getMinutes() + +process.env.AWS_SIGNED_URL_EXPIRES
      );

      const output = [];

      for (let i = 0; i < uploadedFiles.length; i++) {
        const data = {
          presigned_url: await createPresignedUrl(
            'customer-docs/' +
              apiUploadFolder.name +
              '/' +
              uploadedFiles[i].hash +
              uploadedFiles[i].ext
          ),
          expiry_date,
          fileid: uploadedFiles[i].id,
        };
        output.push(data);
      }
      ctx.body = await sanitizeOutput(output, ctx);
    } catch (error) {
      // Handle any errors that may occur during the file upload process
      console.error('Error uploading files:', error);

      throw new errors.ApplicationError(error.message);
    }
  },
  createPresignedUrl,
});
