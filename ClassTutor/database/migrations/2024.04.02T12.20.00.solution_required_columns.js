'use strict';

async function up(knex) {
    if (!(await knex.schema.hasColumn('subjects', 'solution_required_group'))) {
        await knex.schema.alterTable('subjects', (table) => {
            table.boolean('solution_required_group');
        });
    }

    if (!(await knex.schema.hasColumn('classes', 'solution_required'))) {
        await knex.schema.alterTable('classes', (table) => {
            table.boolean('solution_required');
        });
    }
}

module.exports = { up };
