const { addLink } = require('../../../../helpers/generalHelpers');
export default {
  async beforeCreate(event) {
    addLink(event);
  },
  async beforeUpdate(event) {
    addLink(event);
  },
};
