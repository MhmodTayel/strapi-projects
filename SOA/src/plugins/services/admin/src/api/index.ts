import { request } from '@strapi/helper-plugin';

const api = {
  getAllRequestsByServiceSlug: (serviceSlug: string, params?: string) =>
    request(`/services/requestsByServiceSlug?${params}`, {
      method: 'GET',
    }),

  getAllServices: async () =>
    await request('/services/dynamicServices', { method: 'GET' }),

  getServiceBySlug: (serviceSlug: string) =>
    request(
      `/services/dynamicServiceBySlug?filters[slug][$eq]=${serviceSlug}`,
      {
        method: 'GET',
      }
    ),

  getRequestByServiceSlugAndId: (serviceSlug: string, requestId: string) =>
    request(
      `/services/getRequestByServiceSlugAndId/${serviceSlug}/${requestId}`,
      {
        method: 'GET',
      }
    ),
  getUserById: (userId: string) =>
    request(
      `/content-manager/collection-types/plugin::users-permissions.user/${userId}`,
      { method: 'GET' }
    ),
  updateRequestStatusById: (
    serviceSlug: string,
    requestId: string,
    data: any
  ) =>
    request(`/services/updateRequest/${serviceSlug}/${requestId}`, {
      method: 'PUT',
      body: data,
    }),
  getMember: (query: string) =>
    request(
      `/content-manager/collection-types/api::syndicate-member.syndicate-member/?${query}`,
      {
        method: 'GET',
      }
    ),
  createRequest: (serviceSlug: string, data: any) =>
    request(`/services/createRequest/${serviceSlug}`, {
      method: 'POST',
      body: data,
    }),
};

export default api;
