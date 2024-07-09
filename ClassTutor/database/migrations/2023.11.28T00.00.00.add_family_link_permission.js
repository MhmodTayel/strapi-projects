'use strict';
const _ = require('lodash');

async function up() {
    var roles = await strapi.entityService.findMany('plugin::users-permissions.role');
    await strapi.entityService.create('plugin::users-permissions.permission', {
        data: {
            action: 'api::family-link.family-link.canUnLinkByEntityId',
            role: _.find(roles, { type: 'authenticated' }).id
        }
    });
}

module.exports = { up };
