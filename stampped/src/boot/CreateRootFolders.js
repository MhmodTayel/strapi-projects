const folders = ['customer-docs', 'website-files'];

module.exports = async (strapi) => {
  for (const folderName of folders) {
    await createFolder(folderName);
  }
};

async function createFolder(folderName, parentFolderId) {
  const folder = {
    name: folderName,
  };
  if (parentFolderId) {
    folder['parent'] = parentFolderId;
  }

  const existingFolder = await strapi.query('plugin::upload.folder').findOne({
    where: folder,
  });

  const folderData = existingFolder
    ? existingFolder
    : await strapi.plugins.upload.services.folder.create(folder);

  return folderData;
}
