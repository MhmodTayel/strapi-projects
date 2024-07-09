'use strict';

/**
 * A set of functions called "actions" for `upload`
 */

const utils = require('@strapi/utils');
const { sanitize, errors } = utils;
const sanitizeOutput = async (data, ctx) => {
    const schema = strapi.getModel('plugin::upload.file');
    const { auth } = ctx.state;
    return sanitize.contentAPI.output(data, schema, { auth });
};
const { yup, validateYupSchema } = require('@strapi/utils');

const fileInfoSchema = yup
    .object({
        name: yup.string().nullable(),
        alternativeText: yup.string().nullable(),
        caption: yup.string().nullable()
    })
    .noUnknown();

const uploadSchema = yup.object({
    fileInfo: fileInfoSchema
});

const multiUploadSchema = yup.object({
    fileInfo: yup.array().of(fileInfoSchema)
});

const validateUploadBody = (data = {}, isMulti = false) => {
    const schema = isMulti ? multiUploadSchema : uploadSchema;

    return validateYupSchema(schema, { strict: false })(data);
};

async function createFolder(folderPath = 'API Uploads') {
    const folderNames = folderPath.split('/');

    // Initialize folder object with the first folder name in the path
    let parentFolder = null;
    for (const folderName of folderNames) {
        const existingFolder = await strapi.query('plugin::upload.folder').findOne({
            where: {
                name: folderName,
                parent: parentFolder ? parentFolder.id : null
            }
        });

        if (existingFolder) {
            // If folder already exists, set it as the parent for the next iteration
            parentFolder = existingFolder;
        } else {
            // If folder doesn't exist, create a new folder
            const newFolder = await strapi.plugins.upload.services.folder.create({
                name: folderName,
                parent: parentFolder ? parentFolder.id : null
            });

            // Set the newly created folder as the parent for the next iteration
            parentFolder = newFolder;
        }
    }

    return parentFolder;
}

function validatePath(path) {
    if (!path || path.trim() === '') {
        throw new Error('Path cannot be null or empty.');
    }
    if (path.startsWith('/') || path.endsWith('/')) {
        throw new Error('Path cannot start or end with "/".');
    }
    if (path.includes('//')) {
        throw new Error('Path cannot contain consecutive "/".');
    }
    if (path === '/') {
        throw new Error('Path cannot be just "/".');
    }
    if (!path.includes('/')) {
        throw new Error('Path must contain at least one directory or sub directory name.');
    }
    if (!/^[\w\-/]+$/.test(path)) {
        throw new Error('Path contains invalid characters.');
    }
    return true;
}

module.exports = {
    customUpload: async (ctx) => {
        const {
            request: {
                body,
                files: { files }
            }
        } = ctx;

        const data = await validateUploadBody(body, Array.isArray(files));

        const { path } = body;

        try {
            validatePath(path)
            const apiUploadFolder = await createFolder(path && `${path}`);
            if (Array.isArray(files)) {
                data.fileInfo = data.fileInfo || [];
                data.fileInfo = files.map((_f, i) => ({
                    ...data.fileInfo[i],
                    folder: +apiUploadFolder.id,
                    alternativeText: apiUploadFolder.name
                }));
            } else {
                data.fileInfo = {
                    ...data.fileInfo,
                    folder: apiUploadFolder.id,
                    alternativeText: apiUploadFolder.name
                };
            }

            data.path = `${path? path : 'API Uploads'}`;
            const uploadedFiles = await strapi.plugins.upload.services.upload.upload({
                data,
                files: files
            });
            ctx.body = await sanitizeOutput(uploadedFiles, ctx);

            return { apiUploadFolder };
        } catch (error) {
            console.log(error);
            throw new errors.ApplicationError(error.message || error);
        }
    }
};
