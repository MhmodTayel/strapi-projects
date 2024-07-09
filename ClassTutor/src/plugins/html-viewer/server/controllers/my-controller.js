'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('html-viewer')
      .service('myService')
      .getWelcomeMessage();
  },
});
