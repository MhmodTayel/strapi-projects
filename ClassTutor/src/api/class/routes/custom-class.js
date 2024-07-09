'use strict';

module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/classes/getSummary/:classId',
            handler: 'class.getSummary'
        }
    ]
}