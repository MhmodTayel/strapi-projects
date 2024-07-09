'use strict';

/**
 * class-teacher service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::class-teacher.class-teacher', ({ strapi }) => ({
    /**
     * Clear class-teacher records if teacher not linked to any of the classes
     */
    async clearTeacherClassLink(classId, teacherId) {
        // check if there are registers linked to the teacher
        var registers = await strapi.entityService.findMany('api::register.register', {
            filters: {
                class: classId,
                teacher: teacherId
            },
            limit: 1
        });

        if (registers.length == 0) {
            // delete all class teacher links
            var classTeachers = await strapi.entityService.findMany('api::class-teacher.class-teacher', {
                filters: {
                    class: classId,
                    teacher: teacherId
                }
            });

            for (let i = 0; i < classTeachers.length; i++) {
                const element = classTeachers[i];
                await strapi.entityService.delete('api::class-teacher.class-teacher', element.id);
            }
        }
    }
}));
