'use strict';

/**
 * admin-setting service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::admin-setting.admin-setting');
