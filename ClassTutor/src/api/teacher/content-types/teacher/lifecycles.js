const { DateTime } = require('luxon');
const DateTimeUtils = require('../../../../../utils/datetime-utils');
const AccountUtils = require('../../../../../utils/account-utils');
const EmailHelper = require('../../../../../utils/email-helper');
const EmailTemplates = require('../../../../../utils/email-templates');
const _ = require('lodash');

module.exports = {
    async beforeUpdate(event) {
        const { data, where, select, populate } = event.params;

        if (data.status) {
            // set status property

            var existingTeacher = await strapi.entityService.findOne('api::teacher.teacher', where.id);

            var todayDate = DateTimeUtils.todayDateStrapi();
            if (existingTeacher) {
                if (existingTeacher.status != data.status) {
                    switch (data.status) {
                        case 'new':
                            //do nothing
                            break;

                        case 'interviewee':
                            data.interviewDate = todayDate;
                            event.state.emailTemplate = EmailTemplates.TEACHER.TEACHER_SIGNUP_APPLICATION_ACCEPTED;
                            break;

                        case 'offered':
                            data.offerDate = todayDate;
                            event.state.emailTemplate = EmailTemplates.TEACHER.TEACHER_SIGNUP_INTERVIEW_ACCEPTED;
                            break;

                        case 'offerRejected':
                            data.offerRejectedDate = todayDate;
                            event.state.eventMessage = {
                                eventCode: '1003',
                                template: 'Teacher {{name}} has rejected the offer',
                                entity: 'teacher',
                                entityId: existingTeacher.id,
                                receiverId: 'admin-users',
                                messageValues: { name: existingTeacher.name + ' ' + existingTeacher.lastName }
                            };
                            break;

                        case 'offerAccepted':
                            data.offerAcceptedDate = todayDate;
                            event.state.eventMessage = {
                                eventCode: '1004',
                                template: 'Teacher {{name}} has accepted the offer',
                                entity: 'teacher',
                                entityId: existingTeacher.id,
                                receiverId: 'admin-users',
                                messageValues: { name: existingTeacher.name + ' ' + existingTeacher.lastName }
                            };
                            break;

                        case 'active':
                            data.joinedDate = todayDate;
                            event.state.eventMessage = {
                                eventCode: '1005',
                                template: 'Teacher {{name}} has completed onboarding',
                                entity: 'teacher',
                                entityId: existingTeacher.id,
                                receiverId: 'admin-users',
                                messageValues: { name: existingTeacher.name + ' ' + existingTeacher.lastName }
                            };
                            break;

                        case 'rejected':
                            data.rejectedDate = todayDate;
                            if (existingTeacher.status == 'interviewee')
                                event.state.emailTemplate = EmailTemplates.TEACHER.TEACHER_SIGNUP_INTERVIEW_REJECTED;
                            else if (existingTeacher.status == 'new' || existingTeacher.status == 'reapplied')
                                event.state.emailTemplate = EmailTemplates.TEACHER.TEACHER_SIGNUP_APPLICATION_REJECTED;
                            break;

                        case 'barred':
                            data.barredDate = todayDate;
                            break;

                        case 'inactive':
                            //do nothing
                            break;

                        case 'reapplied':
                            data.reapplyDate = todayDate;
                            event.state.eventMessage = {
                                eventCode: '1006',
                                template: 'Teacher {{name}} has reapplied',
                                entity: 'teacher',
                                entityId: existingTeacher.id,
                                receiverId: 'admin-users',
                                messageValues: { name: existingTeacher.name + ' ' + existingTeacher.lastName }
                            };
                            break;

                        default:
                            break;
                    }
                }
            }
        }
    },

    async afterUpdate(event) {
        const { result, params } = event;
        const { data, where, select, populate } = event.params;

        await strapi.db.query('plugin::users-permissions.user').update({
            where: {
                teacher: result.id
            },
            data: {
                email: data.email
            },
            payload: {
                name: result.name,
                lastName: result.lastName
            }
        });

        if (event.state.emailTemplate) {
            await EmailHelper.sendTemplateEmail(
                event.state.emailTemplate,
                result.name + ' ' + result.lastName,
                result.email,
                {}
            );
        }

        if (event.state.eventMessage) {
            await strapi.service('api::event-message.event-message').send(event.state.eventMessage);
        }
    },

    async beforeCreate(event) {
        const { result, params } = event;

        if (params.data.teacherId == 'GEN_NEW_ID' || _.isEmpty(params.data.teacherId)) {
            params.data.teacherId = await strapi.service('api::id-config.id-config').getNewId('teacher');
        }
    },

    async afterCreate(event) {
        const { result, params } = event;

        var userTypes = await strapi.entityService.findMany('api::user-type.user-type');
        var teacherUserTypeId = userTypes.find((x) => x.name.toLowerCase() == 'teacher').id;

        var roles = await strapi.entityService.findMany('plugin::users-permissions.role');
        var authenticatedRoleId = roles.find((x) => x.name.toLowerCase() == 'authenticated').id;

        const newUser = await strapi.entityService.create('plugin::users-permissions.user', {
            data: {
                username: AccountUtils.generateUsername(result.name, result.lastName),
                email: result.email?.toLowerCase() || AccountUtils.generateRandomEmail(),
                password: params.data.password || AccountUtils.generateRandomPassword(), // random password
                user_types: [teacherUserTypeId],
                provider: 'local',
                role: authenticatedRoleId,
                teacher: result.id,
                source: params.data.source
            }
        });
    },

    async afterFindOne(event) {
        const { result, params } = event;

        setStatusOptions(result);
    },

    async afterFindMany(event) {
        const { result, params } = event;

        for (let i = 0; i < result.length; i++) {
            const element = result[i];
            setStatusOptions(element);
        }
    }
};

