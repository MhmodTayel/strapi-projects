'use strict';
const _ = require('lodash');
const { faker } = require('@faker-js/faker');
const DateTimeUtils = require('../../utils/datetime-utils');
const { DateTime } = require('luxon');

async function up(knex) {
    var classes = await strapi.entityService.findMany('api::class.class');

    for (let i = 0; i < classes.length; i++) {
        const _class = classes[i];

        _class.dayOfWeek = DateTimeUtils.strapiDateToDayOfWeek(_class.startDate).toLowerCase();

        await strapi.entityService.update('api::class.class', _class.id, {
            data: {
                dayOfWeek: _class.dayOfWeek
            }
        });
    }
}

module.exports = { up };
