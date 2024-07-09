import utils from '@strapi/utils';
const { errors } = utils;
const { addLink } = require('../../../../helpers/generalHelpers');
export default {
  async beforeCreate(event) {
    addLink(event);
  },
  async beforeUpdate(event) {
    addLink(event);
    const { where, data } = event.params;
    if (data.Parent?.connect[0]?.id) {
      if (where.id === data.Parent?.connect[0]?.id) {
        throw new errors.ApplicationError(
          "Category can't be a parent to itself"
        );
      }
      const parent = await strapi.db.query('api::category.category').findOne({
        where: { id: data.Parent?.connect[0]?.id },
        populate: ['Parent'],
      });

      if (parent.Parent?.id === where.id) {
        throw new errors.ApplicationError(
          "Category can't be a parent to to it's parent"
        );
      }
    }
  },
};
