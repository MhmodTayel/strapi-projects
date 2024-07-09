'use strict';
const _ = require('lodash');
const { faker } = require('@faker-js/faker');
const DateTimeUtils = require('../../utils/datetime-utils');
const { DateTime } = require('luxon');

async function up(knex) {
    const DEFAULT_PASSWORD = '123456';

    //#region subjects
    var subjectsToCreate = [
        { name: 'Maths', code: 'MAT', order: 10, isPrimarySubject: true },
        { name: 'English', code: 'ENG', order: 20, isPrimarySubject: true },
        { name: 'Science', code: 'SCI', order: 30, isPrimarySubject: true },
        { name: 'Economics', code: 'ECO', order: 40 },
        { name: 'Languages', code: 'LAN', order: 50 },
        { name: 'Business Studies', code: 'BUS', order: 60 },
        { name: 'Geography', code: 'GEO', order: 70 },
        { name: 'Design and Technology', code: 'DAT', order: 80 },
        { name: 'Art', code: 'ART', order: 90 },
        { name: 'Music', code: 'MUS', order: 100 },
        { name: 'Physical Education', code: 'PHE', order: 110 },
        { name: 'Computer Science', code: 'COM', order: 120 },
        { name: 'Religious Studies', code: 'REL', order: 130 },
        { name: 'Psychology', code: 'PSY', order: 140 },
        { name: 'History', code: 'HIS', order: 150 },
        { name: 'Classics', code: 'CLA', order: 160 },
        { name: 'Dance', code: 'DAN', order: 170 },
        { name: 'Statistics', code: 'STA', order: 180 },
        { name: 'Further Maths', code: 'FUR', order: 190, parent: 'MAT' },
        { name: 'English: Language', code: 'LAN', order: 200, parent: 'ENG' },
        { name: 'English: Literature', code: 'LIT', order: 210, parent: 'ENG' },
        { name: 'Science: Chemistry', code: 'CHE', order: 220, parent: 'SCI' },
        { name: 'Science: Biology', code: 'BIO', order: 230, parent: 'SCI' },
        { name: 'Science: Physics', code: 'PHY', order: 240, parent: 'SCI' },
        { name: 'German', code: 'GER', order: 250, parent: 'LAN' },
        { name: 'French', code: 'FRE', order: 260, parent: 'LAN' },
        { name: 'Spanish', code: 'SPA', order: 270, parent: 'LAN' },
        { name: 'Latin', code: 'LAT', order: 280, parent: 'LAN' },
        { name: 'Maths: Statistics', code: 'STA', order: 290, parent: 'MAT' },
        { name: 'Maths: Pure', code: 'PUR', order: 300, parent: 'MAT' },
        { name: 'Maths: Decision', code: 'DEC', order: 310, parent: 'MAT' },
        { name: 'Maths: Core', code: 'FUR', order: 320, parent: 'MAT' }
    ];

    for (let index = 0; index < subjectsToCreate.length; index++) {
        const subject = subjectsToCreate[index];

        var existing = await strapi.entityService.findMany('api::subject.subject', {
            filters: { name: subject.name }
        });

        if (existing.length == 0) {
            var parent = null;

            if (subject.parent) {
                var existingParent = await strapi.entityService.findMany('api::subject.subject', {
                    filters: { code: subject.parent }
                });

                if (existingParent.length > 0) {
                    parent = existingParent[0].id;
                }
            }

            const entry = await strapi.entityService.create('api::subject.subject', {
                data: {
                    name: subject.name,
                    parent_subject: parent,
                    code: subject.code,
                    isPrimarySubject: subject.isPrimarySubject || false
                }
            });
        }
    }
    //#endregion

    //#region user-types
    var usersTypesToCreate = ['Admin', 'Parent', 'Teacher', 'Student'];

    for (let index = 0; index < usersTypesToCreate.length; index++) {
        const userType = usersTypesToCreate[index];

        var existing = await strapi.entityService.findMany('api::user-type.user-type', {
            filters: { name: userType }
        });

        if (existing.length == 0) {
            const entry = await strapi.entityService.create('api::user-type.user-type', {
                data: {
                    name: userType
                }
            });
        }
    }
    //#endregion

    //#region education-levels
    var educationLevelsToCreate = [
        { name: 'Primary', otherName: 'primary', order: 10 },
        { name: 'Secondary', otherName: 'secondary', order: 20 },
        { name: 'GCSE', otherName: 'gcse', order: 30 },
        { name: 'A-Levels', otherName: 'alevels', order: 40 },
        { name: 'University', otherName: 'university', order: 50 },
        { name: 'Adult', otherName: 'adult', order: 60 }
    ];

    for (let index = 0; index < educationLevelsToCreate.length; index++) {
        const educationLevel = educationLevelsToCreate[index];

        var existing = await strapi.entityService.findMany('api::education-level.education-level', {
            filters: { name: educationLevel.name }
        });

        if (existing.length == 0) {
            const entry = await strapi.entityService.create('api::education-level.education-level', {
                data: {
                    name: educationLevel.name,
                    otherName: educationLevel.otherName,
                    order: educationLevel.order
                }
            });
        }
    }
    //#endregion

    //#region years
    var yearsToCreate = [
        { name: 'Year 0', shortName: 'Y00', otherName: 'Year0', order: 0, yearNumber: '0' },
        { name: 'Year 1', shortName: 'Y01', otherName: 'Year1', order: 10, yearNumber: '1' },
        { name: 'Year 2', shortName: 'Y02', otherName: 'Year2', order: 20, yearNumber: '2' },
        { name: 'Year 3', shortName: 'Y03', otherName: 'Year3', order: 30, yearNumber: '3' },
        { name: 'Year 4', shortName: 'Y04', otherName: 'Year4', order: 40, yearNumber: '4' },
        { name: 'Year 5', shortName: 'Y05', otherName: 'Year5', order: 50, yearNumber: '5' },
        { name: 'Year 6', shortName: 'Y06', otherName: 'Year6', order: 60, yearNumber: '6' },
        { name: 'Year 7', shortName: 'Y07', otherName: 'Year7', order: 70, yearNumber: '7' },
        { name: 'Year 8', shortName: 'Y08', otherName: 'Year8', order: 80, yearNumber: '8' },
        { name: 'Year 9', shortName: 'Y09', otherName: 'Year9', order: 90, yearNumber: '9' },
        { name: 'Year 10', shortName: 'Y10', otherName: 'Year10', order: 100, yearNumber: '10' },
        { name: 'Year 11', shortName: 'Y11', otherName: 'Year11', order: 110, yearNumber: '11' },
        { name: 'Year 12', shortName: 'Y12', otherName: 'Year12', order: 120, yearNumber: '12', isALevels: true },
        { name: 'Year 13', shortName: 'Y13', otherName: 'Year13', order: 130, yearNumber: '13', isALevels: true },
        { name: 'University', shortName: 'Uni', otherName: 'University', order: 140, yearNumber: '20' },
        { name: 'Adult', shortName: 'Adult', otherName: 'Adult', order: 150, yearNumber: '30' }
    ];

    for (let index = 0; index < yearsToCreate.length; index++) {
        const year = yearsToCreate[index];

        var existing = await strapi.entityService.findMany('api::year.year', {
            filters: { name: year.name }
        });

        if (existing.length == 0) {
            const entry = await strapi.entityService.create('api::year.year', {
                data: {
                    name: year.name,
                    shortName: year.shortName,
                    otherName: year.otherName,
                    order: year.order,
                    yearNumber: year.yearNumber,
                    isALevels: year.isALevels ?? false
                }
            });
        }
    }
    //#endregion

    //#region id-config
    var idConfig = await strapi.entityService.findOne('api::id-config.id-config', 1);

    if (idConfig) {
        if (!idConfig.studentId) idConfig.studentId = 'ST00000';
        if (!idConfig.classId) idConfig.classId = 'CL00000';
        if (!idConfig.teacherId) idConfig.teacherId = 'TE00000';
        if (!idConfig.parentId) idConfig.parentId = 'PA00000';

        await strapi.entityService.update('api::id-config.id-config', 1, {
            data: idConfig
        });
    } else {
        await strapi.entityService.create('api::id-config.id-config', {
            data: {
                studentId: 'ST00000',
                classId: 'CL00000',
                teacherId: 'TE00000',
                parentId: 'PA00000'
            }
        });
    }
    //#endregion

    //#region issue reasons
    var issueReasons = [
        { name: 'Unauthorised use of mobile', group: 'student' },
        { name: 'Distracted / disengaged', group: 'student' },
        { name: 'Disruptive', group: 'student' },
        { name: 'Inappropriate language / behaviour', group: 'student' },
        { name: 'Cheating', group: 'student' },
        { name: 'Camera off', group: 'student' },
        { name: 'Microphone off', group: 'student' },
        { name: 'Camera misdirected', group: 'student' },
        { name: 'Unresponsive in lesson', group: 'student' },
        { name: 'Other Tech Issues', group: 'student' },
        { name: 'Missing student', group: 'class' },
        { name: 'Missing curriculum item', group: 'class' },
        { name: 'Teacher tech issue', group: 'class' },
        { name: 'Internet outage', group: 'class' },
        { name: 'Spammer / Intruder to lesson', group: 'class' }
    ];

    for (let i = 0; i < issueReasons.length; i++) {
        const issueReason = issueReasons[i];

        var existing = await strapi.entityService.findMany('api::issue-reason.issue-reason', {
            filters: { name: issueReason.name, group: issueReason.group }
        });

        if (existing.length == 0) {
            await strapi.entityService.create('api::issue-reason.issue-reason', {
                data: {
                    name: issueReason.name,
                    group: issueReason.group
                }
            });
        }
    }
    //#endregion

    //#region create teachers + classes

    if (process.env.NODE_ENV == 'development' && false) {
        var teachers = await strapi.entityService.findMany('api::teacher.teacher');
        var years = await strapi.entityService.findMany('api::year.year');
        var subjects = await strapi.entityService.findMany('api::subject.subject');
        var classes = await strapi.entityService.findMany('api::class.class');

        if (teachers.length == 0) {
            for (let i = 0; i < 25; i++) {
                var name = faker.name.firstName();
                var lastName = faker.name.lastName();

                var teacherData = {
                    teacherId: faker.random.alpha(20),
                    name: name,
                    lastName: lastName,
                    status: 'active',
                    email: faker.internet.exampleEmail(name, lastName),
                    joinedDate: DateTimeUtils.toStrapiFormat(faker.date.recent(30)),
                    password: DEFAULT_PASSWORD
                };

                const newTeacher = await strapi.entityService.create('api::teacher.teacher', {
                    data: teacherData
                });
            }
        }

        if (classes.length == 0) {
            for (let i = 0; i < years.length; i++) {
                const year = years[i];

                for (let j = 0; j < subjects.length; j++) {
                    const subject = subjects[j];
                    var teacher = teachers[_.random(0, teachers.length - 1)];
                    var startTime = _.random(12, 22);
                    var startDate = faker.date.recent(15);

                    var classData = {
                        classId: faker.random.alpha(20),
                        type: 'group',
                        startDate: DateTimeUtils.toStrapiFormat(startDate),
                        endDate: DateTimeUtils.toStrapiFormat(
                            faker.date.future(2, DateTime.fromJSDate(startDate).plus({ years: 1 }).toJSDate())
                        ),
                        startTime: startTime.toString() + ':00:00.000',
                        endTime: (startTime + 1).toString() + ':00:00.000',
                        status: 'active',
                        subject: subject.id,
                        year: year.id,
                        teacher: teacher.id
                    };

                    const newclass = await strapi.entityService.create('api::class.class', {
                        data: classData
                    });
                }
            }
        }
    }

    //#endregion

    //#region init role permissions
    var roles = await strapi.entityService.findMany('plugin::users-permissions.role');
    var permissions = await strapi.entityService.findMany('plugin::users-permissions.permission', {
        populate: ['role']
    });
    var publicRole = _.find(roles, { type: 'public' });
    var authenticatedRole = _.find(roles, { type: 'authenticated' });

    var rolePermissions = [
        { permission: 'plugin::users-permissions.auth.callback', roles: [publicRole.id, authenticatedRole.id] },
        { permission: 'plugin::users-permissions.auth.refreshToken', roles: [publicRole.id, authenticatedRole.id] },
        { permission: 'api::account.account.create', roles: [publicRole.id, authenticatedRole.id] },
        { permission: 'api::account.account.signupFreeTrial', roles: [publicRole.id, authenticatedRole.id] },
        { permission: 'api::account.account.recaptchaVerification', roles: [publicRole.id, authenticatedRole.id] },
        { permission: 'api::account.account.getAccountByToken', roles: [publicRole.id, authenticatedRole.id] },
        { permission: 'api::account.account.getAccountByEmail', roles: [publicRole.id, authenticatedRole.id] },
        { permission: 'api::account.account.passwordReset', roles: [publicRole.id, authenticatedRole.id] },
        {
            permission: 'api::account.account.getAccountByPasswordResetToken',
            roles: [publicRole.id, authenticatedRole.id]
        },
        { permission: 'api::account.account.passwordChange', roles: [publicRole.id, authenticatedRole.id] },
        { permission: 'api::subject.subject.find', roles: [publicRole.id, authenticatedRole.id] },

        { permission: 'api::admin.admin.find', roles: [authenticatedRole.id] },
        { permission: 'api::admin.admin.findOne', roles: [authenticatedRole.id] },
        { permission: 'api::admin-setting.admin-setting.find', roles: [authenticatedRole.id] },
        { permission: 'api::class.class.create', roles: [authenticatedRole.id] },
        { permission: 'api::class.class.delete', roles: [authenticatedRole.id] },
        { permission: 'api::class.class.find', roles: [authenticatedRole.id] },
        { permission: 'api::class.class.findOne', roles: [authenticatedRole.id] },
        { permission: 'api::class.class.getSummary', roles: [authenticatedRole.id] },
        { permission: 'api::class.class.update', roles: [authenticatedRole.id] },
        { permission: 'api::class-teacher.class-teacher.find', roles: [authenticatedRole.id] },
        { permission: 'api::class-teacher.class-teacher.findOne', roles: [authenticatedRole.id] },
        { permission: 'api::curriculum.curriculum.find', roles: [authenticatedRole.id] },
        { permission: 'api::curriculum.curriculum.findOne', roles: [authenticatedRole.id] },
        { permission: 'api::education-level.education-level.find', roles: [authenticatedRole.id] },
        { permission: 'api::education-level.education-level.findOne', roles: [authenticatedRole.id] },
        { permission: 'api::family-link.family-link.find', roles: [authenticatedRole.id] },
        { permission: 'api::family-link.family-link.findOne', roles: [authenticatedRole.id] },
        { permission: 'api::family-link.family-link.update', roles: [authenticatedRole.id] },
        { permission: 'api::issue-reason.issue-reason.find', roles: [authenticatedRole.id] },
        { permission: 'api::meeting-recording.meeting-recording.create', roles: [authenticatedRole.id] },
        { permission: 'api::meeting-recording.meeting-recording.delete', roles: [authenticatedRole.id] },
        { permission: 'api::meeting-recording.meeting-recording.find', roles: [authenticatedRole.id] },
        { permission: 'api::meeting-recording.meeting-recording.findOne', roles: [authenticatedRole.id] },
        { permission: 'api::meeting-recording.meeting-recording.update', roles: [authenticatedRole.id] },
        { permission: 'api::notice.notice.create', roles: [authenticatedRole.id] },
        { permission: 'api::notice.notice.delete', roles: [authenticatedRole.id] },
        { permission: 'api::notice.notice.find', roles: [authenticatedRole.id] },
        { permission: 'api::notice.notice.findOne', roles: [authenticatedRole.id] },
        { permission: 'api::notice.notice.getForUser', roles: [authenticatedRole.id] },
        { permission: 'api::notice.notice.update', roles: [authenticatedRole.id] },
        { permission: 'api::parent.parent.create', roles: [authenticatedRole.id] },
        { permission: 'api::parent.parent.delete', roles: [authenticatedRole.id] },
        { permission: 'api::parent.parent.find', roles: [authenticatedRole.id] },
        { permission: 'api::parent.parent.findOne', roles: [authenticatedRole.id] },
        { permission: 'api::parent.parent.update', roles: [authenticatedRole.id] },
        { permission: 'api::register.register.addTrialStudent', roles: [authenticatedRole.id] },
        { permission: 'api::register.register.assignHomeworksToTeacher', roles: [authenticatedRole.id] },
        { permission: 'api::register.register.find', roles: [authenticatedRole.id] },
        { permission: 'api::register.register.findOne', roles: [authenticatedRole.id] },
        { permission: 'api::register.register.getHomework', roles: [authenticatedRole.id] },
        { permission: 'api::register.register.getNextLessonDate', roles: [authenticatedRole.id] },
        { permission: 'api::register.register.processRegisters', roles: [authenticatedRole.id] },
        { permission: 'api::register.register.removeTrialStudent', roles: [authenticatedRole.id] },
        { permission: 'api::register.register.update', roles: [authenticatedRole.id] },
        { permission: 'api::register.register.updateLessonStatus', roles: [authenticatedRole.id] },
        { permission: 'api::register-student.register-student.bulkUpdate', roles: [authenticatedRole.id] },
        { permission: 'api::register-student.register-student.find', roles: [authenticatedRole.id] },
        { permission: 'api::register-student.register-student.findOne', roles: [authenticatedRole.id] },
        { permission: 'api::register-student.register-student.update', roles: [authenticatedRole.id] },
        { permission: 'api::sales-management-note.sales-management-note.create', roles: [authenticatedRole.id] },
        { permission: 'api::sales-management-note.sales-management-note.delete', roles: [authenticatedRole.id] },
        { permission: 'api::sales-management-note.sales-management-note.find', roles: [authenticatedRole.id] },
        { permission: 'api::sales-management-note.sales-management-note.findOne', roles: [authenticatedRole.id] },
        { permission: 'api::sales-management-note.sales-management-note.update', roles: [authenticatedRole.id] },
        { permission: 'api::schedule.schedule.getForStudent', roles: [authenticatedRole.id] },
        { permission: 'api::schedule.schedule.getForTeacher', roles: [authenticatedRole.id] },
        { permission: 'api::scholarship.scholarship.find', roles: [authenticatedRole.id] },
        { permission: 'api::scholarship.scholarship.findOne', roles: [authenticatedRole.id] },
        { permission: 'api::student.student.create', roles: [authenticatedRole.id] },
        { permission: 'api::student.student.delete', roles: [authenticatedRole.id] },
        { permission: 'api::student.student.find', roles: [authenticatedRole.id] },
        { permission: 'api::student.student.findOne', roles: [authenticatedRole.id] },
        { permission: 'api::student.student.update', roles: [authenticatedRole.id] },
        { permission: 'api::student-class.student-class.create', roles: [authenticatedRole.id] },
        { permission: 'api::student-class.student-class.delete', roles: [authenticatedRole.id] },
        { permission: 'api::student-class.student-class.find', roles: [authenticatedRole.id] },
        { permission: 'api::student-class.student-class.findOne', roles: [authenticatedRole.id] },
        { permission: 'api::student-class.student-class.getClassesForSales', roles: [authenticatedRole.id] },
        { permission: 'api::student-class.student-class.update', roles: [authenticatedRole.id] },
        { permission: 'api::student-class.student-class.confirmPayment', roles: [authenticatedRole.id] },
        { permission: 'api::student-class.student-class.getClassesForSales', roles: [authenticatedRole.id] },
        { permission: 'api::student-scholarship.student-scholarship.create', roles: [authenticatedRole.id] },
        { permission: 'api::student-scholarship.student-scholarship.delete', roles: [authenticatedRole.id] },
        { permission: 'api::student-scholarship.student-scholarship.find', roles: [authenticatedRole.id] },
        { permission: 'api::student-scholarship.student-scholarship.findOne', roles: [authenticatedRole.id] },
        { permission: 'api::student-scholarship.student-scholarship.update', roles: [authenticatedRole.id] },
        { permission: 'api::helper.helper.getSubjectRate', roles: [authenticatedRole.id] },
        { permission: 'api::helper.helper.sendInvoice', roles: [authenticatedRole.id] },
        { permission: 'api::helper.helper.payInvoice', roles: [authenticatedRole.id] },
        { permission: 'api::helper.helper.cancelInvoice', roles: [authenticatedRole.id] },
        { permission: 'api::invoice.invoice.create', roles: [authenticatedRole.id] },
        { permission: 'api::invoice.invoice.delete', roles: [authenticatedRole.id] },
        { permission: 'api::invoice.invoice.find', roles: [authenticatedRole.id] },
        { permission: 'api::invoice.invoice.findOne', roles: [authenticatedRole.id] },
        { permission: 'api::invoice.invoice.update', roles: [authenticatedRole.id] },
        { permission: 'api::invoice-item.invoice-item.create', roles: [authenticatedRole.id] },
        { permission: 'api::invoice-item.invoice-item.delete', roles: [authenticatedRole.id] },
        { permission: 'api::invoice-item.invoice-item.find', roles: [authenticatedRole.id] },
        { permission: 'api::invoice-item.invoice-item.findOne', roles: [authenticatedRole.id] },
        { permission: 'api::invoice-item.invoice-item.update', roles: [authenticatedRole.id] },
        { permission: 'api::payment-subscription.payment-subscription.update', roles: [authenticatedRole.id] },
        { permission: 'api::payment-subscription.payment-subscription.create', roles: [authenticatedRole.id] },
        { permission: 'api::payment-subscription.payment-subscription.delete', roles: [authenticatedRole.id] },
        { permission: 'api::payment-subscription.payment-subscription.find', roles: [authenticatedRole.id] },
        { permission: 'api::payment-subscription.payment-subscription.findOne', roles: [authenticatedRole.id] },
        {
            permission: 'api::payment-subscription-item.payment-subscription-item.update',
            roles: [authenticatedRole.id]
        },
        {
            permission: 'api::payment-subscription-item.payment-subscription-item.create',
            roles: [authenticatedRole.id]
        },
        {
            permission: 'api::payment-subscription-item.payment-subscription-item.delete',
            roles: [authenticatedRole.id]
        },
        { permission: 'api::payment-subscription-item.payment-subscription-item.find', roles: [authenticatedRole.id] },
        {
            permission: 'api::payment-subscription-item.payment-subscription-item.findOne',
            roles: [authenticatedRole.id]
        },
        { permission: 'api::subject.subject.findOne', roles: [authenticatedRole.id] },
        { permission: 'api::teacher.teacher.create', roles: [authenticatedRole.id] },
        { permission: 'api::teacher.teacher.delete', roles: [authenticatedRole.id] },
        { permission: 'api::teacher.teacher.find', roles: [authenticatedRole.id] },
        { permission: 'api::teacher.teacher.findOne', roles: [authenticatedRole.id] },
        { permission: 'api::teacher.teacher.update', roles: [authenticatedRole.id] },
        { permission: 'api::teacher-capability.teacher-capability.getForTeacher', roles: [authenticatedRole.id] },
        { permission: 'api::teacher-capability.teacher-capability.updateForTeacher', roles: [authenticatedRole.id] },
        { permission: 'api::user-type.user-type.find', roles: [authenticatedRole.id] },
        { permission: 'api::year.year.find', roles: [authenticatedRole.id] },
        { permission: 'api::year.year.findOne', roles: [authenticatedRole.id] },
        { permission: 'plugin::upload.content-api.destroy', roles: [authenticatedRole.id] },
        { permission: 'plugin::upload.content-api.find', roles: [authenticatedRole.id] },
        { permission: 'plugin::upload.content-api.findOne', roles: [authenticatedRole.id] },
        { permission: 'plugin::users-permissions.user.findOne', roles: [authenticatedRole.id] },
        { permission: 'plugin::users-permissions.user.me', roles: [authenticatedRole.id] },
    ];

    for (let i = 0; i < rolePermissions.length; i++) {
        const rolePermission = rolePermissions[i];

        for (let j = 0; j < rolePermission.roles.length; j++) {
            const roleId = rolePermission.roles[j];

            if (
                !_.find(permissions, function (item) {
                    return item.action == rolePermission.permission && item.role.id == roleId;
                })
            ) {
                var newPermission = await strapi.entityService.create('plugin::users-permissions.permission', {
                    data: {
                        action: rolePermission.permission,
                        role: roleId
                    }
                });
            }
        }
    }
    //#endregion
}

module.exports = { up };
