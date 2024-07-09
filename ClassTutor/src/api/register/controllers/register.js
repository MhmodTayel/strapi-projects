'use strict';

/**
 *  register controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::register.register', ({ strapi }) => ({
    async processRegisters(ctx) {
        const response = await strapi.service('api::register.register').processRegisters();

        return response;
    },
    async updateLessonStatus(ctx) {
        const response = await strapi.service('api::register.register').updateLessonStatus();

        return response;
    },
    async addTrialStudent(ctx) {
        var data = ctx.request.body;

        const response = await strapi
            .service('api::register.register')
            .addTrialStudent(data.studentId, data.classId, data.classDate);

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
    async removeTrialStudent(ctx) {
        var data = ctx.request.body;

        const response = await strapi
            .service('api::register.register')
            .removeTrialStudent(data.studentId, data.classId, data.classDate);

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
    async getNextLessonDate(ctx) {
        var data = ctx.request.body;

        const response = await strapi.service('api::register.register').getNextLessonDate(data.classId, data.afterDate);

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
    async assignHomeworksToTeacher(ctx) {
        var params = ctx.params;

        const response = await strapi
            .service('api::register.register')
            .assignHomeworksToTeacher(params.registerId, params.teacherId);

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
    async getHomework(ctx) {
        const response = await strapi.service('api::register.register').getHomework(ctx.query);

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
    async changeTeacher(ctx) {
        const response = await strapi.service('api::register.register').changeTeacher(ctx.request.body);

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
    async updateClassStatus(ctx) {
        const response = await strapi.service('api::register.register').updateClassStatus(ctx.request.body);

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
    async upcomingLessons(ctx) {
        const response = await strapi.service('api::register.register').upcomingLessons(ctx.query);

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
