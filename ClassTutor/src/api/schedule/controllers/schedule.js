module.exports = {
    async getForTeacher(ctx, next) {
        try {
            var { teacherId } = ctx.params;
            var { startDate, endDate, studentIds } = ctx.query;

            if (!teacherId) {
                return ctx.badRequest('Teacher (teacherId) must be provided');
            }

            if (!startDate) {
                return ctx.badRequest('Start date (startDate) must be provided');
            }

            if (!endDate) {
                return ctx.badRequest('End date (endDate) must be provided');
            }

            const response = await strapi
                .service('api::schedule.schedule')
                .getSchedule(startDate, endDate, teacherId, 'teacher', { studentIds });
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
        } catch (err) {
            return ctx.badRequest(err.message);
        }
    },

    async getForStudent(ctx, next) {
        try {
            const { studentId } = ctx.params;
            const { startDate, endDate, studentIds } = ctx.query;

            if (!studentId) {
                return ctx.badRequest('Student (studentId) must be provided');
            }

            if (!startDate) {
                return ctx.badRequest('Start date (startDate) must be provided');
            }

            if (!endDate) {
                return ctx.badRequest('End date (endDate) must be provided');
            }

            const response = await strapi
                .service('api::schedule.schedule')
                .getSchedule(startDate, endDate, studentId, 'student', { studentIds });

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
        } catch (err) {
            return ctx.badRequest(err.message);
        }
    },
    async getForParent(ctx, next) {
        try {
            const { parentId } = ctx.params;
            const { startDate, endDate, studentIds } = ctx.query;

            if (!parentId) {
                return ctx.badRequest('Student (parentId) must be provided');
            }

            if (!startDate) {
                return ctx.badRequest('Start date (startDate) must be provided');
            }

            if (!endDate) {
                return ctx.badRequest('End date (endDate) must be provided');
            }

            const response = await strapi
                .service('api::schedule.schedule')
                .getSchedule(startDate, endDate, parentId, 'parent', { studentIds });

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
        } catch (err) {
            return ctx.badRequest(err.message);
        }
    }
};
