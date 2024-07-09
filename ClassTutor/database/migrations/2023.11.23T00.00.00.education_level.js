'use strict';
const _ = require('lodash');
const { faker } = require('@faker-js/faker');
const DateTimeUtils = require('../../utils/datetime-utils');
const { DateTime } = require('luxon');

async function up(knex) {
    //#region education levels
    var educationLevelsToCreate = [
        { name: 'KS1 Primary', otherName: 'ks1', order: 5 },
        { name: 'KS2 Primary', otherName: 'ks2', order: 10 }
    ];

    var existingKs1 = await strapi.entityService.findMany('api::education-level.education-level', {
        filters: { otherName: educationLevelsToCreate[0].otherName }
    });

    if (existingKs1.length == 0) {
        await strapi.entityService.create('api::education-level.education-level', {
            data: {
                name: educationLevelsToCreate[0].name,
                otherName: educationLevelsToCreate[0].otherName,
                order: educationLevelsToCreate[0].order
            }
        });
    }

    var existingKs2 = await strapi.entityService.findMany('api::education-level.education-level', {
        filters: { otherName: 'primary' }
    });

    if (existingKs2.length > 0) {
        await strapi.entityService.update('api::education-level.education-level', existingKs2[0].id, {
            data: {
                name: educationLevelsToCreate[1].name,
                otherName: educationLevelsToCreate[1].otherName
            }
        });
    }
    //#endregion
}

module.exports = { up };