function setStatusOptions(item) {
    if (item) {
        item.statusOptions = [];
        item.canReapply = null;
        item.isProfileComplete = null;

        if (item.bankAccountNumber) item.isProfileComplete = true;

        switch (item.status) {
            case 'new':
                item.statusOptions = ['interviewee', 'offered', 'rejected', 'barred', 'inactive'];
                break;

            case 'interviewee':
                item.statusOptions = ['offered', 'rejected', 'barred', 'inactive'];
                break;

            case 'offered':
                item.statusOptions = ['offerAccepted', 'offerRejected', 'rejected', 'barred', 'inactive', 'new'];
                break;

            case 'offerRejected':
                item.statusOptions = ['reapplied', 'rejected', 'barred', 'inactive'];
                setReapplyStatus(item);
                break;

            case 'offerAccepted':
                item.statusOptions = ['active', 'rejected', 'barred', 'inactive'];
                break;

            case 'active':
                item.statusOptions = ['rejected', 'barred', 'inactive'];
                break;

            case 'rejected':
                item.statusOptions = ['reapplied', 'new', 'barred', 'inactive'];
                setReapplyStatus(item);
                break;

            case 'barred':
                item.statusOptions = ['new', 'inactive'];
                break;

            case 'inactive':
                item.statusOptions = ['new', 'active', 'offered'];
                break;

            case 'reapplied':
                item.statusOptions = ['interviewee', 'offered', 'rejected', 'barred', 'inactive'];
                break;

            default:
                break;
        }
    }
}

function setReapplyStatus(item) {
    var dt = '';

    if (item.status == 'rejected') dt = item.rejectedDate;

    if (item.status == 'offerRejected') dt = item.offerRejectedDate;

    if (dt) {
        var rejectedDate = DateTime.fromFormat(dt, 'yyyy-MM-dd');
        var rejectedDateToCheck = rejectedDate.plus({ months: 6 });
        if (rejectedDateToCheck < DateTime.now()) item.canReapply = true;
        else item.canReapply = false;
    }
}
