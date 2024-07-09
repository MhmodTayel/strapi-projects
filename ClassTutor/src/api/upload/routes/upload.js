module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/upload',
            handler: 'upload.customUpload',
            config: {
                policies: [],
                middlewares: []
            }
        }
    ]
};
