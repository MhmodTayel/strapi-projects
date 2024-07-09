## How to run it?

- Install docker ( [Windows](https://docs.docker.com/desktop/install/windows-install/) / [Linux](https://docs.docker.com/desktop/install/linux-install/) / [Mac](https://docs.docker.com/desktop/install/mac-install/))
- In the project root path create `.env`
- Add our development env variables. those attached below also you may change the values based on your purposes.
- In the project root path run this command `docker-compose up -d`.
- Open `http://localhost:1337/admin` in browser.
- Enjoy 💻.

## Issues you may have?

### Docker backend service may fail with some errors about missing tables

- Delete the files in this path `database\migrations`
- Restart docker backend service. and after finish.
- Restore them. 

### Custom Upload Functionality

This repository contains a custom Strapi controller that overrides the default upload behavior,<br/> allowing the creation of folders in the media library and uploading files to AWS S3.<br/>
The controller is designed to work with an AWS S3 storage provider. This custom upload controller is located at `./api/upload/controllers/upload.js`.

 (note):  we use [patch package](https://www.npmjs.com/package/patch-package) to apply some changes to @strapi/plugin-upload package in order to set the path of files 

to create patch files run this command 
  `npx patch-package <package name>`

Ex: `npx patch-package @strapi/plugin-upload`

### Usage
Make a POST request to `api/upload` with folder path, file metadata, and files.

```
var axios = require('axios');
var FormData = require('form-data');
var fs = require('fs');
var data = new FormData();
data.append('files', fs.createReadStream('path/to/file'));
data.append('path', 's3/class/test');

var config = {
  method: 'post',
  url: 'http://STRAPI_ENDPOINT/api/upload',
  headers: { 
    ...data.getHeaders()
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});

```

## Environment variables 

```env

NODE_ENV=development
APP_KEYS=jP8pb1lYsAhnmURarewxhA==,34xnLMYHY5jiU7ONTstTqQ==
# host
HOST=0.0.0.0
PORT=1337
# JWT
JWT_SECRET=66dc78b8-c956-4d8b-bff8-035f88bc1521
REFRESH_SECRET=9e38c4a0-562a-4cba-b034-2b36e6ff6a63
REFRESH_TOKEN_EXPIRES=90d
JWT_SECRET_EXPIRES=360s
# database
DATABASE_HOST=db
DATABASE_PORT=5432
DATABASE_NAME=strapi_dev
DATABASE_SCHEMA=public
DATABASE_PASSWORD=classtutor
DATABASE_USERNAME=root

```

 If you want to use AWS S3 for storage, add the following AWS S3 configuration to the .env file. Adjust the values based on your AWS account.


 ##### AWS S3
 ```env
AWS_ACCESS_KEY_ID=AWS_ACCESS_KEY_ID
AWS_ACCESS_SECRET=AWS_ACCESS_SECRET
AWS_REGION=AWS_REGION
AWS_BUCKET=AWS_BUCKET

```