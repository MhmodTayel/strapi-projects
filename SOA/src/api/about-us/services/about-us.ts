import utils from '@strapi/utils';
const { errors } = utils;
import { factories } from '@strapi/strapi';

function sortDates(data) {
  const filteredData = data.filter((obj) => obj.date !== null);
  filteredData.sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return filteredData;
}

async function mapData(arr) {
  const dates = arr.map((obj) => ({
    id: obj.id,
    date: obj.boardDate.to,
  }));
  const data = sortDates(dates);

  let largestDateId = null;
  let largestDate = null;

  data.forEach((obj) => {
    if (obj.date !== null && (largestDate === null || obj.date > largestDate)) {
      largestDate = obj.date;
      largestDateId = obj.id;
    }
  });

  const ids = {
    presentBoardId: largestDateId,
    otherBoardsIds: data
      .filter((ele) => ele.id != largestDateId)
      .map((ele) => ele.id),
  };
  const drafted = await strapi.db
    .query('api::authority-board.authority-board')
    .findMany({
      where: { publishedAt: { $eq: null } },
    });
  const mappedData = {
    present_authority_board: {
      connect: [{ id: ids.presentBoardId }],
      disconnect: [],
    },
    other_authority_boards: {
      connect: ids.otherBoardsIds.map((id) => ({ id: id })),
      disconnect: [{ id: ids.presentBoardId }, ...drafted],
    },
  };

  return mappedData;
}
export default factories.createCoreService(
  'api::about-us.about-us',
  ({ strapi }) => ({
    async updateAboutUsBoards(event) {
      if (
        event.action === 'beforeCreate' &&
        event.model.uid === 'api::about-us.about-us'
      ) {
        const { data } = event.params;

        const authorityBoards = await strapi.db
          .query('api::authority-board.authority-board')
          .findMany({
            where: {
              publishedAt: { $ne: null },
              locale: data.locale,
            },
            populate: ['boardDate'],
          });

        if (!authorityBoards.length) {
          throw new errors.ApplicationError('there is no authority boards');
        }
        const mappedData = await mapData(authorityBoards);

        data.present_authority_board = mappedData.present_authority_board;
        data.other_authority_boards = mappedData.other_authority_boards;
      }
      if (
        (event.action === 'afterUpdate' || event.action === 'afterDelete') &&
        event.model.uid === 'api::authority-board.authority-board'
      ) {
        const { locale } = event.result;

        const aboutUs = await strapi.db
          .query('api::about-us.about-us')
          .findOne({
            where: { locale },
            populate: ['present_authority_board', 'other_authority_boards'],
          });

        if (!aboutUs) return;

        const authorityBoards = await strapi.db
          .query('api::authority-board.authority-board')
          .findMany({
            where: { publishedAt: { $ne: null }, locale },
            populate: ['boardDate'],
          });
        const mappedData = await mapData(authorityBoards);

        await strapi.db.query('api::about-us.about-us').update({
          where: { id: aboutUs.id },
          data: {
            present_authority_board: mappedData.present_authority_board,
            other_authority_boards: mappedData.other_authority_boards,
          },
        });
      }
    },
  })
);
