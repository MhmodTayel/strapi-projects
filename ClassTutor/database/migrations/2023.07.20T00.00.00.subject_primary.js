'use strict'
const _ = require('lodash');
const { faker } = require('@faker-js/faker');
const DateTimeUtils = require('../../utils/datetime-utils');
const { DateTime } = require("luxon");

async function up(knex) {

    var existingSubjects = await strapi.entityService.findMany("api::subject.subject", {
        filters: {
            code: ["MAT", "ENG", "SCI"]
        }
    });

    for (let index = 0; index < existingSubjects.length; index++) {
        const subject = existingSubjects[index];

        const entry = await strapi.entityService.update('api::subject.subject', subject.id, {
            data: {
                isPrimarySubject: true
            },
        });
    }

}

module.exports = { up };
