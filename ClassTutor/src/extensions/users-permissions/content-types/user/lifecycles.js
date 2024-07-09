const AccountUtils = require('../../../../../utils/account-utils');

// For the below to work, had to do this:
// https://forum.strapi.io/t/strapi-create-new-user-users-permissions-plugin-lifecycles/13386/6?u=umair

module.exports = {
    async beforeCreate(event) {
        const { result, params } = event;

        params.data.signupToken = AccountUtils.randomUUID();
    },
    async beforeUpdate(event) {
        const { result, params } = event;
        const { where, data } = params;
        const user = await strapi.db.query('plugin::users-permissions.user').findOne({
            where
        });

        if (user.email?.includes('@noemail.com') && data.email) event.state.sendConfirmationEmail = true;
    },

    async afterUpdate(event) {
        const { result, params } = event;
        const { where, data, payload } = params;
        if (event.state.sendConfirmationEmail == true)
            await strapi
                .service('api::account.account')
                .sendEmailConfirmation({ email: data.email, name: payload.name, lastName: payload.lastName });
    }
};
