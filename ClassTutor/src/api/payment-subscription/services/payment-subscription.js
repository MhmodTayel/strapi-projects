'use strict';

/**
 * payment-subscription service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::payment-subscription.payment-subscription');
