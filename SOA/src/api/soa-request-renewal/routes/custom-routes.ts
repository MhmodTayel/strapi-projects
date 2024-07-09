export default {
  routes: [
    {
      method: 'POST',
      path: '/soa-request-renewal/initiateCheckout',
      handler: 'custom-controller.initiateCheckout',
    },
    {
      method: 'POST',
      path: '/soa-request-renewal/webhookNotification',
      handler: 'custom-controller.webhookNotification',
    },
  ],
};
