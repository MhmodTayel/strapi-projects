// const strapi = require('@strapi/strapi');
// strapi().start();

const strapi = require('strapi');
strapi({ dir: process.cwd(), autoReload: true }).start();
