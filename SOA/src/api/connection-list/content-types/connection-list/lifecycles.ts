import utils from '@strapi/utils';
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const advanced = require('dayjs/plugin/advancedFormat');
const { errors } = utils;
dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.extend(advanced);
const {
  getTemplates,
  sendPushToken,
  createInAppNotification,
} = require('../../../../helpers/notificationHelpers');
export default {
  async beforeCreate(event) {
    const ctx = strapi.requestContext.get();
    const {
      request: {
        body: { data },
      },
      state: { user },
    } = ctx;
    const talent = await strapi.db
      .query('plugin::users-permissions.user')
      .findOne({
        where: { username: data.talentName },
      });
    if (!talent) throw new errors.ValidationError('invalid request');
    event.params.data.dramaMakerName = user.username;
    event.params.data.talentName = talent.arabicName;
    event.params.data.talentInfo = talent.id;
    event.params.data.connectionDate = dayjs().format('YYYY-MM-DD');
    event.params.data.connectionTime = dayjs()
      .tz('Africa/Cairo')
      .format('HH:mm:ss.SSS');
  },
  async afterCreate(event) {
    const data = event.params.data;
    const talent = await strapi.db
      .query('plugin::users-permissions.user')
      .findOne({
        where: { id: data.talentInfo },
        populate: ['pushTokens', 'role'],
      });
    if (talent) {
      strapi.service('api::notification.notification').sendSMS({
        to: talent.phone,
        text: 'تم البحث عنك من قبل صانع عمل',
      });
      const templates = await getTemplates('info');

      await createInAppNotification('info', talent);
      await sendPushToken(talent, templates);
    }
  },
};
