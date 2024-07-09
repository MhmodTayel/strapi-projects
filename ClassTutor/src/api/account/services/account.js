'use strict';

/**
 * audit-log service
 */
const utils = require('@strapi/utils');
const { ApplicationError } = utils.errors;
const crypto = require('crypto');
const EmailHelper = require('../../../../utils/email-helper');
const EmailTemplates = require('../../../../utils/email-templates');

async function sendConfirmationEmail(user, name) {
    const confirmationToken = crypto.randomBytes(20).toString('hex');
    await edit(user.id, { confirmationToken });
    // Send an email to the user.
    await EmailHelper.sendTemplateEmail(EmailTemplates.ACCOUNT.ACCOUNT_EMAIL_CONFIRMATION, name, user.email, {
        name: name,
        link: `${process.env.FRONTEND_URL}/account-confirmation?token=${confirmationToken}`
    });
}

async function edit(userId, params = {}) {
    return strapi.entityService.update('plugin::users-permissions.user', userId, {
        data: params,
        populate: ['role']
    });
}

module.exports = {
    async sendEmailConfirmation({ email, name, lastName }) {
        const user = await strapi.query('plugin::users-permissions.user').findOne({
            where: { email: email.toLowerCase() }
        });
        if (!user) {
            throw new ApplicationError('Invalid email');
        }

        if (user.confirmed) return;

        if (user.blocked) {
            throw new ApplicationError('User blocked');
        }

        await sendConfirmationEmail(user, `${name} ${lastName}`);

        return {
            email: user.email,
            sent: true
        };
    }
};
