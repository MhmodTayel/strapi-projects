/**
 * otp router
 */
export default {
  routes: [
    {
      // Path defined with a URL parameter
      method: 'POST',
      path: '/otp/verify',
      handler: 'otp.verify',
      config: {
        middlewares: ['plugin::users-permissions.rateLimit'],
        prefix: '',
      },
    },
    {
      method: 'POST',
      path: '/otp/resend',
      handler: 'otp.resend',
      config: {
        middlewares: ['plugin::users-permissions.rateLimit'],
        prefix: '',
      },
    },
  ],
};
