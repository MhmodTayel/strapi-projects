const _ = require('lodash');

module.exports = async () => {
    var roles = await strapi.entityService.findMany('plugin::users-permissions.role');
    var authenticatedRole = _.find(roles, { type: 'authenticated' });

    var rolePermissions = [
        { permission: 'api::subject-level.subject-level.find', roles: [authenticatedRole.id] },
        { permission: 'api::subject-level.subject-level.findOne', roles: [authenticatedRole.id] }
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
};
