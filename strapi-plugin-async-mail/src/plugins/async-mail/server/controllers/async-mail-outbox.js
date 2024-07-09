'use strict';

/**
 *  controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('plugin::async-mail.async-mail-outbox');
