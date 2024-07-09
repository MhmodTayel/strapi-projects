const fs = require('fs');
let files = fs
  .readdirSync(__dirname)
  .filter((file) => file.includes('plugin_content_manager_configuration'));
files.forEach((file) => {
  const data = JSON.parse(
    fs.readFileSync(`${__dirname}/${file}`, { encoding: 'utf-8' })
  );
  const metadatas = data.value.metadatas;
  Object.keys(metadatas).forEach((key) => {
    console.log(metadatas[key].list.label);
    if (key == 'id') metadatas[key].list.label = 'تسلسل';
    if (metadatas[key].edit?.label)
      metadatas[key].list.label = metadatas[key].edit.label;
    if (key == 'createdAt') metadatas[key].list.label = 'تاريخ الانشاء';
    if (key == 'updatedAt') metadatas[key].list.label = 'تاريخ التعديل';

    console.log(metadatas[key].list);
  });
  fs.writeFileSync(`${__dirname}/${file}`, JSON.stringify(data), { encoding: 'utf-8' });
});
