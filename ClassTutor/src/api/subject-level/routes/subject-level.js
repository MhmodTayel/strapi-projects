'use strict';

/**
 * subject-level router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::subject-level.subject-level');
