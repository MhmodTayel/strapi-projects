'use strict';
const _ = require('lodash');

async function up(knex) {
    var roles = await strapi.entityService.findMany('plugin::users-permissions.role');
    var authenticatedRole = _.find(roles, { type: 'authenticated' });

    var rolePermissions = [
        { permission: 'plugin::users-permissions.user.find', roles: [authenticatedRole.id] },
        { permission: 'plugin::users-permissions.user.update', roles: [authenticatedRole.id] }
    ];

    for (let i = 0; i < rolePermissions.length; i++) {
        const rolePermission = rolePermissions[i];

        for (let j = 0; j < rolePermission.roles.length; j++) {
            const roleId = rolePermission.roles[j];

            await strapi.entityService.create('plugin::users-permissions.permission', {
                data: {
                    action: rolePermission.permission,
                    role: roleId
                }
            });
        }
    }
}

module.exports = { up };
