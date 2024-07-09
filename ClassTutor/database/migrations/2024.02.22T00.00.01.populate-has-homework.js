'use strict';
const _ = require('lodash');
const { Knex } = require('knex');
/**
 *
 * @param {Knex} knex
 */
async function up(knex) {
    let ids = await knex('registers')
        .whereNotNull('registers.homework_deadline')
        .whereNull('has_homework')
        .innerJoin('files_related_morphs', function () {
            this.on('files_related_morphs.related_id', '=', 'registers.id');
        })
        .groupBy('registers.id')
        .whereNotNull('files_related_morphs.related_id')
        .select('registers.id');

    await knex('registers').whereIn('id', ids?.map(e=>e.id)).update({
        has_homework: true
    });

    ids = await knex('registers')
        .whereNotNull('registers.homework_deadline')
        .whereNull('has_homework')
        .innerJoin('files_related_morphs', function () {
            this.on('files_related_morphs.related_id', '=', 'registers.id');
        })
        .groupBy('registers.id')
        .whereNull('files_related_morphs.related_id')
        .select('registers.id');

    await knex('registers').whereIn('id', ids?.map(e=>e.id)).update({
        has_homework: false
    });
}

module.exports = { up };
