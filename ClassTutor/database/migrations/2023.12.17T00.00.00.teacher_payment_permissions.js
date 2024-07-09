'use strict';
const _ = require('lodash');

async function up() {
    var roles = await strapi.entityService.findMany('plugin::users-permissions.role');
    for (const action of [
        'api::teacher-payment.teacher-payment.find',
        'api::teacher-payment.teacher-payment.create',
        'api::teacher-payment.teacher-payment.update',
        'api::teacher-payment.teacher-payment.delete',
        'api::teacher-payment.teacher-payment.findOne'
    ])
        await strapi.entityService.create('plugin::users-permissions.permission', {
            data: {
                action,
                role: _.find(roles, { type: 'authenticated' }).id
            }
        });
}

module.exports = { up };
