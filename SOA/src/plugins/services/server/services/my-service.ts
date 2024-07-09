import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({
  async getWelcomeMessage() {
    return 'Welcome to Strapi 🚀';
  },
});
