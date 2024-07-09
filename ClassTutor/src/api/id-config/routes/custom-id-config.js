'use strict';

module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/id-config/getNewId/:forType',
            handler: 'id-config.getNewId',
        },
        {
            method: 'GET',
            path: '/id-config/peekNewId/:forType',
            handler: 'id-config.peekNewId',
        }
    ]
}