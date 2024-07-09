'use strict';
const { DateTime } = require('luxon');
const DateTimeUtils = require('../../../../utils/datetime-utils');
const EmailTemplates = require('../../../../utils/email-templates');
const EmailHelper = require('../../../../utils/email-helper');
var _ = require('lodash');

/**
 * register-student service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::register-student.register-student', ({ strapi }) => ({
    async find(params) {
        // some logic here

        const { results, pagination } = await super.find(params);
        // some more logic

        for (let i = 0; i < results.length; i++) {
            const element = results[i];
            await this.setHomeworkStatus(element);
        }

        return { results, pagination };
    },

    async findOne(entityId, params) {
        // some logic here

        const result = await super.findOne(entityId, params);
        // some more logic

        await this.setHomeworkStatus(result);

        return result;
    },

    async update(entityId, params) {
        // some logic here

        const result = await super.update(entityId, params);
        // some more logic

        await this.setHomeworkStatus(result);

        return result;
    },

    async bulkUpdate(data, user) {
        try {
            var attendanceDetails = data.attendanceDetails;

            if (!attendanceDetails || !attendanceDetails.registerId)
                return { message: 'Missing register id', httpCode: 400 };

            var register = await strapi.entityService.findOne('api::register.register', attendanceDetails.registerId, {
                populate: ['class', 'class.subject', 'teacher']
            });

            for (let i = 0; i < data.data.length; i++) {
                const element = data.data[i];

                var oldRecord = await strapi.entityService.findOne(
                    'api::register-student.register-student',
                    element.id,
                    {
                        populate: ['student', 'issue_reasons']
                    }
                );

                if (oldRecord.issueStatus && !element.issueStatus) {
                    if (oldRecord.issueStatus == 'pending') element.issueStatus = null;
                }

                if (!oldRecord.issue_reasons.length && element.issue_reasons.length)
                    await strapi.service('api::event-message.event-message').send({
                        eventCode: '1009',
                        template: 'Behaviour issue added for student {{name}}',
                        entity: 'registerStudent',
                        entityId: element.id,
                        receiverId: 'admin-users',
                        messageValues: {
                            name: `${oldRecord.student.name || ''} ${oldRecord.student.lastName || ''}`
                        }
                    });
                const entry = await strapi.entityService.update('api::register-student.register-student', element.id, {
                    data: element
                });

                var updatedRecord = await strapi.entityService.findOne(
                    'api::register-student.register-student',
                    element.id,
                    {
                        populate: ['student']
                    }
                );

                let relation = await strapi
                    .service('api::family-link.family-link')
                    .findByEntityId('student', updatedRecord.student.id);

                var linkedParents = await strapi.entityService.findMany('api::parent.parent', {
                    filters: {
                        id: {
                            $in: relation?.parentIds
                        }
                    }
                });

                //#region Star Student

                if (updatedRecord.starStudent) {
                    await strapi.service('api::student-feed.student-feed').create({
                        data: {
                            name:
                                updatedRecord.student.studentId +
                                ' ' +
                                register.class.classId +
                                ' ' +
                                register.classDate,
                            title: 'Star Student',
                            type: 'starStudent',
                            register_student: updatedRecord.id,
                            student: updatedRecord.student.id,
                            register: register.id,
                            class: register.class.id
                        }
                    });

                    await strapi.service('api::event-message.event-message').send({
                        eventCode: '1300',
                        template: 'You have been awarded star student for {{class}} on {{classDate}}',
                        entity: 'register',
                        entityId: register.id,
                        receiverId: 'student-user-' + updatedRecord.student.id,
                        messageValues: {
                            class: register.class.classId,
                            classDate:DateTimeUtils.strapiDateToFormat(register.classDate, 'dd LLL'),
                        }
                    });

                    for (let i = 0; i < linkedParents.length; i++) {
                        const parent = linkedParents[i];

                        await strapi.service('api::event-message.event-message').send({
                            eventCode: '1200',
                            template: '{{studentName}} has been awarded star student for {{class}} on {{classDate}}',
                            entity: 'register',
                            entityId: register.id,
                            receiverId: 'parent-user-' + parent.id,
                            messageValues: {
                                studentName: updatedRecord.student.name + ' ' + updatedRecord.student.lastName,
                                class: register.class.classId,
                                classDate: DateTimeUtils.strapiDateToFormat(register.classDate, 'dd LLL'),
                            }
                        });

                        await EmailHelper.sendTemplateEmail(
                            EmailTemplates.PARENT.PARENT_ATTENDANCE_STAR_STUDENT,
                            parent.name + ' ' + parent.lastName,
                            parent.email,
                            {
                                studentName: updatedRecord.student.name + ' ' + updatedRecord.student.lastName,
                                teacherName: register.teacher.name,
                                subjectWithClass: register.class.classId + ' - ' + register.class.subject.name
                            }
                        );
                    }
                }
                //#endregion

                //#region Lesson Missed
                if (element.hasAttended == false) {
                    // absent
                    await strapi.service('api::student-feed.student-feed').create({
                        data: {
                            name:
                                updatedRecord.student.studentId +
                                ' ' +
                                register.class.classId +
                                ' ' +
                                register.classDate,
                            title: 'Lesson missed',
                            type: 'lessonMissed',
                            register_student: updatedRecord.id,
                            student: updatedRecord.student.id,
                            register: register.id,
                            class: register.class.id
                        }
                    });

                    await strapi.service('api::event-message.event-message').send({
                        eventCode: '1301',
                        template: 'You have missed a lesson for {{class}} on {{classDate}}',
                        entity: 'register',
                        entityId: register.id,
                        receiverId: 'student-user-' + updatedRecord.student.id,
                        messageValues: {
                            class: register.class.classId,
                            classDate: DateTimeUtils.strapiDateToFormat(register.classDate, 'dd LLL'),
                        }
                    });

                    for (let i = 0; i < linkedParents.length; i++) {
                        const parent = linkedParents[i];

                        await strapi.service('api::event-message.event-message').send({
                            eventCode: '1201',
                            template: '{{studentName}} have missed a lesson for {{class}} on {{classDate}}',
                            entity: 'register',
                            entityId: register.id,
                            receiverId: 'parent-user-' + parent.id,
                            messageValues: {
                                studentName: updatedRecord.student.name + ' ' + updatedRecord.student.lastName,
                                class: register.class.classId,
                                classDate: DateTimeUtils.strapiDateToFormat(register.classDate, 'dd LLL'),
                            }
                        });
                    }
                }

                //#endregion

                //#region Review Lesson

                if (element.understanding == 'struggled') {
                    // review lesson
                    await strapi.service('api::student-feed.student-feed').create({
                        data: {
                            name:
                                updatedRecord.student.studentId +
                                ' ' +
                                register.class.classId +
                                ' ' +
                                register.classDate,
                            title: 'Review lesson',
                            type: 'reviewLesson',
                            register_student: updatedRecord.id,
                            student: updatedRecord.student.id,
                            register: register.id,
                            class: register.class.id
                        }
                    });

                    await strapi.service('api::event-message.event-message').send({
                        eventCode: '1302',
                        template: 'You need to review the lesson for {{class}} on {{classDate}}',
                        entity: 'register',
                        entityId: register.id,
                        receiverId: 'student-user-' + updatedRecord.student.id,
                        messageValues: {
                            class: register.class.classId,
                            classDate: DateTimeUtils.strapiDateToFormat(register.classDate, 'dd LLL'),
                        }
                    });

                    for (let i = 0; i < linkedParents.length; i++) {
                        const parent = linkedParents[i];

                        await strapi.service('api::event-message.event-message').send({
                            eventCode: '1202',
                            template: '{{studentName}} needs to review the lesson for {{class}} on {{classDate}}',
                            entity: 'register',
                            entityId: register.id,
                            receiverId: 'parent-user-' + parent.id,
                            messageValues: {
                                studentName: updatedRecord.student.name + ' ' + updatedRecord.student.lastName,
                                class: register.class.classId,
                                classDate: DateTimeUtils.strapiDateToFormat(register.classDate, 'dd LLL'),
                            }
                        });
                    }
                }

                //#endregion
            }
            const userEntity = await strapi.entityService.findOne('plugin::users-permissions.user', user.id, {
                populate: {
                    user_types: true
                }
            });

            if (
                register.status != 'completed' &&
                userEntity.user_types.find((e) => e.name.toLowerCase() === 'teacher')
            ) {
                await strapi.entityService.update('api::register.register', attendanceDetails.registerId, {
                    data: {
                        isComplete: true,
                        attendanceMarked: true,
                        attendanceMarkedTime: DateTimeUtils.nowDateTimeStrapi()
                    }
                });
            }
        } catch (err) {
            return { message: err.message, httpCode: 500 };
        }

        return {};
    },

    async setHomeworkStatus(originalRegisterStudent) {
        try {
            var registerStudent = await super.findOne(originalRegisterStudent.id, {
                populate: ['register', 'register.homework_locked_by_teacher']
            });

            var now = DateTime.now();
            var homeworkDeadline =
                registerStudent.register.homeworkDeadline &&
                DateTimeUtils.parseDateTime(registerStudent.register.homeworkDeadline);
            var homeworkCompletionDate =
                registerStudent.homeworkCompletionDate &&
                DateTimeUtils.parseDateTime(registerStudent.homeworkCompletionDate);
            var isHomeworkSubmittedLate =
                homeworkCompletionDate && homeworkDeadline && homeworkCompletionDate > homeworkDeadline;
            var isDeadlinePassed = homeworkDeadline && homeworkDeadline < now;
            var isHomeworkSubmittedByStudent = registerStudent.homeworkSubmitted == true;
            var isHomeworkUploadedByTeacher = false;
            if (registerStudent.register.homeworkDeadline) isHomeworkUploadedByTeacher = true;
            var isHomeworkMarked = registerStudent.homeworkMarkingStatus == 'marked';
            var isHomeworkError = registerStudent.homeworkMarkingStatus == 'error';
            var isHomeworkAssignedToTeacher =
                registerStudent.register.homework_locked_by_teacher != null ||
                registerStudent.register.homework_locked_by_teacher != undefined;

            originalRegisterStudent.homeworkStatusError = null;
            originalRegisterStudent.homeworkStatus = null;
            originalRegisterStudent.homeworkMarksPercentage = null;
            originalRegisterStudent.homeworkMarksColour = null;

            // when no homework has been uploaded by the teacher yet
            if (!isHomeworkUploadedByTeacher) {
                originalRegisterStudent.homeworkStatus = 'na';
                return;
            }

            if (isHomeworkError) {
                originalRegisterStudent.homeworkStatus = 'blocked';

                if (isHomeworkSubmittedLate) {
                    // submitted late
                    originalRegisterStudent.homeworkStatus = originalRegisterStudent.homeworkStatus + '_late';
                }

                return;
            }

            if (isHomeworkSubmittedByStudent) {
                if (!isDeadlinePassed && !isHomeworkMarked && !isHomeworkAssignedToTeacher) {
                    originalRegisterStudent.homeworkStatus = 'submitted';

                    if (isHomeworkSubmittedLate) {
                        // submitted late
                        originalRegisterStudent.homeworkStatus = originalRegisterStudent.homeworkStatus + '_late';
                    }

                    return;
                }

                // When hmk is submitted by student and needs marking
                if (!isHomeworkMarked) {
                    // submitted on time
                    originalRegisterStudent.homeworkStatus = 'mark';

                    if (isHomeworkAssignedToTeacher) {
                        // assigned to teacher for marking
                        originalRegisterStudent.homeworkStatus = 'inprogress';
                    }

                    if (isHomeworkSubmittedLate) {
                        // submitted late
                        originalRegisterStudent.homeworkStatus = originalRegisterStudent.homeworkStatus + '_late';
                    }

                    return;
                } else {
                    // home submitted and was marked, output marks

                    var marks = registerStudent.homeworkMark;
                    var total = registerStudent.register.homeworkMarks;

                    originalRegisterStudent.homeworkStatus = 'marked';
                    originalRegisterStudent.homeworkMarksPercentage = parseInt(
                        (100 * parseFloat(marks)) / parseFloat(total)
                    );

                    originalRegisterStudent.homeworkMarksColour = 'red';
                    if (originalRegisterStudent.homeworkMarksPercentage >= 90)
                        originalRegisterStudent.homeworkMarksColour = 'green';
                    else if (originalRegisterStudent.homeworkMarksPercentage >= 50)
                        originalRegisterStudent.homeworkMarksColour = 'amber';

                    if (isHomeworkSubmittedLate) {
                        // submitted late
                        originalRegisterStudent.homeworkStatus = originalRegisterStudent.homeworkStatus + '_late';
                    }

                    return;
                }
            }

            if (isDeadlinePassed) {
                // No submission even after the deadline passed
                if (!isHomeworkSubmittedByStudent) {
                    originalRegisterStudent.homeworkStatus = 'missing';
                    return;
                }
            } else {
                // When a homework has not yet submitted by the student pre-deadline
                if (!isHomeworkSubmittedByStudent) {
                    originalRegisterStudent.homeworkStatus = 'waiting';
                    return;
                }
            }

            originalRegisterStudent.homeworkStatus = 'review';
            return;
        } catch (error) {
            originalRegisterStudent.homeworkStatusError = error;
        }
    }
}));
