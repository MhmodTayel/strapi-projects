/**
 * soa-request-renewal controller
 */

import { factories } from '@strapi/strapi';
import utils from '@strapi/utils';
var axios = require('axios');
const { errors } = utils;
export default factories.createCoreController(
  'api::soa-request-renewal.soa-request-renewal',
  ({ strapi }) => ({
    async findOne(ctx) {
      Array.isArray(ctx.request.query.populate)
        ? ctx.request.query.populate.push('user')
        : (ctx.request.query.populate = 'user');
      // Calling the default core action
      let request = await super.findOne(ctx);
      const { user } = ctx.state;
      if (request.data.attributes.user.data.id != user.id)
        throw new errors.UnauthorizedError('unauthorized');
      if (request)
        try {
          const { status, paymentCheckout } = request.data.attributes;
          if (status == 'waitForPayment' && paymentCheckout?.orderId) {
            const orderId = paymentCheckout.orderId;
            var config = {
              method: 'get',
              url: `https://banquemisr.gateway.mastercard.com/api/rest/version/75/merchant/${process.env.PAYMENT_MERCHANT_ID}/order/${orderId}`,
              headers: {
                ContentType: 'application/json',
                Authorization:
                  'Basic ' +
                  Buffer.from(
                    `merchant.${process.env.PAYMENT_MERCHANT_ID}:${process.env.PAYMENT_API_PASSWORD}`
                  ).toString('base64'),
              },
            };

            const { data } = await axios(config);
            if (
              request.data.attributes.renewalAmount ==
                data.totalCapturedAmount &&
              data.status == 'CAPTURED' &&
              data.result == 'SUCCESS'
            ) {
              request = await strapi.db
                .query('api::soa-request-renewal.soa-request-renewal')
                .update({
                  where: {
                    id: request.data.id,
                    user: user.id,
                  },
                  data: {
                    paymentCheckout: {
                      orderId,
                    },
                    status: 'paid',
                  },
                  options: { updatePayment: true },
                });
              await strapi.db.query('plugin::users-permissions.user').update({
                where: { id: ctx.state.user.id },
                data: { renewalRequestStatus: 'done' },
              });
              await strapi.db
                .query('api::syndicate-member.syndicate-member')
                .update({
                  where: { user: ctx.state.user.id },
                  data: { active: true },
                });
            }
          }
          return await super.findOne(ctx);
        } catch (error) {
          console.log({ error });
          return await super.findOne(ctx);
        }
    },
  })
);
