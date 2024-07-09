const { DateTime } = require('luxon');
const AccountUtils = require('../../../../../utils/account-utils');
const _ = require('lodash');

module.exports = {
    async beforeCreate(event) {
        const { result, params } = event;

        if (params.data.parentId == 'GEN_NEW_ID' || _.isEmpty(params.data.parentId)) {
            params.data.parentId = await strapi.service('api::id-config.id-config').getNewId('parent');
        }
    },

    async afterCreate(event) {
        const { result, params } = event;

        var userTypes = await strapi.entityService.findMany('api::user-type.user-type');
        var parentUserTypeId = userTypes.find((x) => x.name.toLowerCase() == 'parent').id;

        var roles = await strapi.entityService.findMany('plugin::users-permissions.role');
        var authenticatedRoleId = roles.find((x) => x.name.toLowerCase() == 'authenticated').id;

        const newUser = await strapi.entityService.create('plugin::users-permissions.user', {
            data: {
                username: AccountUtils.generateUsername(result.name, result.lastName),
                email: result.email?.toLowerCase() || AccountUtils.generateRandomEmail(),
                password: params.data.password || AccountUtils.generateRandomPassword(), // random password
                user_types: [parentUserTypeId],
                provider: 'local',
                role: authenticatedRoleId,
                parent: result.id,
                source: params.data.source
            }
        });
    },
    async afterUpdate(event) {
        const {
            params: { data },
            result: { id }
        } = event;

        await strapi.db.query('plugin::users-permissions.user').update({
            where: {
                parent: id
            },
            data: {
                email: data.email
            },
            payload: {
                name: event.result.name,
                lastName: event.result.lastName
            }
        });
    }
};
