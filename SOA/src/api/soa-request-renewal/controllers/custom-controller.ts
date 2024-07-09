import utils from '@strapi/utils';
var axios = require('axios');
const { errors } = utils;
function generatePaymentOrderId(length, reqId) {
  const chars =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  return (
    reqId +
    '_' +
    Array.from(
      { length },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join('')
  );
}

export default {
  async initiateCheckout(ctx) {
    const {
      body: { requestId },
    } = ctx.request;
    const { user } = ctx.state;

    try {
      if (!user) throw 'Unauthorized';
      if (!requestId) throw 'Missing request id';
      const request = await strapi.db
        .query('api::soa-request-renewal.soa-request-renewal')
        .findOne({
          where: {
            id: requestId,
            user: user.id,
          },
        });
      if (!request) throw 'Request not exist';
      if (request.status != 'waitForPayment') throw 'Invalid Request';
      if (user.renewalRequestStatus != 'processing') throw 'Invalid Request';
      if (!request.renewalAmount) throw 'Missing renewal amount';

      const orderId = generatePaymentOrderId(6, requestId);
      var data = {
        apiOperation: 'INITIATE_CHECKOUT',
        interaction: {
          operation: 'PURCHASE',
          // ${baseUrl}/profile?content=myRequests&reqID=242
          returnUrl: `${process.env.PORTAL_DOMAIN}/profile?content=myRequests&reqID=${requestId}`,
          cancelUrl: `${process.env.PORTAL_DOMAIN}/profile?content=myRequests&reqID=${requestId}`,
          merchant: {
            name: 'Syndicate of artists',
            url: process.env.PORTAL_DOMAIN,
          },
          displayControl: {
            billingAddress: 'HIDE',
            customerEmail: 'HIDE',
          },
        },
        order: {
          id: orderId,
          amount: request.renewalAmount,
          currency: 'EGP',
          description: 'Syndicate of artists membership renewal fees',
        },
      };
      var config = {
        method: 'post',
        url: `https://banquemisr.gateway.mastercard.com/api/rest/version/75/merchant/${process.env.PAYMENT_MERCHANT_ID}/session`,
        headers: {
          ContentType: 'application/json',
          Authorization:
            'Basic ' +
            Buffer.from(
              `${process.env.PAYMENT_API_USERNAME}:${process.env.PAYMENT_API_PASSWORD}`
            ).toString('base64'),
        },
        data: data,
      };

      const response = await axios(config);
      await strapi.db
        .query('api::soa-request-renewal.soa-request-renewal')
        .update({
          where: {
            id: requestId,
            user: user.id,
          },
          data: {
            paymentCheckout: {
              checkoutSession: response.data.session.id,
              orderId,
              processing: true,
            },
          },
          options: { updatePayment: true },
        });
      return {
        url: `https://banquemisr.gateway.mastercard.com/checkout/pay/${response.data.session.id}?checkoutVersion=1.0.0`,
      };
    } catch (error) {
      console.log({ error: error });
      throw new errors.ApplicationError(error);
    }
  },

  async webhookNotification(ctx) {
    const { body, headers } = ctx.request;
    if (headers['x-notification-secret'] != process.env.PAYMENT_WEBHOOK_SECRET)
      throw 'Unauthorized';

    const {
      result,
      order: { status, id: orderId },
    } = body;

    const request = await strapi.db
      .query('api::soa-request-renewal.soa-request-renewal')
      .findOne({
        where: {
          id: orderId.split('_')[0],
        },
        populate: ['user'],
      });
    try {
      if (
        request.status == 'waitForPayment' &&
        request.paymentCheckout.processing &&
        status == 'CAPTURED' &&
        result == 'SUCCESS'
      ) {
        await strapi.db
          .query('api::soa-request-renewal.soa-request-renewal')
          .update({
            where: {
              id: request.id,
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
          where: { id: request.user.id },
          data: { renewalRequestStatus: 'done' },
        });
      }
      if (
        request.status == 'paid' &&
        status == 'CAPTURED' &&
        result == 'SUCCESS'
      ) {
        await strapi.db
          .query('api::soa-request-renewal.soa-request-renewal')
          .update({
            where: {
              id: request.id,
            },
            data: {
              paymentCheckout: {
                orderId,
                confirmed: true,
              },
            },
            options: { updatePayment: true },
          });
      }
    } catch (error) {
      console.log({ error });
    }

    return { success: true };
  },
};
