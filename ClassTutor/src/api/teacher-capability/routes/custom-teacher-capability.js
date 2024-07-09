'use strict';

module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/teacher-capabilities/forTeacher/:id',
            handler: 'teacher-capability.getForTeacher'
        },
        {
            method: 'PUT',
            path: '/teacher-capabilities/forTeacher/:id',
            handler: 'teacher-capability.updateForTeacher'
        }
    ]
}