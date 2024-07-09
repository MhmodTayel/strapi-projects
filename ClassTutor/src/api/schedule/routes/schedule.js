module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/schedule/teacher/:teacherId',
            handler: 'schedule.getForTeacher'
        },
        {
            method: 'GET',
            path: '/schedule/student/:studentId',
            handler: 'schedule.getForStudent'
        },
        {
            method: 'GET',
            path: '/schedule/parent/:parentId',
            handler: 'schedule.getForParent'
        }
    ]
};
