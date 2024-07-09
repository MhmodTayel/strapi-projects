export default {
  routes: [
    {
      method: 'POST',
      path: '/push/subscriptions',
      handler: 'push.getSubscriptions',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/push/subscribe',
      handler: 'push.subscribe',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/push/unsubscribe',
      handler: 'push.unsubscribe',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
