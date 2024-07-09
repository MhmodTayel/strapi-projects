import cronTasks from './cron-tasks';

export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
  watch_ignore_files: ['**/*.xlsx'],
  url: env('VIRTUAL_HOST'),
  cron: {
    enabled: true,
    tasks: cronTasks,
  },
  server: {
    // ...
    proxy: {
      // ...
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
  proxy: {
    // ...
    ssl: {
      rejectUnauthorized: false,
    },
  },
  ssl: {
    rejectUnauthorized: false,
  },rejectUnauthorized: false
});
