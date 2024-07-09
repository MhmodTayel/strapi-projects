/**
 * authority-board controller
 */

import { factories } from '@strapi/strapi';
function sortDataAlphabetically(data) {
  data.sort((a, b) => {
    const titleA = a.attributes.Title.toLowerCase();
    const titleB = b.attributes.Title.toLowerCase();

    if (titleA < titleB) {
      return -1;
    }

    if (titleA > titleB) {
      return 1;
    }

    return 0;
  });

  return data;
}

export default factories.createCoreController('api::authority-board.authority-board', ({ strapi }) => ({
  async find(ctx) {
    const res = await super.find(ctx);
    const data = sortDataAlphabetically(res.data);
    res.data = data;
    return res;
  },
}));
