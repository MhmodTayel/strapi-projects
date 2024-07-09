'use strict';
const _ = require('lodash');

async function up() {
    var roles = await strapi.entityService.findMany('plugin::users-permissions.role');
    for (const action of ['api::education-level.education-level.find', 'api::year.year.find'])
        await strapi.entityService.create('plugin::users-permissions.permission', {
            data: {
                action,
                role: _.find(roles, { type: 'public' }).id
            }
        });
}

module.exports = { up };
