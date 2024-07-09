'use strict';
const _ = require('lodash');
const { Knex } = require('knex');
/**
 *
 * @param {Knex} knex
 */
async function up(knex) {
    if(await knex.schema.hasColumn('registers','has_homework')) return;
    await knex.schema.alterTable('registers', (table) => {
        table.boolean('has_homework').notNullable().defaultTo(false);
    });
}

module.exports = { up };
