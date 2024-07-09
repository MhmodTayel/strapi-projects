import utils from '@strapi/utils';
const { errors } = utils;
export default {
  async userPreferences(ctx) {
    try {
      const UID = 'api::push-token.push-token';
      const {
        role: { type },
        id,
      } = ctx.state.user;

      const { pushToken, locale } = ctx.request.body;

      const locales = await strapi.plugin('i18n').service('locales').find();

      if (!locales.map((locale) => locale.code).includes(locale)) {
        throw 'Invalid Locale';
      }

      const existingPushToken = await strapi.db.query(UID).findOne({
        where: {
          token: pushToken,
        },
        populate: ['talent', 'dramaMaker'],
      });

      if (existingPushToken?.dramaMaker?.id) {
        await strapi
          .service('api::push.push')
          .unsubscribe(pushToken, [`drama_maker_${existingPushToken.locale}`]);
      }

      let token
      if (existingPushToken) {
         token = await strapi.db.query(UID).update({
          where: {
            id: existingPushToken.id,
          },
          data: {
            locale,
          },
        });
        if (existingPushToken?.dramaMaker?.id) {
          await strapi
            .service('api::push.push')
            .subscribe(pushToken, [`drama_maker_${locale}`]);
        }
      } else {
        const data: {
          locale: string;
          token: string;
          talent?: number;
          dramaMaker?: number;
        } = { token: pushToken, locale };
        if (type == 'talent') data.talent = id;
        else if (type == 'drama_maker') {
          data.dramaMaker = id;
          await strapi
            .service('api::push.push')
            .subscribe(pushToken, [`drama_maker_${locale}`]);
        } else throw 'unauthorized user';

        token = await strapi.service(UID).create({
          data,
        });
      }
      return { success: true, token };
    } catch (error) {
      throw new errors.ApplicationError(error.message || error);
    }
  },
};
