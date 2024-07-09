import utils from '@strapi/utils';
const { errors } = utils;
const { addLink } = require('../../../../helpers/generalHelpers');

async function isValidDateRange(event) {
  const { dateOfBirth, dateOfDeath } = event.params.data;

  // const now = new Date();
  // const dob = new Date(dateOfBirth);
  // const dod = new Date(dateOfDeath);
  // if (dob > now) {
  //   throw new errors.ValidationError('Date of birth cannot be in the future');
  // }

  // if (dod > now) {
  //   throw new errors.ValidationError('Date of death cannot be in the future');
  // }

  // if (dateOfDeath && dod < dob) {
  //   throw new errors.ValidationError(
  //     'Date of death cannot be before date of birth'
  //   );
  // }
}

export default {
  async beforeCreate(event) {
    await isValidDateRange(event);
    addLink(event);
  },
  async beforeUpdate(event) {
    await isValidDateRange(event);
    addLink(event);
  },
};
