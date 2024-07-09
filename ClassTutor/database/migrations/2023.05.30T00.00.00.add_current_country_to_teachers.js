'use strict';
const _ = require('lodash');

async function up(knex) {
  await knex.schema.alterTable('teachers', (table) => {
    table.string('current_country', 255);
  });
}

module.exports = { up };
