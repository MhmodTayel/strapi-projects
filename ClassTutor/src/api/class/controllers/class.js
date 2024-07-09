'use strict';

/**
 *  class controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::class.class', ({ strapi }) => ({
    async getSummary(ctx) {
        var { classId } = ctx.request.params;

        const response = await strapi.service('api::class.class').getSummary(classId);

        if (response.message) {
            if (response.httpCode == 400) {
                return ctx.badRequest(response.message);
            } else if (response.httpCode == 404) {
                return ctx.notFound(response.message);
            } else {
                return ctx.internalServerError(response.message);
            }
        }

        return response;
    },
}));
