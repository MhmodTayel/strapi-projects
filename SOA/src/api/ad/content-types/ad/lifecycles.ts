import utils from '@strapi/utils';
const { errors } = utils;
const { checkRequestStatus } = require('../../../../helpers/generalHelpers');

export default {
  async beforeUpdate(event) {
    const { data, where } = event.params;
    const allAds = await strapi.db
      .query('api::ad.ad')
      .findMany({ populate: ['Source'] });
    const currentAd = allAds.find((adData) => adData.id === where.id);
    const restAds = allAds.filter((adData) => adData.id !== where.id);

    const reservedPlacement = restAds.some(
      (ad) =>
        currentAd.Placement == ad.Placement || data.Placement == ad.Placement
    );

    const status = checkRequestStatus(data, currentAd);
    if (status == 'update') data.publishedAt = null;

    if (data.publishedAt || (!data.publishedAt && currentAd.publishedAt)) {
      if (reservedPlacement) {
        throw new errors.ApplicationError(
          'There is another ad with same placement published.'
        );
      }
    }
  },
};
