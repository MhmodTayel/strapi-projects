import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({
  async getAllRequestsByServiceSlug(ctx) {
    try {
      const { query, params } = ctx.request;
      return strapi
        .plugin('services')
        .service('dynamicServices')
        .getAllRequestsByServiceSlug();
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  async getRequestByServiceSlugAndId(ctx) {
    try {
      const {
        params: { slug, id },
      } = ctx.request;
      return strapi
        .plugin('services')
        .service('dynamicServices')
        .getRequestByServiceSlugAndId(slug, id);
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  async updateRequest(ctx) {
    try {
      const {
        params: { slug, id },
        body,
      } = ctx.request;

      return strapi
        .plugin('services')
        .service('dynamicServices')
        .updateRequest(slug, id, body);
    } catch (error) {
      ctx.throw(500, error);
    }
  },
  async createRequest(ctx) {
    try {
      const {
        params: { serviceSlug },
        body,
      } = ctx.request;

      return strapi
        .plugin('services')
        .service('dynamicServices')
        .createRequest(serviceSlug, body);
    } catch (error) {
      ctx.throw(500, error);
    }
  },
});
