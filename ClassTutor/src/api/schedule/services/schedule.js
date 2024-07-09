'use strict';
const _ = require('lodash');
/**
 * schedule service
 */

module.exports = ({ strapi }) => ({
    async getSchedule(startDate, endDate, entityId, entityType, { studentIds }) {
        let filters = {
            register: {
                classDate: { $between: [startDate, endDate] }
            }
        };

        if (entityType === 'student') {
            filters.student = entityId;
        } else if (entityType === 'parent') {
            const relations = await strapi.service('api::family-link.family-link').findByEntityId(entityType, entityId);
            if (studentIds?.length) {
                filters.student = {
                    id: {
                        $in: _.filter(relations?.studentIds, (e) =>
                            studentIds.find((a) => a?.toString() === e?.toString())
                        )
                    }
                };
            } else {
                filters.student = {
                    id: {
                        $in: relations?.studentIds
                    }
                };
            }
        } else if (entityType === 'teacher') {
            const registers = await strapi.entityService.findMany('api::register.register', {
                filters: {
                    classDate: { $between: [startDate, endDate] },
                    teacher: entityId
                },
                populate: ['class.year', 'class.subject']
            });

            return registers.map((e) => ({
                classId: e.class.classId,
                startTime: e.startTime,
                endTime: e.endTime,
                date: e.classDate,
                year: e.class.year?.shortName ?? '',
                subject: e.class.subject?.name ?? '',
                subjectColour: e.class.subject?.colour ?? ''
            }));
        }

        const registerStudents = await strapi.entityService.findMany('api::register-student.register-student', {
            filters,
            populate: ['register.class.year', 'register.class.subject', 'student']
        });

        return registerStudents.map((e) => ({
            studentId: e.student.id,
            studentName: e.student.name + ' ' + e.student.lastName,
            studentAvatarImageName: e.student.avatarImageName,
            classId: e.register.class.classId,
            startTime: e.register.startTime,
            endTime: e.register.endTime,
            date: e.register.classDate,
            year: e.register.class.year?.shortName ?? '',
            subject: e.register.class.subject?.name ?? '',
            subjectColour: e.register.class.subject?.colour ?? ''
        }));
    }
});
