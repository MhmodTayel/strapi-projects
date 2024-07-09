import utils from '@strapi/utils';
import axios from 'axios';
const { errors } = utils;
export default {
  async createDynamicLink(ctx) {
    const {
      body: { link },
    } = ctx.request;

    try {
      const { data } = await axios.post(
        `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${process.env.FIREBASE_SHORT_LINK_KEY}`,

        {
          dynamicLinkInfo: {
            domainUriPrefix: 'https://soa.page.link',

            link,

            androidInfo: {
              androidPackageName: process.env.ANDROID_PACKAGE_NAME,
            },

            iosInfo: {
              iosBundleId: process.env.IOS_BUNDLE_ID,
            },
          },
        }
      );

      return data;
    } catch (error) {
      throw new errors.ApplicationError(error);
    }
  },
};
