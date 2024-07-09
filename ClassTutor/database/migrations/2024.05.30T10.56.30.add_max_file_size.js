'use strict';

/**
 * Migration `add_max_file_size`
 */

module.exports = {
    /**
     *
     * @param {import('knex').Knex} knex
     */
    async up(knex) {
        await knex.schema.alterTable('admin_settings', async function (table) {
            if (!await knex.schema.hasColumn('admin_settings', 'max_file_size')) {
                table.integer('max_file_size', 32).defaultTo(250);
            }

            await strapi.db.query('api::admin-setting.admin-setting').updateMany({
                where: {
                    maxFileSize: {
                        $null: true
                    }
                },
                data: {
                    maxFileSize: 250
                }
            });
        });
    }
};
