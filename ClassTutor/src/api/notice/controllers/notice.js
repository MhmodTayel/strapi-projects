'use strict';

/**
 *  notice controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::notice.notice', ({ strapi }) => ({
    async getForUser(ctx) {
        var { forType, id } = ctx.request.params;

        const response = await strapi.service('api::notice.notice').getForUser(forType, id);

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