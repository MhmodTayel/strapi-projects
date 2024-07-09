import utils from '@strapi/utils';
const { errors } = utils;
export default {
  async readNotification(ctx, next) {
    const {
      header: { authorization },
      params: { id },
    } = ctx.request;

    const token = authorization.split(' ')[1];

    if (!token) {
      throw new errors.ApplicationError('UNAUTHORIZED', {
        errors: [
          {
            message: 'unauthorized',
            name: 'ValidationError',
          },
        ],
      });
    }
    const userId = ctx.state.user.id;
    const role = ctx.state.user.role.type;
    try {
      const notification = await strapi.db
        .query('api::notification.notification')
        .findOne({
          where: {
            id,
            ...(role == 'talent' && { user: userId }),
            ...(role == 'drama_maker' && { drama_maker: userId }),
          },
          populate: ['localizations'],
        });

      const notificationIds = [notification.id];

      notificationIds.push(...notification.localizations?.map((n) => n.id));

      let read = [];
      for (let i = 0; i < notificationIds.length; i++) {
        read.push(
          await strapi.db.query('api::notification.notification').update({
            where: {
              id: notificationIds[i],
              ...(role == 'talent' && { user: userId }),
              ...(role == 'drama_maker' && { drama_maker: userId }),
            },
            data: {
              status: 'read',
            },
          })
        );
      }

      return { success: true, read };
    } catch (error) {
      throw new errors.UnauthorizedError();
    }
  },
};
