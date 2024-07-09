'use strict';

module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/notices/getForUser/:forType/:id',
            handler: 'notice.getForUser'
        }
    ]
}