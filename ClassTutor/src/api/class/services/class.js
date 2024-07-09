'use strict';
const DateTimeUtils = require('../../../../utils/datetime-utils');
var _ = require('lodash');

/**
 * class service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

function timeDifference(startTime, endTime) {
    // Parse the time strings into Date objects
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const startDate = new Date(0, 0, 0, startHour, startMinute, 0);
    const endDate = new Date(0, 0, 0, endHour, endMinute, 0);

    // Calculate the difference in milliseconds
    const diffInMs = endDate - startDate;

    // Convert the difference from milliseconds to hours
    const diffInHours = diffInMs / (1000 * 60 * 60);

    return diffInHours.toFixed('2');
}

module.exports = createCoreService('api::class.class', ({ strapi }) => ({
    async getSummary(classId) {
        var _class = await strapi.entityService.findOne('api::class.class', classId, {
            populate: {
                teacher: {
                    populate: {
                        photo: true
                    }
                }
            }
        });

        var response = {
            class: {
                classStudents: []
            }
        };

        if (_class) {
            var classStudents = await strapi.entityService.findMany('api::student-class.student-class', {
                filters: {
                    class: classId,
                    status: ['active', 'trial', 'awaitingFeedback', 'firstPaymentPending']
                },
                populate: 'student'
            });

            response.class = {
                id: _class.id,
                classId: _class.classId,
                teacherName: _class.teacher.name + ' ' + _class.teacher.lastName,
                teacherPhoto: _class.teacher.photo,
                startTime: _class.startTime,
                endTime: _class.endTime,
                startDate: _class.startDate,
                endDate: _class.endDate,
                zoomLink: _class.zoomLink,
                dayOfWeek: _.capitalize(_class.dayOfWeek),
                classStudents: []
            };

            for (let i = 0; i < classStudents.length; i++) {
                const classStudent = classStudents[i];

                response.class.classStudents.push({
                    id: classStudent.id,
                    name: classStudent.student.name + ' ' + classStudent.student.lastName,
                    avatarImageName: classStudent.student.avatarImageName,
                    classStatus: classStudent.classStatus,
                    adminStatus: classStudent.adminStatus
                });
            }
        } else {
            return { message: 'Class not found', httpCode: 404 };
        }

        return response;
    },

    async setRateCalculated(classId) {
        if (classId) {
            const _class = await strapi.entityService.findOne('api::class.class', classId, {
                populate: ['subject', 'year', 'teacher']
            });

            const registers = await strapi.entityService.findMany('api::register.register', {
                filters: {
                    class: classId,
                    status: ['upcoming', 'open']
                },
                populate: ['student', 'teacher', 'register_students']
            });
            if (_class.rate) {
                await strapi.db.query('api::class.class').update({
                    where: { id: classId },
                    data: {
                        rateCalculated: _class.rate
                    },
                    options: { ignoreAuditLog: true }
                });

                for (const register of registers) {
                    await strapi.db.query('api::register.register').update({
                        where: { id: register.id },
                        data: {
                            payAmount: _class.rate
                        },
                        options: { ignoreAuditLog: true }
                    });
                }

                return;
            }
            const { isSummerClass, type, teacher: classTeacher } = _class;

            const adminSettings = await strapi.db.query('api::admin-setting.admin-setting').findOne({ where: {} });
            const { payRates } = adminSettings;

            for (const register of registers) {
                const { materialProvided, teacher: registerTeacher } = register;
                const isCover = classTeacher.id != registerTeacher.id;
                const noOfStudents = register.register_students?.length || 0;
                if (noOfStudents == 0) continue
                let teacher = '';
                if (!isCover) teacher = 'Class Owner';
                else {
                    if (isCover && materialProvided) teacher = 'Cover (material)';
                    else if (isCover && !materialProvided) teacher = 'Cover (no material)';
                }

                const payRate = payRates[isSummerClass ? 'summer' : 'regular'].find((ele) => {
                    return ele.type == type && ele.teacher == teacher && ele.noOfStudents == noOfStudents;
                });

                if (payRate) {
                    const teacherRate = payRate[classTeacher.qualification] || payRate['associate'];
                    const classMissed = register.status == 'absent' || register.status == 'cancelled';
                    let rate = classMissed
                        ? teacherRate * 0.25
                        : teacherRate * timeDifference(register.startTime, register.endTime);

                    await strapi.db.query('api::class.class').update({
                        where: { id: classId },
                        data: {
                            rateCalculated: rate
                        },
                        options: { ignoreAuditLog: true }
                    });

                    await strapi.db.query('api::register.register').update({
                        where: { id: register.id },
                        data: {
                            payAmount: rate
                        },
                        options: { ignoreAuditLog: true }
                    });
                }
            }
        }
    },
}));
