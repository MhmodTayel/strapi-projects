import utils from '@strapi/utils';
const { validateYupSchemaSync, yup } = utils;

const getSubscriptionsSchema = yup
  .object()
  .shape({
    token: yup.string().required(),
  })
  .required();

const subscribeSchema = yup
  .object()
  .shape({
    token: yup.string().required(),
    topics: yup.array().of(yup.string()).required(),
  })
  .required();

export default {
  getSubscriptions: async (ctx) => {
    validateYupSchemaSync(getSubscriptionsSchema)(ctx.request.body);
    try {
      const { token } = ctx.request.body;
      const topics = await strapi
        .service('api::push.push')
        .getSubscriptions(token);
      ctx.body = topics;
    } catch (err) {
      strapi.log.error(err);
      ctx.badRequest('Error while getting token subscriptions');
    }
  },
  subscribe: async (ctx) => {
    validateYupSchemaSync(subscribeSchema)(ctx.request.body);
    try {
      const { token, topics } = ctx.request.body;
      await strapi.service('api::push.push').subscribe(token, topics);
      ctx.body = 'ok';
    } catch (err) {
      strapi.log.error(err);
      ctx.badRequest('Error while subscribing to topics');
    }
  },
  unsubscribe: async (ctx) => {
    validateYupSchemaSync(subscribeSchema)(ctx.request.body);
    try {
      const { token, topics } = ctx.request.body;
      await strapi.service('api::push.push').unsubscribe(token, topics);
      ctx.body = 'ok';
    } catch (err) {
      strapi.log.error(err);
      ctx.badRequest('Error while unsubscribing from a topics');
    }
  },
};
