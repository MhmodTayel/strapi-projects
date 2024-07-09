'use strict';

module.exports = ({ strapi }) => {
  // registeration phase
  strapi.customFields.register({
    name: 'html-viewer',
    plugin: 'html-viewer',
    type: 'text',
  });
};
