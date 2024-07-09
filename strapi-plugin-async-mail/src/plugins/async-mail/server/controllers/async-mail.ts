import { Strapi } from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({
  async create(ctx) {
    try {
      ctx.body = await strapi
        .plugin("async-mail")
        .service("async-mail")
        .create(ctx.request.body);
    } catch (error) {
      throw error;
    }
  },
});
