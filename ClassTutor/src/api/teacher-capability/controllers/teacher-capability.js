'use strict';

/**
 *  teacher-capability controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::teacher-capability.teacher-capability', ({ strapi }) => ({
    async getForTeacher(ctx) {
        var teacherId = ctx.params.id;

        const response = await strapi.service('api::teacher-capability.teacher-capability').getForTeacher(teacherId);

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
    async updateForTeacher(ctx) {
        var teacherId = ctx.params.id;
        var capabilities = ctx.request.body;

        const response = await strapi.service('api::teacher-capability.teacher-capability').updateForTeacher(teacherId, capabilities);

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