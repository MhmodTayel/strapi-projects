'use strict';

/**
 * event-message router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::event-message.event-message');
