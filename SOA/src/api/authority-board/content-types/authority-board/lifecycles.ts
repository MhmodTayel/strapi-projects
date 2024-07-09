import utils from '@strapi/utils';
const { errors } = utils;
const {
  requestStatus,
  checkRequestStatus,
} = require('../../../../helpers/generalHelpers');

const checkValidation = async ({ action, params: { data, where } }) => {
  const oldData = await strapi.db
    .query('api::authority-board.authority-board')
    .findOne({
      where,
      populate: ['boardDate', 'restBoardMembers'],
    });

  const existingAboutUs = await strapi.db
    .query('api::about-us.about-us')
    .findOne({
      where: {
        locale: oldData.locale,
      },
    });
  if (
    existingAboutUs &&
    oldData.publishedAt &&
    (action === 'beforeDelete' || data.hasOwnProperty('publishedAt'))
  ) {
    const existingAnother = await strapi.db
      .query('api::authority-board.authority-board')
      .findOne({
        where: {
          id: { $ne: oldData.id },
          publishedAt: { $ne: null },
          locale: oldData.locale,
        },
      });
    if (!existingAnother) {
      throw new errors.ValidationError(
        'authority boards must have at least one published board',
        {
          errors: [
            {
              path: [''],
              message:
                'authority boards must have at least one published board',
              name: 'ValidationError',
            },
          ],
        }
      );
    }
  }
};
export default {
  async beforeUpdate(event) {
    const { data, where } = event.params;
    const ctx = strapi.requestContext.get();
    const oldData = await strapi.db
      .query('api::authority-board.authority-board')
      .findOne({
        where,
        populate: ['boardDate', 'restBoardMembers'],
      });

    const reqState = checkRequestStatus(data, oldData);
    if (reqState === requestStatus.DRAFT) return;
    let currentData = requestStatus.PUBLISH ? oldData : ctx.request.body;

    if (
      ctx.request.body.restBoardMembers?.length > 12 ||
      currentData.restBoardMembers.length > 12
    ) {
      throw new errors.ValidationError('Rest_Board_Members_SKIP_12_MEMBERS', {
        errors: [
          {
            path: ['restBoardMembers'],
            message: 'rest board members must be less than 12 members',
            name: 'ValidationError',
          },
        ],
      });
    }

    await checkValidation(event);
  },

  async afterUpdate(event) {
    await strapi.service('api::about-us.about-us').updateAboutUsBoards(event);
  },
  async beforeDelete(event) {
    await checkValidation(event);
  },
  async afterDelete(event) {
    await strapi.service('api::about-us.about-us').updateAboutUsBoards(event);
  },
};
