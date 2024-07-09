'use strict';
const _ = require('lodash');

async function up(knex) {
    await knex.schema.alterTable('student_classes', (table) => {
        table.string('classType', 255);
    });
}

module.exports = { up };
