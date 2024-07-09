export default async (strapi) => {
  const {
    db: { connection },
  } = strapi;
  const textIndexes = [
    {
      name: 'requests_index',
      table: 'unique_renewal_requests',
      column: 'member_id',
      constraint: 'requests_unique',
    },
    {
      name: 'soa_talents_index',
      table: 'up_users',
      column: 'phone',
      constraint: 'soa_talents_unique',
    },
    {
      name: 'drama_makers_index',
      table: 'drama_makers',
      column: 'email',
      constraint: 'drama_makers_unique',
    },
  ];

  await Promise.all(
    textIndexes.map(async ({ name, table, column, constraint }) => {
      await connection.raw(
        `CREATE UNIQUE INDEX IF NOT EXISTS ${name} ON ${table} (${column}) ;
        `
      );
      await connection.raw(
        `ALTER TABLE ${table} DROP CONSTRAINT IF EXISTS ${constraint}`
      );
      await connection.raw(
        `ALTER TABLE ${table} ADD CONSTRAINT ${constraint} UNIQUE USING INDEX ${name}`
      );
    })
  );
};
