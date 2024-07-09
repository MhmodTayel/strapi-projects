'use strict';


async function up(knex) {
  await knex.schema.table('teachers', (table) => {
    table.boolean('is_contract_signed').defaultTo(false);
    table.date('leave_date');
    table.string('hmrc_status', 255);
    table.string('companies_house_status', 255);
  });
}


module.exports = { up };