'use strict';

module.exports = {
    routes: [
        {
            method: 'PUT',
            path: '/homeworks/assignToTeacher/:homeworkId/:teacherId',
            handler: 'homework.assignToTeacher'
        },
        {
            method: 'GET',
            path: '/homeworks/get',
            handler: 'homework.get'
        }
    ]
}