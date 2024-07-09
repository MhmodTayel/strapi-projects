'use strict';

module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/registers/processRegisters',
            handler: 'register.processRegisters'
        },
        {
            method: 'POST',
            path: '/registers/addTrialStudent',
            handler: 'register.addTrialStudent'
        },
        {
            method: 'POST',
            path: '/registers/removeTrialStudent',
            handler: 'register.removeTrialStudent'
        },
        {
            method: 'POST',
            path: '/registers/getNextLessonDate',
            handler: 'register.getNextLessonDate'
        },
        {
            method: 'PUT',
            path: '/registers/assignHomeworksToTeacher/:registerId/:teacherId',
            handler: 'register.assignHomeworksToTeacher'
        },
        {
            method: 'GET',
            path: '/registers/getHomework',
            handler: 'register.getHomework'
        },
        {
            method: 'POST',
            path: '/registers/updateLessonStatus',
            handler: 'register.updateLessonStatus'
        },
        {
            method: 'POST',
            path: '/registers/changeTeacher',
            handler: 'register.changeTeacher'
        },
        {
            method: 'POST',
            path: '/registers/updateClassStatus',
            handler: 'register.updateClassStatus'
        },
        {
            method: 'GET',
            path: '/registers/upcomingLessons',
            handler: 'register.upcomingLessons'
        }
    ]
};
