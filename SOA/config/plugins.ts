/* eslint-disable max-lines-per-function */
export default ({ env }) => ({
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        accessKeyId: env('MINIO_ACCESS_KEY'),
        secretAccessKey: env('MINIO_SECRET_KEY'),
        endpoint: env('MINIO_ENDPOINT'),
        s3ForcePathStyle: true,
        signatureVersion: 'v4',
        params: {
          Bucket: env('MINIO_BUCKET'),
        },
      },
      sizeLimit: 100 * 1024 * 1024,
    },
  },

  'strapi-amqplib-wrapper': {
    config: {
      rabbitmqUrl: env('RABBITMQ_URL'),
      maxRetries: 100,
      baseRetryInterval: 20000,
      prefetchNumber: 10,
      queues: [
        {
          name: 'q-notification',
          bindExchange: 'x-notification',
          options: {
            deadLetterExchange: 'x-notification-dead-letter',
            durable: true,
          },
        },
        {
          name: 'q-notification-dead-letter',
          bindExchange: 'x-notification-dead-letter',
          options: {
            deadLetterExchange: 'x-notification',
            messageTtl: 30000,
            durable: true,
          },
        },
        {
          name: 'failed_push_tokens_queue',
          bindExchange: 'x-failed_push_tokens',
        },
      ],
      exchanges: [
        {
          name: 'x-notification',
          type: 'direct',
          options: {
            durable: true,
          },
        },
        {
          name: 'x-notification-dead-letter',
          type: 'direct',
          options: {
            durable: true,
          },
        },
        {
          name: 'x-failed_push_tokens',
          type: 'direct',
          options: {
            durable: true,
          },
        },
      ],
    },
  },
  email: {
    config: {
      provider: 'strapi-provider-email-rabbitmq',
      settings: {
        defaultFrom: env('EMAIL_FROM'),
        defaultReplyTo: env('EMAIL_FROM'),
        testAddress: env('EMAIL_FROM'),
        host: env('EMAIL_HOST'),
        port: env('EMAIL_PORT'),
        user: env('EMAIL_USER'),
        pass: env('EMAIL_PASS'),
      },
    },
  },
  menus: {
    config: {
      maxDepth: 2,
    },
  },
  'users-permissions': {
    config: {
      ratelimit: {
        interval: 30,
        max: 5000000,
        message: 'Too many attempts',
      },
    },
  },
  services: {
    enabled: true,
    resolve: './src/plugins/services', // path to plugin folder
  },
});
