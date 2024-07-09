'use strict';

/**
 * **Note** this service will not work until you create a new model so i used the helper controller directly
 */
const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::helper.helper', async ({ strapi }) => ({}));
