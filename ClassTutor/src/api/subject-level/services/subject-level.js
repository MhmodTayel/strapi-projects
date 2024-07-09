'use strict';

/**
 * subject-level service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::subject-level.subject-level');
