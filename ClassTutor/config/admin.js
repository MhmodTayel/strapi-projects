module.exports = ({ env }) => ({
    auth: {
        secret: env('ADMIN_JWT_SECRET', 'caeaad849ffc113f46b18038aeffb017')
    },
    apiToken: {
        salt: env('API_TOKEN_SALT', 'bcf0a063552411458a37e08e5028bafd')
    },
    watchIgnoreFiles: ['**/config/sync/**']
});
