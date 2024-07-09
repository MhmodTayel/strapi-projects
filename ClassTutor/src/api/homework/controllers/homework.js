'use strict';

/**
 * homework controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::homework.homework', ({ strapi }) => ({
    async assignToTeacher(ctx) {
        var params = ctx.params;

        const response = await strapi.service('api::homework.homework').assignToTeacher(params.homeworkId, params.teacherId);

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
    async get(ctx) {
        const response = await strapi.service('api::homework.homework').get(ctx.query);

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
