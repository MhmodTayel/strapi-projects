'use strict';
const _ = require('lodash');
const { faker } = require('@faker-js/faker');
const DateTimeUtils = require('../../utils/datetime-utils');
const { DateTime } = require('luxon');

async function up(knex) {
    var yearsToCreate = [
        { name: 'Year 0', shortName: 'Y00', otherName: 'Year0', order: 0, yearNumber: '0' },
        { name: 'Year 1', shortName: 'Y01', otherName: 'Year1', order: 10, yearNumber: '1' },
        { name: 'Year 2', shortName: 'Y02', otherName: 'Year2', order: 20, yearNumber: '2' },
        { name: 'University', shortName: 'Uni', otherName: 'University', order: 140, yearNumber: '20' },
        { name: 'Adult', shortName: 'Adult', otherName: 'Adult', order: 150, yearNumber: '30' }
    ];

    for (let index = 0; index < yearsToCreate.length; index++) {
        const year = yearsToCreate[index];

        var existing = await strapi.entityService.findMany('api::year.year', {
            filters: { name: year.name }
        });

        if (existing.length == 0) {
            const entry = await strapi.entityService.create('api::year.year', {
                data: {
                    name: year.name,
                    shortName: year.shortName,
                    otherName: year.otherName,
                    order: year.order,
                    yearNumber: year.yearNumber,
                    isALevels: year.isALevels ?? false
                }
            });
        }
    }
}

module.exports = { up };
