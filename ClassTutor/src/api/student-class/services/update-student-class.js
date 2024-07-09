const { DateTime } = require('luxon');
const { parseDate, todayDateStrapi } = require('../../../../utils/datetime-utils');
var _ = require('lodash');

/**
 * @deprecated should be removed after make sure it doesn't used in anywhere in the frontend.
 */
const updateStudentClass = async (update, entityId, params) => {
    var previousStudentClass = await strapi.entityService.findOne('api::student-class.student-class', entityId, {
        populate: ['student']
    });

    const result = await update(entityId, params);

    // previous was new and now changing to trial
    if (previousStudentClass.status == 'new' && params.data.status == 'trial') {
        if (params.data.trialDate && params.data.class) {
            var registers = await strapi.entityService.findMany('api::register.register', {
                filters: {
                    classDate: params.data.trialDate,
                    class: params.data.class
                },
                populate: ['class']
            });

            if (registers.length > 0) {
                var register = registers[0];
            }
        }
    }

    // same trial but trial date changed
    if (previousStudentClass.status == 'trial' && params.data.status == 'trial') {
        if (params.data.trialDate && parseDate(params.data.trialDate) != parseDate(previousStudentClass.trialDate)) {
            // cancel previous trial record as the date has changed

            var previousRegisterStudents = await strapi.entityService.findMany(
                'api::register-student.register-student',
                {
                    filters: {
                        student: previousStudentClass.student.id,
                        freeTrial: true,
                        hasAttended: { $null: true }
                    },
                    populate: ['register']
                }
            );

            var registerStudentToDelete = null;

            for (let i = 0; i < previousRegisterStudents.length; i++) {
                const element = previousRegisterStudents[i];

                if (parseDate(element.register.classDate) >= getTodayDate()) {
                    if (element.register.status != 'cancelled' && element.register.status != 'completed') {
                        if (element.register.classDate == previousStudentClass.trialDate) {
                            registerStudentToDelete = element;
                            continue;
                        }
                    }
                }
            }

            if (registerStudentToDelete) {
                await strapi.entityService.update(
                    'api::register-student.register-student',
                    registerStudentToDelete.id,
                    {
                        data: {
                            freeTrialCancelled: true
                        }
                    }
                );
            }

            var registers = await strapi.entityService.findMany('api::register.register', {
                filters: {
                    classDate: params.data.trialDate,
                    class: params.data.class
                },
                populate: ['class']
            });

            if (registers.length > 0) {
                var register = registers[0];
            }
        }
    }

    return result;
};

const updateStatus = async (strapi) => {
    var studentClassesToCancel = await strapi.entityService.findMany('api::student-class.student-class', {
        filters: {
            cancellationRequestDate: {
                $lt: DateTime.now().toISODate()
            },
            cancelledDate: {
                $null: true
            }
        },
        populate: ['student']
    });

    const studentIds = _.uniq(_.map(studentClassesToCancel, 'student.id'));

    for (let i = 0; i < studentClassesToCancel.length; i++) {
        const studentClassToCancel = studentClassesToCancel[i];

        await strapi.entityService.update('api::student-class.student-class', studentClassToCancel.id, {
            data: {
                status: 'cancelled',
                cancelledDate: studentClassToCancel.cancellationRequestDate
            }
        });

        await strapi
            .service('api::student-class.student-class-events')
            .bookingClassCancelledEvent(strapi, studentClassToCancel.id);
    }

    // Update the student and parent class according to student-class status
    for (const studentId of studentIds) {
        await strapi.service('api::student.student').updateStatus(studentId);
    }
};

module.exports.updateStudentClass = updateStudentClass;

module.exports.updateStatus = updateStatus;
