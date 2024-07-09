'use strict';

/**
 * meeting-account service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::meeting-account.meeting-account');
