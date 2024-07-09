'use strict';
var _ = require('lodash');
const { DateTime } = require('luxon');

/**
 * notice service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::notice.notice', ({ strapi }) => ({
    async getForUser(forType, id) {
        if (!forType) return {};
        if (!id) return {};

        var isForTeacher = forType.toLowerCase() == 'teacher';
        var isForParent = forType.toLowerCase() == 'parent';
        var isForStudent = forType.toLowerCase() == 'student';

        var notices = [];
        var classes = [];

        if (isForTeacher) {
            var classTeachers = await strapi.entityService.findMany('api::class-teacher.class-teacher', {
                filters: {
                    teacher: id
                },
                populate: ['class']
            });

            for (let i = 0; i < classTeachers.length; i++) {
                const classTeacher = classTeachers[i];

                if (!_.includes(classes, classTeacher.class.id)) {
                    classes.push(classTeacher.class.id);
                }
            }
        }

        if (isForStudent) {
            var classesFromStudent = await getClassesForStudent(id);

            for (let i = 0; i < classesFromStudent.length; i++) {
                const element = classesFromStudent[i];

                if (!_.includes(classes, element)) {
                    classes.push(element);
                }
            }
        }

        if (isForParent) {
            var parent = await strapi.entityService.findOne('api::parent.parent', id);

            let relation = await strapi
                .service('api::family-link.family-link')
                .findByEntityId('parent', parent.id);

            var linkedStudentIds = await strapi.entityService.findMany('api::student.student', {
                filters: {
                    id: {
                        $in: relation.studentIds
                    }
                },
                populate: ['year']
            });

            for (let i = 0; i < linkedStudentIds.length; i++) {
                const student = linkedStudentIds[i];

                var classesFromStudent = await getClassesForStudent(student.id);

                for (let i = 0; i < classesFromStudent.length; i++) {
                    const element = classesFromStudent[i];

                    if (!_.includes(classes, element)) {
                        classes.push(element);
                    }
                }
            }
        }

        var nowTime = DateTime.now().toISO();

        if (isForTeacher) {
            notices = await strapi.entityService.findMany('api::notice.notice', {
                filters: {
                    $or: [
                        {
                            allClasses: true
                        },
                        {
                            classes: classes
                        }
                    ],
                    targetTeacher: true,
                    toDate: { $gte: nowTime },
                    fromDate: { $lte: nowTime },
                    enabled: true
                }
            });
        }

        if (isForParent) {
            notices = await strapi.entityService.findMany('api::notice.notice', {
                filters: {
                    $or: [
                        {
                            allClasses: true
                        },
                        {
                            classes: classes
                        }
                    ],
                    targetParent: true,
                    toDate: { $gte: nowTime },
                    fromDate: { $lte: nowTime },
                    enabled: true
                }
            });
        }

        if (isForStudent) {
            notices = await strapi.entityService.findMany('api::notice.notice', {
                filters: {
                    $or: [
                        {
                            allClasses: true
                        },
                        {
                            classes: classes
                        }
                    ],
                    targetStudent: true,
                    toDate: { $gte: nowTime },
                    fromDate: { $lte: nowTime },
                    enabled: true
                }
            });
        }

        return notices;
    }
}));

async function getClassesForStudent(id) {
    var classes = [];

    var studentClasses = await strapi.entityService.findMany('api::student-class.student-class', {
        filters: {
            student: id,
            status: ['trial', 'active', 'paymentOverdue', 'firstPaymentPending']
        },
        populate: ['class']
    });

    for (let i = 0; i < studentClasses.length; i++) {
        const studentClass = studentClasses[i];

        if (!_.includes(classes, studentClass.class.id)) {
            classes.push(studentClass.class.id);
        }
    }

    return classes;
}
