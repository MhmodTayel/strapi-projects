'use strict';

/**
 * translation-string router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::translation-string.translation-string');