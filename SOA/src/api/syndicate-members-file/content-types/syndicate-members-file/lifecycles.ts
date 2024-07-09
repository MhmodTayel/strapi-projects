const https = require('https');
const fs = require('fs');
const xlsx = require('xlsx');

export default {
  async afterUpdate(event) {
    const { where } = event.params;
    const oldData = await strapi.db
      .query('api::syndicate-members-file.syndicate-members-file')
      .findOne({
        where,
        populate: ['file'],
      });
    const file = fs.createWriteStream('file.xlsx');
    https
      .get(oldData.file.url, (response) => {
        response.pipe(file);
      })
      .on('error', (error) => {
        console.error(`Error making request: ${error}`);
      });

    file.on('finish', async () => {
      console.log('File copied successfully');
      const workbook = xlsx.readFile('./file.xlsx');
      const data = [];
      for (let i = 0; i < workbook.SheetNames.length; i++) {
        const sheetName = workbook.SheetNames[i];
        const worksheet = workbook.Sheets[sheetName];
        const sheetData = xlsx.utils.sheet_to_json(worksheet);
        data.push(
          ...sheetData.map((u) => ({
            mobile: u['الموبيل'],
            syndicateID: +u['رقم العضوية'],
            name: u['الشهره'],
            division: u['الشعبه'],
            active: false,
            disabled: false,
          }))
        );
      }
      await strapi.db
        .query('api::syndicate-member.syndicate-member')
        .deleteMany({});
      await strapi.db
        .query('api::syndicate-member.syndicate-member')
        .createMany({
          data,
        });
    });
  },
};
