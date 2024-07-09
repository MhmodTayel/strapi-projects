'use strict';
const _ = require('lodash');
const { faker } = require('@faker-js/faker');
const DateTimeUtils = require('../../utils/datetime-utils');
const { DateTime } = require('luxon');

async function up(knex) {
    //#region init role permissions
    var roles = await strapi.entityService.findMany('plugin::users-permissions.role');
    var publicRole = _.find(roles, { type: 'public' });
    var authenticatedRole = _.find(roles, { type: 'authenticated' });

    var rolePermissions = [{ permission: 'api::student-feed.student-feed.getFeed', roles: [authenticatedRole.id] }];

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
