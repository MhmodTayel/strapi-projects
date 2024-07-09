const { toDayOfWeek, parseDate, toStrapiFormat, getTodayDate } = require('../../../../utils/datetime-utils');
var _ = require('lodash');

const getClassesForSales = async (studentId, classType, subjectId, yearId, classId) => {
    var classes = await strapi.entityService.findMany('api::class.class', {
        filters: {
            subject: subjectId,
            year: yearId,
            status: 'active',
            type: classType || 'group'
        },
        populate: {
            teacher: {
                populate: {
                    photo: true
                }
            }
        }
    });

    var classIds = [];

    const studentClassesFilters = {};
    if (studentId) {
        studentClassesFilters.student = studentId;
    }

    if (classId) {
        studentClassesFilters.class = classId;
    }

    var studentClasses = await strapi.entityService.findMany('api::student-class.student-class', {
        filters: studentClassesFilters,
        populate: {
            class: true
        }
    });

    for (let index = 0; index < classes.length; index++) {
        const _class = classes[index];
        classIds.push(_class.id);
    }

    var todayDate = getTodayDate();

    var allRegisters = await strapi.entityService.findMany('api::register.register', {
        filters: {
            class: classIds,
            classDate: { $gte: toStrapiFormat(todayDate) }
        },
        populate: {
            class: true,
            teacher: {
                populate: {
                    photo: true
                }
            }
        },
        sort: 'classDate'
    });

    var responseDate = {
        classData: [],
        previousTrials: []
    };

    for (let index = 0; index < classes.length; index++) {
        const _class = classes[index];
        var registers = allRegisters.filter((x) => x.class.id == _class.id);
        if (registers.length > 0) {
            var classData = {
                id: _class.id,
                classId: _class.classId,
                teacherName: _class.teacher.name + ' ' + _class.teacher.lastName,
                teacherPhoto: _class.teacher.photo,
                startTime: _class.startTime,
                endTime: _class.endTime,
                startDate: _class.startDate,
                endDate: _class.endDate,
                zoomLink: _class.zoomLink,
                status: _class.status,
                dayOfWeek: _.capitalize(_class.dayOfWeek),
                classDates: []
            };

            var foundStudentClass = studentClasses.find((x) => x.class?.id == _class.id);
            if (foundStudentClass) {
                classData.adminStatus = foundStudentClass.adminStatus;
            }

            for (let j = 0; j < registers.length; j++) {
                const register = registers[j];

                classData.classDates.push({
                    date: register.classDate,
                    startTime: register.startTime,
                    endTime: register.endTime,
                    teacherName: register.teacher.name + ' ' + register.teacher.lastName,
                    teacherPhoto: register.teacher.photo,
                    isCancelled: register.status == 'cancelled' || register.status == 'absent'
                });
            }

            var classStudents = await strapi.entityService.findMany('api::student-class.student-class', {
                filters: {
                    class: _class.id,
                    status: ['active', 'trial', 'awaitingFeedback', 'firstPaymentPending']
                },
                populate: 'student'
            });

            classData.classStudents = [];
            for (let i = 0; i < classStudents.length; i++) {
                const classStudent = classStudents[i];

                classData.classStudents.push({
                    id: classStudent.id,
                    name: classStudent.student.name + ' ' + classStudent.student.lastName,
                    avatarImageName: classStudent.student.avatarImageName,
                    classStatus: classStudent.classStatus,
                    adminStatus: classStudent.adminStatus
                });
            }

            responseDate.classData.push(classData);
        }
    }

    // previous trials
    const registerStudentsFilters = {
        freeTrial: true,
        register: {
            class: {
                year: yearId
            }
        }
    };

    if (studentId) {
        registerStudentsFilters.student = studentId;
    }

    if (classId) {
        registerStudentsFilters.register.class.id = classId;
    }

    var previousRegisterStudents = await strapi.entityService.findMany('api::register-student.register-student', {
        filters: registerStudentsFilters,
        populate: ['register', 'register.class']
    });

    for (let index = 0; index < previousRegisterStudents.length; index++) {
        const previousRegisterStudent = previousRegisterStudents[index];

        var classStatus = 'awaiting';

        if (
            previousRegisterStudent.register.status == 'cancelled' ||
            previousRegisterStudent.freeTrialCancelled == true
        ) {
            classStatus = 'cancelled';
        } else {
            if (previousRegisterStudent.hasAttended == true) {
                classStatus = 'attended';
            }

            if (previousRegisterStudent.hasAttended == false) {
                classStatus = 'notattended';
            }

            if (previousRegisterStudent.register.status == 'open' && previousRegisterStudent.hasAttended != true) {
                classStatus = 'awaiting';
            }
        }

        var classTrialStatus = {
            date: previousRegisterStudent.register.classDate,
            classId: previousRegisterStudent.register.class.classId,
            classStatus: classStatus
        };

        responseDate.previousTrials.push(classTrialStatus);
    }

    return responseDate;
};

module.exports.getClassesForSales = getClassesForSales;
