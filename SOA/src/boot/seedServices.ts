const services = require('../helpers/dynamicServiceHelpers/seed');

const UID = 'api::dynamic-service.dynamic-service';

export default async (strapi) => {
  await strapi.db.query(UID).deleteMany();
  await Promise.all(
    services.map(async (service) => {
      await strapi.db.entityManager.create(UID, {
        data: service,
      });
    })
  );
};
