'use strict';

/**
 * sales-team service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::sales-team.sales-team');