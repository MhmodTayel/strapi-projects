const os = require('os');

module.exports = ({ env }) => ({
    'html-viewer': {
        enabled: true,
        resolve: './src/plugins/html-viewer'
    },
    'strapi-plugin-moesif': {
        enabled: true,
        config: {
            moesif: {
                //custom config passed to moesif middleware
                applicationId:
                    'eyJhcHAiOiIxNTA6MTY4MCIsInZlciI6IjIuMSIsIm9yZyI6Ijg4OjIwNjEiLCJpYXQiOjE3MTQ1MjE2MDB9.t5oZ4dxopAax62_c2dKwgI-3TaLv6dY_T3o28mJK_1c',
                getMetadata: function (req, res) {
                    return {
                        environment: env('NODE_ENV'),
                        hostname: os.hostname()
                    };
                }
            }
        }
    },
    sentry: {
        enabled: env('SENTRY_DSN')?.trim() !== '',
        config: {
            dsn: env('SENTRY_DSN'),
            sendMetadata: true,
            environment: env('NODE_ENV')
        }
    },
    'users-permissions': {
        enabled: true,
        config: {
            jwtSecret: env('JWT_SECRET', '7ttvsfr540l4xkqtdygp0qvpy1meqhvom7i8v31q'),
            jwt: {
                expiresIn: '60m'
            }
        }
    },
    upload: {
        config: {
            ...(env('AWS_ACCESS_KEY_ID')?.trim() !== '' && {
                provider: 'aws-s3',
                providerOptions: {
                    accessKeyId: env('AWS_ACCESS_KEY_ID'),
                    secretAccessKey: env('AWS_ACCESS_SECRET'),
                    region: env('AWS_REGION'),
                    s3ForcePathStyle: true,
                    signatureVersion: 'v4',
                    params: {
                        Bucket: env('AWS_BUCKET')
                    }
                }
            }),
            sizeLimit: 250 * 1024 * 1024
        }
    },
    migrations: {
        enabled: true,
        config: {
            autoStart: true,
            migrationFolderPath: 'database/migrations-data'
        }
    }
});
