import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({
  async getRequestByServiceSlugAndId(slug, id) {
    const result = await strapi.db
      .query(slug)
      .findOne({
        where: { id },
        populate: [
          'childrenAttachments',
          'wifeAttachments',
          'nationalIDFront',
          'nationalIDBack',
        ],
      });
    return result;
  },

  async updateRequest(slug, id, data) {
    const result = await strapi.db.query(slug).update({ where: { id }, data });
    return result;
  },
  async createRequest(serviceSlug, data) {
    const result = await strapi.db.query(serviceSlug).create({ data });
    return result;
  },
});
