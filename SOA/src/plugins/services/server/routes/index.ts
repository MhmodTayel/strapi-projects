export default [
  {
    method: 'GET',
    path: '/dynamicServices',
    handler: 'api::dynamic-service.dynamic-service.find',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
  },

  {
    method: 'GET',
    path: '/dynamicServiceBySlug',
    handler: 'api::dynamic-service.dynamic-service.find',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
  },

  {
    method: 'GET',
    path: '/requestsByServiceSlug',
    handler: `api::soa-request-renewal.soa-request-renewal.find`,
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
  },

  {
    method: 'GET',
    path: '/getRequestByServiceSlugAndId/:slug/:id',
    handler: 'dynamicServiceController.getRequestByServiceSlugAndId',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
  },

  {
    method: 'PUT',
    path: '/updateRequest/:slug/:id',
    handler: 'dynamicServiceController.updateRequest',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
  },

  {
    method: 'POST',
    path: '/createRequest/:serviceSlug',
    handler: 'dynamicServiceController.createRequest',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
  },
];
