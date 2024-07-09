'use strict';

/**
 * exam-board service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::exam-board.exam-board');
