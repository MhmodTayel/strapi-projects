'use strict';

/**
 * teacher service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::teacher.teacher', ({ strapi }) => ({
    async create(params) {
        const model = strapi.contentTypes[("api::teacher.teacher")];

        try {
            // https://forum.strapi.io/t/model-validations-in-a-lifecycle-hook-like-beforeupdate/20871
            // const isDraft = isDraft(params.data, model);
            // const validData = await strapi.entityValidator.validateEntityCreation(model, params.data, {});

        } catch (e) {
            throw e;
        }

        const result = await super.create(params);

        return result;
    }
}));
