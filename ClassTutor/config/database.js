module.exports = ({ env }) => ({
    connection: {
        client: 'postgres',
        connection: {
            host: env('DATABASE_HOST', 'classtutor-strapi-staging.chxgszppbkgf.eu-west-2.rds.amazonaws.com'),
            port: env.int('DATABASE_PORT', 5432),
            database: env('DATABASE_NAME', 'strapiTayel'),
            user: env('DATABASE_USERNAME', 'postgres'),
            password: env('DATABASE_PASSWORD', 'classtutor'),
            schema: env('DATABASE_SCHEMA', 'public'), // Not required
            ssl: false
        }
    }
});
