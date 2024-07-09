
export default async({ strapi }) => {
  // bootstrap phase
  const RBAC_ACTIONS = [
    {
      section: 'plugins',
      displayName: 'create',
      uid: 'services.create',
      pluginName: 'services',
    },
    {
      section: 'plugins',
      displayName: 'read',
      uid: 'services.read',
      pluginName: 'services',
    },
    {
      section: 'plugins',
      displayName: 'update',
      uid: 'services.update',
      pluginName: 'services',
    },
    {
      section: 'plugins',
      displayName: 'delete',
      uid: 'services.delete',
      pluginName: 'services',
    },
  ];
  //@ts-ignore
  await strapi.admin.services.permission.actionProvider.registerMany(
    RBAC_ACTIONS
  );

  const pluginStore = strapi.store({
    environment: '',
    type: 'plugin',
    name: 'services',
  });
};

