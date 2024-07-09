'use strict'
const _ = require('lodash');

async function up(knex) {
    //#custom upload role permissions
    var roles = await strapi.entityService.findMany('plugin::users-permissions.role');
    var publicRole = _.find(roles, { type: "public" });
    var authenticatedRole = _.find(roles, { type: "authenticated" });

    var rolePermissions = [
        { permission: "api::upload.upload.customUpload", roles: [authenticatedRole.id,publicRole] },
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
    //#endregion
}

module.exports = { up };
