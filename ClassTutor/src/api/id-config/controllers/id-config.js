'use strict';

/**
 *  id-config controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::id-config.id-config', ({ strapi }) => ({
    async getNewId(ctx) {
        const { forType } = ctx.params;

        const response = await strapi.service('api::id-config.id-config').getNewId(forType);

        return response;
    },
    async peekNewId(ctx) {
        const { forType } = ctx.params;

        const response = await strapi.service('api::id-config.id-config').peekNewId(forType);

        return response;
    }
}));
