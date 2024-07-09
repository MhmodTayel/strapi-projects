export default {
  routes: [
    {
      method: 'POST',
      path: '/misc/dynamicLink',
      handler: 'custom-controller.createDynamicLink',
    },
  ],
};
