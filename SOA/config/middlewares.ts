export default [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'script-src': [
            "'self'",
            "'unsafe-inline'",
            process.env.VIRTUAL_HOST,
            'cdnjs.cloudflare.com',
          ],
          'worker-src': [
            process.env.VIRTUAL_HOST,
            'cdnjs.cloudflare.com',
            'blob:',
          ],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            process.env.MINIO_ENDPOINT,
            'https://dl.airtable.com',
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            process.env.MINIO_ENDPOINT,
            'https://dl.airtable.com',
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  // 'strapi::cors',
  {
    name: 'strapi::cors',
    config: {
      // enabled: true,
      headers: '*',
      origin: process.env.FRONTEND_ORIGIN,
    },
  },
  {
    name: 'strapi::poweredBy',
    config: {
      poweredBy: 'Fixed Solutions fixedmea.com',
    },
  },
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
