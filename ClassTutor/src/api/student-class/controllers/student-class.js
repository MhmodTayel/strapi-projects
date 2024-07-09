'use strict';

/**
 *  student-class controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::student-class.student-class', ({ strapi }) => ({
    async getClassesForSales(ctx) {
        var { studentId, subjectId, yearId, classType, classId } = ctx.request.query;

        const response = await strapi
            .service('api::student-class.student-class')
            .getClassesForSales(studentId, classType, subjectId, yearId, classId);

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
    async confirmPayment(ctx) {
        var { studentId, payments } = ctx.request.body.payload;
        const response = await strapi.service('api::student-class.student-class').confirmPayment(studentId, payments);

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
