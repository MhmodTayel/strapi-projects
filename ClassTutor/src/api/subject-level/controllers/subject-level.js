'use strict';

/**
 * subject-level controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::subject-level.subject-level');
