module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        s3Options: {
          accessKeyId: env('AWS_ACCESS_KEY_ID'),
          secretAccessKey: env('AWS_ACCESS_SECRET'),
          region: env('AWS_REGION'),
          params: {
            ACL: env('AWS_ACL', 'private'),
            signedUrlExpires: env('AWS_SIGNED_URL_EXPIRES', 1 * 60),
            Bucket: env('AWS_BUCKET'),
          },
        },
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
  'strapi-wechat-miniprogram-auth': {
    enabled: true,
  },
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
          user: env('GMAIL_ADDRESS', 'email'),
          pass: env('GMAIL_PASSWORD', 'password'),
        },
      },
      settings: {
        defaultFrom: env('EMAIL_DEFAULT_FROM_ADDRESS'),
        defaultReplyTo: env('EMAIL_DEFAULT_TO_ADDRESS'),
      },
    },
  },
});
