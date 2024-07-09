'use strict';
const _ = require('lodash');

async function up() {
    var roles = await strapi.entityService.findMany('plugin::users-permissions.role');
    var publicRole = _.find(roles, { type: 'public' });
    var authenticatedRole = _.find(roles, { type: 'authenticated' });

    var rolePermissions = [
        { permission: 'api::group.group.find', roles: [authenticatedRole.id] },
        { permission: 'api::group.group.findOne', roles: [authenticatedRole.id] },
    ];

    for (let i = 0; i < rolePermissions.length; i++) {
        const rolePermission = rolePermissions[i];

        for (let j = 0; j < rolePermission.roles.length; j++) {
            const roleId = rolePermission.roles[j];

            var newPermission = await strapi.entityService.create('plugin::users-permissions.permission', {
                data: {
                    action: rolePermission.permission,
                    role: roleId
                }
            });
        }
    }
}

module.exports = { up };
