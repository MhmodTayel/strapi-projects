import _ from 'lodash';
const { replaceWildcard } = require('./generalHelpers');
const getTemplates = async (slug) => {
  const notification_templates = await strapi.db
    .query('api::notification-template.notification-template')
    .findMany({
      where: { slug },
    });
  return _.map(notification_templates, (obj) =>
    _.pick(obj, ['title', 'body', 'type', 'role', 'status', 'locale'])
  );
};

async function sendPushToken(user, templates, renewalRequestId) {
  if (user.pushTokens)
    for (let i = 0; i < user.pushTokens.length; i++) {
      const { title, body, type } = templates.find(
        (template) => template.locale == user.pushTokens[i].locale
      );
      await strapi.service('api::push.push').publish({
        tokens: [user.pushTokens[i].token],
        payload: {
          notification: {
            title,
            body,
          },
          data: {
            type,
            link: process.env.VIRTUAL_HOST.replace('strapi', 'portal'),
            renewalRequestId: `${renewalRequestId}`,
          },
        },
      });
    }
}

async function createInAppNotification(slug, user, reqId) {
  const templates = await getTemplates(slug);
  const notifications: any = templates.map((template) => ({
    ...template,
    body: replaceWildcard(template.body, 'ID', reqId),
  }));
  if (user) {
    const translations = notifications.filter((n) => n.locale != 'ar-EG');
    const localizations = [];

    for (let i = 0; i < translations.length; i++) {
      const { id } = await strapi
        .service('api::notification.notification')
        .create({
          data: {
            ...notifications[i],
            ...(user.role.type == 'talent' && { user: user.id }),
            ...(user.role.type == 'drama_maker' && { drama_maker: user.id }),
            ...(reqId && { renewalRequestId: reqId }),
          },
        });

      localizations.push(id);
    }
    const mainEntry = await strapi
      .service('api::notification.notification')
      .create({
        data: {
          ...notifications.find((n) => n.locale == 'ar-EG'),
          ...(user.role.type == 'talent' && { user: user.id }),
          ...(user.role.type == 'drama_maker' && { drama_maker: user.id }),
          ...(reqId && { renewalRequestId: reqId }),
          localizations,
        },
        populate: ['localizations'],
      });

    await strapi
      .plugin('i18n')
      .service('localizations')
      .syncLocalizations(mainEntry, {
        model: strapi.getModel(
          'api::notification-template.notification-template'
        ),
      });
  }
}

module.exports = {
  getTemplates,
  sendPushToken,
  createInAppNotification,
};
