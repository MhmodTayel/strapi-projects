'use strict';

module.exports = {
    routes: [
        {
            method: 'PUT',
            path: '/register-students/bulk',
            handler: 'register-student.bulkUpdate'
        }
    ]
}