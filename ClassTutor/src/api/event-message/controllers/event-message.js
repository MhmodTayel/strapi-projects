'use strict';

/**
 * event-message controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::event-message.event-message', ({ strapi }) => ({
    async test(ctx) {
        const response = await strapi.service('api::event-message.event-message').test(ctx.request.body);

        return response;
    }
}));
