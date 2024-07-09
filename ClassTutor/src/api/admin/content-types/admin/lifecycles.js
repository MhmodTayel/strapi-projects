const { DateTime } = require('luxon');
const AccountUtils = require('../../../../../utils/account-utils');

module.exports = {
    async afterCreate(event) {
        const { result, params } = event;

        var userTypes = await strapi.entityService.findMany('api::user-type.user-type');
        var adminUserTypeId = userTypes.find((x) => x.name.toLowerCase() == 'admin').id;

        var roles = await strapi.entityService.findMany('plugin::users-permissions.role');
        var authenticatedRoleId = roles.find((x) => x.name.toLowerCase() == 'authenticated').id;

        const newUser = await strapi.entityService.create('plugin::users-permissions.user', {
            data: {
                username: result.name.replace(/ /g, '_'),
                email: result.email?.toLowerCase() || AccountUtils.generateRandomEmail(),
                password: params.data.password || AccountUtils.generateRandomPassword(), // random password
                user_types: [adminUserTypeId],
                provider: 'local',
                role: authenticatedRoleId,
                admin: result.id
            }
        });
    },

    async afterUpdate(event) {
        const { result, params } = event;
        const { data, where, select, populate } = event.params;

        await strapi.db.query('plugin::users-permissions.user').update({
            where: {
                admin: result.id
            },
            data: {
                email: data.name,
                username: data.name
            },
            payload: {
                name: data.name,
                lastName: data.lastName
            }
        });
    }
};
