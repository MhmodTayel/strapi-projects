'use strict';

/**
 * student-feed controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::student-feed.student-feed', ({ strapi }) => ({
    async getFeed(ctx) {
        const response = await strapi.service('api::student-feed.student-feed').getFeed(ctx.query);

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
    }
}));
