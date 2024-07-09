import {
  parse,
  extractAttributes,
  getIds,
  getIdsWithHash,
} from './../src/helpers/applicationHelpers';
import _ from 'lodash';

const {
  getTemplates,
  createInAppNotification,
} = require('../src/helpers/notificationHelpers');

export default {
  CheckNewTalents: {
    task: async ({ strapi }) => {
      const now = new Date();
      const firstHourDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0,
        0
      );
      const users = await strapi.query('api::profile.profile').findMany({
        where: {
          status: 'تم الموافقة',
          publishedAt: { $gte: firstHourDate },
          user: { member: { active: true, disabled: false }, blocked: false },
        },
      });
      if (users.length) {
        const templates = await getTemplates('new-talents');

        const { results: drama_makers } = await strapi
          .service('api::drama-maker.drama-maker')
          .find({ populate: ['pushTokens', 'role'] });
        for (let i = 0; i < drama_makers.length; i++) {
          await createInAppNotification('new-talents', drama_makers[i]);
        }

        for (let i = 0; i < templates.length; i++) {
          await strapi.service('api::push.push').publish({
            topic: `drama_maker_${templates[i].locale}`,
            payload: {
              notification: {
                ..._.pick(templates[i], ['title', 'body']),
              },
              data: { type: templates[i].type },
            },
          });
        }
      }
    },
    options: {
      rule: '59 23 * * *',
      tz: 'Africa/Cairo',
    },
  },
  // cleanMedia: {
  //   task: async ({ strapi }) => {
  //     const parsedData = await parse(strapi);
  //     const fields = extractAttributes(parsedData);
  //     const entitiesIds = [];
  //     for (let i = 0; i < fields.length; i++) {
  //       const populate = fields[i].populate;
  //       if (fields[i].componentName) {
  //         const elemets = populate.map(
  //           (ele) => `${fields[i].componentName}.${ele}`
  //         );
  //         populate.push(...elemets);
  //       }

  //       const media = await strapi.query(fields[i].uid).findMany({
  //         populate,
  //       });

  //       media.forEach((ele) => entitiesIds.push(...getIds(ele)));
  //       // console.log(JSON.stringify({ media }));
  //       entitiesIds.push(...getIdsWithHash(media));
  //     }

  //     const attachedFilesIds = [...new Set(entitiesIds)];

  //     const files = await strapi.service('plugin::upload.upload').findMany();

  //     const filesIds = files.map((ele) => ele.id);

  //     const differenceIds = _.difference(filesIds, attachedFilesIds);

  //     // for (let i = 0; i < differenceIds.length; i++) {
  //     //   await strapi
  //     //     .service('plugin::upload.upload')
  //     //     .remove(files.find((ele) => ele.id == differenceIds[i]));
  //     // }

  //     // console.log({ differenceIds });
  //   },
  //   options: {
  //     rule: '* * * * *',
  //   },
  // },
  cleanBlackListedTokens: {
    task: async ({ strapi }) => {
      const now = new Date();
      const oneMonthAgo = now.setMonth(now.getMonth() - 1);
      await strapi.db
        .query('api::black-listed-token.black-listed-token')
        .deleteMany({
          where: {
            createdAt: { $lte: oneMonthAgo },
          },
        });
    },
    options: {
      rule: '0 0 * * *',
      tz: 'Africa/Cairo',
    },
  },
  deactivateUsersAndCancelOpenRequests: {
    task: async ({ strapi }) => {
      await strapi.db.query('plugin::users-permissions.user').updateMany({
        data: { renewalRequestStatus: 'none' },
      });
      await strapi.db
        .query('api::syndicate-member.syndicate-member')
        .updateMany({
          data: { active: false, renewalRequestStatus: 'none' },
          options: { ignoreLifecycle: true },
        });
      await strapi.db
        .query('api::soa-request-renewal.soa-request-renewal')
        .updateMany({
          where: { status: { $notIn: ['picked', 'cancelled'] } },
          data: { status: 'cancelled' },
          options: { ignoreLifecycle: true },
        });
      await strapi.db
        .query('api::unique-renewal-request.unique-renewal-request')
        .deleteMany({});
    },
    options: {
      rule: '0 0 15 12 *',
      tz: 'Africa/Cairo',
    },
  },
};
