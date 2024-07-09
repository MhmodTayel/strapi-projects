module.exports = {
  provider: 'strapi-provider-email-rabbitmq',
  name: 'strapi-provider-email-rabbitmq',
  init: (_, settings = {}) => {
    strapi
      .store({ type: 'plugin', name: 'email', key: 'settings' })
      .set({ value: settings });
    return {
      send: async (msgConfig) =>
        strapi
          .plugin('strapi-amqplib-wrapper')
          .instance.publish('x-notification', {
            means: 'email',
            msgConfig,
          }),
    };
  },
};
