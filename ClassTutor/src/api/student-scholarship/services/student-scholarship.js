'use strict';

/**
 * student-scholarship service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::student-scholarship.student-scholarship');
