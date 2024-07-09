export default {
  routes: [
    {
      method: 'POST',
      path: '/notifications/read/:id',
      handler: 'custom-controller.readNotification',
    },
  ],
};
