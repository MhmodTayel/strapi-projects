'use strict';

/**
 * translation-string service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::translation-string.translation-string');