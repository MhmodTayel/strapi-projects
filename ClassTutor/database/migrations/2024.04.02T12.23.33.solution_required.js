'use strict';

async function up(knex) {
    await strapi.db.query('api::subject.subject').updateMany({
        where: {
            code: ['MAT', 'SCI']
        },
        data: {
            solutionRequiredGroup: true
        }
    });

    // await strapi.db.query('api::class.class').updateMany({
    //     where: {
    //         subject: {
    //             code: ['MAT', 'SCI']
    //         }
    //     },
    //     data: {
    //         solutionRequired: true
    //     }
    // });
}

module.exports = { up };
