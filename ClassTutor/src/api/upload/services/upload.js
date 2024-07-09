'use strict';

module.exports = {
    async removeById(fileId) {
        const file = await strapi.plugin('upload').service('upload').findOne(fileId);
        await strapi.plugin('upload').service('upload').remove(file);
        return true;
    }
};
