const { DateTime } = require('luxon');
const AccountUtils = require('../../../../../utils/account-utils');
const _ = require('lodash');

module.exports = {
    async beforeCreate(event) {
        const { result, params } = event;

        if (params.data.studentId == 'GEN_NEW_ID' || _.isEmpty(params.data.studentId)) {
            params.data.studentId = await strapi.service('api::id-config.id-config').getNewId('student');
        }
    },

    async afterCreate(event) {
        const { result, params } = event;

        var userTypes = await strapi.entityService.findMany('api::user-type.user-type');
        var studentUserTypeId = userTypes.find((x) => x.name.toLowerCase() == 'student').id;

        var roles = await strapi.entityService.findMany('plugin::users-permissions.role');
        var authenticatedRoleId = roles.find((x) => x.name.toLowerCase() == 'authenticated').id;

        const newUser = await strapi.entityService.create('plugin::users-permissions.user', {
            data: {
                username: AccountUtils.generateUsername(result.name, result.lastName),
                email: result.email?.toLowerCase() || AccountUtils.generateRandomEmail(),
                password: params.data.password || AccountUtils.generateRandomPassword(), // random password
                user_types: [studentUserTypeId],
                provider: 'local',
                role: authenticatedRoleId,
                student: result.id,
                source: params.data.source
            }
        });

        await calculateGraduationYear(result.id);
    },

    async afterUpdate(event) {
        const {
            params: { data },
            result: { id }
        } = event;

        await strapi.db.query('plugin::users-permissions.user').update({
            where: {
                student: id
            },
            data: {
                email: data.email
            },
            payload: {
                name: event.result.name,
                lastName: event.result.lastName
            }
        });

        await calculateGraduationYear(id);
        if (data.postponeReason && data.postponeDate) await strapi.service('api::student.student').updateStatus(id);
    }
};

async function calculateGraduationYear(studentId) {
    var existingStudent = await strapi.entityService.findOne('api::student.student', studentId, {
        fields: ['id', 'y11GraduationYear'],
        populate: {
            year: {
                fields: ['yearNumber']
            }
        }
    });

    if (existingStudent) {
        var yearNumber = existingStudent.year?.yearNumber;

        // calculate graduation date before uni year only
        if (yearNumber <= 13) {
            const currentYear = new Date().getFullYear();
            var graduationYear = currentYear + (13 - yearNumber);

            if (graduationYear != existingStudent.y11GraduationYear) {
                await strapi.entityService.update('api::student.student', studentId, {
                    data: {
                        y11GraduationYear: graduationYear.toString()
                    }
                });
            }
        }
    }
}
