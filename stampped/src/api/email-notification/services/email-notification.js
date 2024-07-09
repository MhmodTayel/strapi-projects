'use strict';

/**
 * email-notification service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::email-notification.email-notification');