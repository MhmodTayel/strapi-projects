const DateTimeUtils = require('../../../../../utils/datetime-utils');
const EmailTemplates = require('../../../../../utils/email-templates');
const EmailHelper = require('../../../../../utils/email-helper');
var _ = require('lodash');

module.exports = {
    async beforeUpdate(event) {
        const { data, where, select, populate } = event.params;

        var originalRegisterStudent = await strapi.entityService.findOne(
            'api::register-student.register-student',
            where.id,
            { populate: ['register'] }
        );

        if (data.homeworkMark) {
            if (!originalRegisterStudent.homeworkMark) {
                event.state.hasHomeworkMarkSet = true;
                event.state.registerId = originalRegisterStudent.register.id;
            }
        }

        if (data.issueStatus && data.issueStatus == 'sent' && !originalRegisterStudent.dateSentIssue) {
            data.dateSentIssue = DateTimeUtils.nowDateTimeStrapi();
            event.state.sendBehaviourIssue = true;
            event.state.registerId = originalRegisterStudent.register.id;
        }
    },

    async afterUpdate(event) {
        const { data, where, select, populate } = event.params;

        if (event.state.hasHomeworkMarkSet) {
            var registersWithHomeworkRemaining = await strapi.entityService.findMany(
                'api::register-student.register-student',
                {
                    filters: {
                        register: event.state.registerId,
                        homeworkMark: {
                            $null: true
                        },
                        homeworkSubmitted: true
                    }
                }
            );

            if (registersWithHomeworkRemaining.length == 0) {
                // close the homework and update status

                var register = await strapi.entityService.update('api::register.register', event.state.registerId, {
                    data: {
                        homeworkMarkingComplete: true,
                        homeworkMarkingBlocked: false,
                        homework_locked_by_teacher: null,
                        homeworkLockStartTime: null,
                        homeworkLockEndTime: null
                    }
                });

                await strapi.service('api::event-message.event-message').send({
                    eventCode: '1105',
                    template: 'The homework marking is complete',
                    entity: 'register',
                    entityId: event.state.registerId,
                    receiverId: 'teacher-users',
                    background: true
                });
            }
        }

        var exisitingRecord = await strapi.entityService.findOne(
            'api::register-student.register-student',
            event.params.where.id,
            {
                populate: [
                    'student',
                    'register',
                    'register.class',
                    'register.class.subject',
                    'register.class.year',
                    'register.teacher'
                ]
            }
        );
        if (event.state.sendBehaviourIssue) {
            let relation = await strapi
                .service('api::family-link.family-link')
                .findByEntityId('student', exisitingRecord.student.id);

            var parents = await strapi.entityService.findMany('api::parent.parent', {
                filters: {
                    id: {
                        $in: relation?.parentIds
                    }
                }
            });

            var classDateShortReadable = DateTimeUtils.strapiDateToFormat(exisitingRecord.register.classDate, 'dd LLL');

            await strapi.service('api::student-feed.student-feed').create({
                data: {
                    name:
                        exisitingRecord.student.studentId +
                        ' ' +
                        exisitingRecord.register.class.classId +
                        ' ' +
                        exisitingRecord.register.classDate,
                    title: 'Behaviour issue',
                    type: 'behaviourIssue',
                    register_student: exisitingRecord.id,
                    student: exisitingRecord.student.id,
                    register: exisitingRecord.register.id,
                    class: exisitingRecord.register.class.id
                }
            });

            await strapi.service('api::event-message.event-message').send({
                eventCode: '1303',
                template: 'Behaviour issue recorded for {{class}} on {{classDate}}',
                entity: 'register',
                entityId: exisitingRecord.register.id,
                receiverId: 'student-user-' + exisitingRecord.student.id,
                messageValues: {
                    class: exisitingRecord.register.class.classId,
                    classDate: classDateShortReadable
                }
            });

            for (let i = 0; i < parents.length; i++) {
                const parent = parents[i];

                await strapi.service('api::event-message.event-message').send({
                    eventCode: '1203',
                    template: 'Behaviour issue recorded for {{studentName}} for {{class}} on {{classDate}}',
                    entity: 'register',
                    entityId: exisitingRecord.register.id,
                    receiverId: 'parent-user-' + parent.id,
                    messageValues: {
                        studentName: exisitingRecord.student.name + ' ' + exisitingRecord.student.lastName,
                        class: exisitingRecord.register.class.classId,
                        classDate: classDateShortReadable
                    }
                });

                await EmailHelper.sendTemplateEmail(
                    EmailTemplates.PARENT.PARENT_ATTENDANCE_BEHAVIOUR_ISSUE,
                    parent.name + ' ' + parent.lastName,
                    parent.email,
                    {
                        studentName: exisitingRecord.student.name + ' ' + exisitingRecord.student.lastName,
                        teacherName: exisitingRecord.register.teacher.name,
                        yearShort: exisitingRecord.register.class.year.shortName,
                        subject: exisitingRecord.register.class.subject.name,
                        date: classDateShortReadable,
                        dayOfWeek: _.capitalize(exisitingRecord.register.class.dayOfWeek),
                        classId: exisitingRecord.register.class.classId,
                        startTime: DateTimeUtils.strapiTimeToFormat(exisitingRecord.register.startTime, 'hh:mm'),
                        endTime: DateTimeUtils.strapiTimeToFormat(exisitingRecord.register.endTime, 'hh:mm a'),
                        issueDate: DateTimeUtils.strapiDateTimeToFormat(
                            exisitingRecord.dateSentIssue,
                            'dd/MM/yyyy HH:mm'
                        ),
                        issueMessage: exisitingRecord.issueDescription
                    }
                );
            }
        }

        await strapi.service('api::event-message.event-message').send({
            eventCode: '1400',
            template: 'Register student data updated for {{registerStudentId}}',
            entity: 'register',
            entityId: data.registerId,
            receiverId: `entity-register-${data.registerId}`,
            messageValues: {
                attendance: {
                    ...(data.hasOwnProperty('hasAttended') && { hasAttended: data.hasAttended }),
                    ...(data.hasOwnProperty('isLate') && { isLate: data.isLate }),
                    ...(data.hasOwnProperty('hasLeftEarly') && { hasLeftEarly: data.hasLeftEarly })
                },
                ...(where.id && { registerStudentId: where.id }),
                ...(data.hasOwnProperty('engagement') && { engagement: data.engagement || 'empty' }),
                ...(data.hasOwnProperty('understanding') && { understanding: data.understanding || 'empty' })
            },
            background: true
        });

        // deleting behaviour issue request
        if (
            data.hasOwnProperty('issueDescription') &&
            data.issueDescription == null &&
            data.hasOwnProperty('issue_reasons') &&
            data.issue_reasons == null &&
            data.hasOwnProperty('issueStatus') &&
            data.issueStatus == null
        ) {
            await strapi.db.query('api::event-message.event-message').delete({
                where: {
                    entityId: where.id,
                    eventCode: '1009'
                }
            });

            await strapi.db.query('api::student-feed.student-feed').delete({
                where: {
                    type: 'behaviourIssue',
                    register_student: exisitingRecord.id
                }
            });
        }
    },

    async afterCreate(event) {
        const { result, params } = event;

        if (result?.id) {
            const createdRegisterStudent = await strapi.entityService.findOne(
                'api::register-student.register-student',
                result.id,
                {
                    fields: ['id'],
                    populate: {
                        register: {
                            fields: ['id']
                        },
                        student: {
                            fields: ['id']
                        }
                    }
                }
            );

            if (createdRegisterStudent) {
                const register = createdRegisterStudent.register;

                const meetingRecordings = await strapi.entityService.findMany(
                    'api::meeting-recording.meeting-recording',
                    {
                        filters: {
                            register: register.id
                        },
                        populate: {
                            students: {
                                fields: ['id']
                            }
                        },
                        limit: 1
                    }
                );

                if (meetingRecordings.length > 0) {
                    const meetingRecording = meetingRecordings[0];
                    const studentIds = [createdRegisterStudent.student.id];

                    if (meetingRecording.students) {
                        for (let i = 0; i < meetingRecording.students.length; i++) {
                            studentIds.push(meetingRecording.students[i].id);
                        }
                    }

                    await strapi.entityService.update('api::meeting-recording.meeting-recording', meetingRecording.id, {
                        data: {
                            students: studentIds
                        }
                    });
                }
            }
        }
    }
};
