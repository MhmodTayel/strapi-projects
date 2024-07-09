'use strict';

/**
 * Migration `add_pay_rates`
 */

const payRates = {
    regular: [
        {
            teacher: 'Class Owner',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 1,
            trainee: '10',
            junior: '10',
            associate: '15',
            senior: '15'
        },
        {
            teacher: 'Class Owner',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 2,
            trainee: '15',
            junior: '15',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Class Owner',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 3,
            trainee: '15',
            junior: '20',
            associate: '25',
            senior: '25'
        },
        {
            teacher: 'Class Owner',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 4,
            trainee: '15',
            junior: '20',
            associate: '25',
            senior: '30'
        },
        {
            teacher: 'Class Owner',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 5,
            trainee: '15',
            junior: '20',
            associate: '25',
            senior: '30'
        },
        {
            teacher: 'Class Owner',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 6,
            trainee: '15',
            junior: '20',
            associate: '25',
            senior: '30'
        },
        {
            teacher: 'Class Owner',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 7,
            trainee: '15',
            junior: '20',
            associate: '25',
            senior: '30'
        },
        {
            teacher: 'Class Owner',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 8,
            trainee: '15',
            junior: '20',
            associate: '25',
            senior: '30'
        },
        {
            teacher: 'Class Owner',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 9,
            trainee: '15',
            junior: '20',
            associate: '25',
            senior: '30'
        },
        {
            teacher: 'Class Owner',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 10,
            trainee: '15',
            junior: '20',
            associate: '25',
            senior: '30'
        },
        {
            teacher: 'Class Owner',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 11,
            trainee: '15',
            junior: '20',
            associate: '25',
            senior: '30'
        },
        {
            teacher: 'Class Owner',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 12,
            trainee: '15',
            junior: '20',
            associate: '25',
            senior: '30'
        },
        {
            teacher: 'Class Owner',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 13,
            trainee: '15',
            junior: '20',
            associate: '25',
            senior: '30'
        },
        {
            teacher: 'Class Owner',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 14,
            trainee: '15',
            junior: '20',
            associate: '25',
            senior: '30'
        },
        {
            teacher: 'Class Owner',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 15,
            trainee: '15',
            junior: '20',
            associate: '25',
            senior: '30'
        },

        {
            teacher: 'Cover (material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 1,
            trainee: '10',
            junior: '10',
            associate: '15',
            senior: '15'
        },
        {
            teacher: 'Cover (material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 2,
            trainee: '15',
            junior: '15',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Cover (material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 3,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Cover (material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 4,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Cover (material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 5,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Cover (material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 6,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Cover (material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 7,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Cover (material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 8,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Cover (material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 9,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Cover (material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 10,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Cover (material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 11,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Cover (material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 12,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Cover (material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 13,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Cover (material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 14,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Cover (material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 15,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },

        {
            teacher: 'Cover (no material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 1,
            trainee: '10',
            junior: '10',
            associate: '15',
            senior: '15'
        },
        {
            teacher: 'Cover (no material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 2,
            trainee: '15',
            junior: '15',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Cover (no material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 3,
            trainee: '15',
            junior: '20',
            associate: '25',
            senior: '25'
        },
        {
            teacher: 'Cover (no material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 4,
            trainee: '15',
            junior: '20',
            associate: '25',
            senior: '25'
        },
        {
            teacher: 'Cover (no material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 5,
            trainee: '15',
            junior: '20',
            associate: '25',
            senior: '25'
        },
        {
            teacher: 'Cover (no material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 6,
            trainee: '15',
            junior: '20',
            associate: '25',
            senior: '25'
        },
        {
            teacher: 'Cover (no material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 7,
            trainee: '15',
            junior: '20',
            associate: '25',
            senior: '25'
        },
        {
            teacher: 'Cover (no material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 8,
            trainee: '15',
            junior: '20',
            associate: '25',
            senior: '25'
        },
        {
            teacher: 'Cover (no material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 9,
            trainee: '15',
            junior: '20',
            associate: '25',
            senior: '25'
        },
        {
            teacher: 'Cover (no material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 10,
            trainee: '15',
            junior: '20',
            associate: '25',
            senior: '25'
        },
        {
            teacher: 'Cover (no material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 11,
            trainee: '15',
            junior: '20',
            associate: '25',
            senior: '25'
        },
        {
            teacher: 'Cover (no material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 12,
            trainee: '15',
            junior: '20',
            associate: '25',
            senior: '25'
        },
        {
            teacher: 'Cover (no material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 13,
            trainee: '15',
            junior: '20',
            associate: '25',
            senior: '25'
        },
        {
            teacher: 'Cover (no material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 14,
            trainee: '15',
            junior: '20',
            associate: '25',
            senior: '25'
        },
        {
            teacher: 'Cover (no material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 15,
            trainee: '15',
            junior: '20',
            associate: '25',
            senior: '25'
        },
        {
            teacher: 'Class Owner',
            subject: 'N/A',
            type: 'private',
            year: 'N/A',
            noOfStudents: 'N/A',
            trainee: '20',
            junior: '20',
            associate: '20',
            senior: '20'
        },

        {
            teacher: 'Cover (material)',
            subject: 'N/A',
            type: 'private',
            year: 'N/A',
            noOfStudents: 'N/A',
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Cover (no material)',
            subject: 'N/A',
            type: 'private',
            year: 'N/A',
            noOfStudents: 'N/A',
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        }
    ],
    summer: [
        {
            teacher: 'Class Owner',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 1,
            trainee: '10',
            junior: '10',
            associate: '10',
            senior: '10'
        },
        {
            teacher: 'Class Owner',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 2,
            trainee: '15',
            junior: '15',
            associate: '15',
            senior: '15'
        },
        {
            teacher: 'Class Owner',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 3,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Class Owner',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 4,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Class Owner',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 5,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Class Owner',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 6,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Class Owner',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 7,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Class Owner',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 8,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Class Owner',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 9,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Class Owner',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 10,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Class Owner',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 11,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Class Owner',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 12,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Class Owner',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 13,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Class Owner',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 14,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Class Owner',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 15,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },

        {
            teacher: 'Cover (material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 1,
            trainee: '10',
            junior: '10',
            associate: '10',
            senior: '10'
        },
        {
            teacher: 'Cover (material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 2,
            trainee: '15',
            junior: '15',
            associate: '15',
            senior: '15'
        },
        {
            teacher: 'Cover (material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 3,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Cover (material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 4,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Cover (material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 5,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Cover (material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 6,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Cover (material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 7,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Cover (material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 8,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Cover (material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 9,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Cover (material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 10,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Cover (material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 11,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Cover (material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 12,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Cover (material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 13,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Cover (material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 14,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Cover (material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 15,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },

        {
            teacher: 'Cover (no material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 1,
            trainee: '10',
            junior: '10',
            associate: '10',
            senior: '10'
        },
        {
            teacher: 'Cover (no material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 2,
            trainee: '15',
            junior: '15',
            associate: '15',
            senior: '15'
        },
        {
            teacher: 'Cover (no material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 3,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Cover (no material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 4,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Cover (no material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 5,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Cover (no material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 6,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Cover (no material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 7,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Cover (no material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 8,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Cover (no material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 9,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Cover (no material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 10,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Cover (no material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 11,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Cover (no material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 12,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Cover (no material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 13,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Cover (no material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 14,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Cover (no material)',
            subject: 'N/A',
            type: 'group',
            year: 'N/A',
            noOfStudents: 15,
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Class Owner',
            subject: 'N/A',
            type: 'private',
            year: 'N/A',
            noOfStudents: 'N/A',
            trainee: '20',
            junior: '20',
            associate: '20',
            senior: '20'
        },

        {
            teacher: 'Cover (material)',
            subject: 'N/A',
            type: 'private',
            year: 'N/A',
            noOfStudents: 'N/A',
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        },
        {
            teacher: 'Cover (no material)',
            subject: 'N/A',
            type: 'private',
            year: 'N/A',
            noOfStudents: 'N/A',
            trainee: '15',
            junior: '20',
            associate: '20',
            senior: '20'
        }
    ]
};

module.exports = {
    /**
     *
     * @param {import('knex').Knex} knex
     */
    async up(knex) {
        await knex.schema.alterTable('admin_settings', async function (table) {
            if (!(await knex.schema.hasColumn('admin_settings', 'pay_rates'))) {
                table.json('pay_rates').defaultTo({});
            }
            await strapi.db.query('api::admin-setting.admin-setting').update({
                where: {
                    payRates: {
                        $null: true
                    }
                },
                data: {
                    payRates
                }
            });
        });
    }
};
