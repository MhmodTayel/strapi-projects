'use strict';
const _ = require('lodash');

/**
 * Migration `class-topics`
 */

module.exports = {
    /**
     *
     * @param {import('knex').Knex} knex
     */
    async up(knex) {
        var roles = await strapi.entityService.findMany('plugin::users-permissions.role');
        var authenticatedRole = _.find(roles, { type: 'authenticated' });

        var rolePermissions = [
            { permission: 'api::api::class-topic.class-topic.find', roles: [authenticatedRole.id] },
            { permission: 'api::api::class-topic.class-topic.findOne', roles: [authenticatedRole.id] },
            { permission: 'api::api::class-topic.class-topic.create', roles: [authenticatedRole.id] },
            { permission: 'api::api::class-topic.class-topic.update', roles: [authenticatedRole.id] }
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
};