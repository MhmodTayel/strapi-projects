const auth = require('@strapi/admin/server/services/auth');
import { getService } from '@strapi/plugin-users-permissions/server/utils';
import _ from 'lodash';
const { generateRandPassword } = require('../../../../helpers/generalHelpers');
export default {
  async beforeCreate(event) {
    event.params.data.role = 4;
    event.params.data.confirmed = false;
    const password = generateRandPassword(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_])[A-Za-z\d@$!%*?&#_]{8,10}$/
    );
    event.params.data.password = await auth.hashPassword(password);
    event.params.data.mailedPassword = password;
  },

  afterCreate: async (event) => {
    const { username, mailedPassword, email } = event.params.data;
    const resetPasswordToken = getService('jwt').issue({
      id: event.result.id,
      role: 'drama_maker',
    });
    await strapi.db.query('api::drama-maker.drama-maker').update({
      where: { id: event.result.id },
      data: { resetPasswordToken },
    });
    const emailData = {
      username,
      password: mailedPassword,
      role: 'صانع عمل',
    };
    strapi
      .service('api::notification.notification')
      .sendCredentials(email, emailData);
  },
};
