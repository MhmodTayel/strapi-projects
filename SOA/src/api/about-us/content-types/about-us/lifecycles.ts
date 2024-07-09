export default {
  async beforeCreate(event) {
    await strapi.service('api::about-us.about-us').updateAboutUsBoards(event);
  },
};
