'use strict';
const { DateTime } = require('luxon');
const DateTimeUtils = require('../../../../utils/datetime-utils');
var _ = require('lodash');

/**
 * register service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::register.register', ({ strapi }) => ({
    async processRegisters() {
        await this.createRegisters();
        await this.updateStudentRegisters();

        return {};
    },

    async processRegisterForClass(classId) {
        const classToProcess = await strapi.entityService.findOne('api::class.class', classId, {
            populate: ['teacher']
        });
        await this.createRegisterForClass(classToProcess);

        return {};
    },

    async updateLessonStatus() {
        strapi.log.info('Update register status task run');

        // if class is upcoming, change to open
        var upcomingTriggerTime = DateTime.utc().plus({ hours: 1 }).toISO();

        var classesUpcoming = await strapi.entityService.findMany('api::register.register', {
            filters: {
                classTime: {
                    $lte: upcomingTriggerTime
                },
                status: 'upcoming'
            },
            populate: ['teacher', 'class', 'class.subject', 'class.year']
        });

        for (let i = 0; i < classesUpcoming.length; i++) {
            const element = classesUpcoming[i];
            if (element.class == null) continue;

            await strapi.entityService.update('api::register.register', element.id, {
                data: {
                    status: 'open'
                }
            });

            var registerStudents = await strapi.entityService.findMany('api::register-student.register-student', {
                filters: {
                    register: element.id,
                    student: {
                        id: { $notNull: true }
                    }
                },
                populate: {
                    student: {
                        fields: ['id']
                    }
                }
            });

            var studentIds = [];
            for (let i = 0; i < registerStudents.length; i++) {
                const rs = registerStudents[i];
                studentIds.push(rs.student.id);
            }

            // create meeting recording item
            var meetingRecording = {
                name: element.class.classId,
                class: element.class.id,
                register: element.id,
                systemGenerated: true,
                meetingType: 'lesson',
                date: element.classTime,
                status: 'incomplete',
                visible: true,
                teachers: [element.teacher.id],
                students: studentIds
            };

            await strapi.entityService.create('api::meeting-recording.meeting-recording', {
                data: meetingRecording
            });

            var dueDate = DateTimeUtils.toStrapiFormat(
                DateTime.fromFormat(element.classDate, 'yyyy-MM-dd').plus({ days: 14 })
            );

            if (element.class.rateCalculated && element.class.rateCalculated > 0) {
                await strapi.entityService.create('api::teacher-payment.teacher-payment', {
                    data: {
                        name: element.class.classId,
                        teacher: element.teacher.id,
                        register: element.id,
                        class: element.class.id,
                        date: element.classDate,
                        dueDate: dueDate,
                        systemGenerated: true,
                        type: 'lesson',
                        status: 'pending',
                        transactions: [
                            {
                                type: 'lesson',
                                amount: element.class.rateCalculated,
                                systemGenerated: true
                            }
                        ]
                    }
                });
            }
        }

        // if class is open and not yet closed, mark it as missing after 24 hrs passed
        var openTriggerTime = DateTime.utc().minus({ hours: 24 }).toISO();

        var classesOpen = await strapi.entityService.findMany('api::register.register', {
            filters: {
                classTime: {
                    $lte: openTriggerTime
                },
                status: 'open'
            },
            populate: ['register_students']
        });

        for (let i = 0; i < classesOpen.length; i++) {
            const element = classesOpen[i];

            if (element.register_students.length == 0) {
                // delete the 0 student registers

                var meetingRecordings = await strapi.entityService.findMany(
                    'api::meeting-recording.meeting-recording',
                    {
                        filters: {
                            register: element.id
                        }
                    }
                );

                if (meetingRecordings.length > 0) {
                    for (let i = 0; i < meetingRecordings.length; i++) {
                        const meetingRecording = meetingRecordings[i];

                        await strapi.entityService.delete(
                            'api::meeting-recording.meeting-recording',
                            meetingRecording.id
                        );
                    }
                }

                var teacherPayments = await strapi.entityService.findMany('api::teacher-payment.teacher-payment', {
                    filters: {
                        register: element.id
                    }
                });

                if (teacherPayments.length > 0) {
                    for (let i = 0; i < teacherPayments.length; i++) {
                        const teacherPayment = teacherPayments[i];

                        await strapi.entityService.delete('api::teacher-payment.teacher-payment', teacherPayment.id);
                    }
                }

                await strapi.entityService.delete('api::register.register', element.id);
            } else {
                // Mark as missing

                await strapi.entityService.update('api::register.register', element.id, {
                    data: {
                        status: 'missing'
                    }
                });

                // TODO: trigger email to teacher
            }
        }

        // change trial status for student class to awaiting feedback
        var trialStudentTriggerTime = DateTime.utc().plus({ hours: 1 }).toISO();

        var updateTrialStudents = await strapi.entityService.findMany('api::register-student.register-student', {
            filters: {
                classTime: {
                    $lte: trialStudentTriggerTime
                },
                register: {
                    status: ['open', 'missing', 'completed']
                },
                student_class: {
                    status: 'trial'
                },
                freeTrial: true,
                $or: [
                    {
                        freeTrialCancelled: false
                    },
                    {
                        freeTrialCancelled: {
                            $null: true
                        }
                    }
                ]
            },
            populate: ['student_class', 'register']
        });

        for (let i = 0; i < updateTrialStudents.length; i++) {
            const element = updateTrialStudents[i];

            await strapi.entityService.update('api::student-class.student-class', element.student_class.id, {
                data: {
                    status: 'awaitingFeedback'
                }
            });
        }
    },

    async getNextLessonDate(classId, afterDate) {
        try {
            if (!afterDate) {
                var todayDate = DateTimeUtils.getTodayDate();
                afterDate = todayDate;
            }

            var afterDateParsed = DateTimeUtils.parseDate(afterDate);

            // TODO: add last lesson created date to the class object so we only fetch classes that actually need register creation
            const classes = await strapi.entityService.findMany('api::class.class', {
                filters: {
                    classId: classId
                }
            });

            if (classes.length > 0) {
                var foundClass = classes[0];

                const registers = await strapi.entityService.findMany('api::register.register', {
                    sort: [{ classDate: 'asc' }],
                    filters: {
                        classDate: {
                            $gte: afterDateParsed
                        },
                        class: foundClass.id
                    },
                    limit: 1
                });

                if (registers.length > 0) {
                    var foundRegister = registers[0];

                    return { nextLessonDate: foundRegister.classDate };
                } else {
                    return { message: 'Lesson not found after the date ' + afterDateParsed, httpCode: 404 };
                }
            } else {
                return { message: 'Class not found', httpCode: 404 };
            }
        } catch (err) {
            return { message: err.message, httpCode: 500 };
        }

        return {};
    },

    async unlockHomeworkLock() {
        var unlockTime = DateTime.local().toISO();

        const lockedRegisters = await strapi.entityService.findMany('api::register.register', {
            filters: {
                homeworkLockEndTime: { $notNull: true },
                homeworkLockEndTime: { $lte: unlockTime }
            }
        });

        for (let i = 0; i < lockedRegisters.length; i++) {
            const element = lockedRegisters[i];

            const entry = await strapi.entityService.update('api::register.register', element.id, {
                data: {
                    homework_locked_by_teacher: null,
                    homeworkLockStartTime: null,
                    homeworkLockEndTime: null
                }
            });

            await strapi.service('api::event-message.event-message').send({
                eventCode: '1100',
                template: 'The homework is available for marking',
                entity: 'register',
                entityId: element.id,
                receiverId: 'teacher-users',
                background: true
            });
        }

        return {};
    },

    async assignHomeworksToTeacher(registerId, teacherId) {
        try {
            if (!teacherId) {
                return { message: 'Missing teacherId', httpCode: 400 };
            }

            if (!registerId) {
                return { message: 'Missing registerId', httpCode: 400 };
            }

            const register = await strapi.entityService.findOne('api::register.register', registerId, {
                populate: ['homework_locked_by_teacher']
            });

            if (register) {
                const teacher = await strapi.entityService.findOne('api::teacher.teacher', teacherId, {});

                if (!teacher) {
                    return { message: 'Teacher not found', httpCode: 404 };
                }

                if (register.homework_locked_by_teacher) {
                    if (register.homework_locked_by_teacher.id == teacher.id) {
                        return { message: 'Already assigned to same teacher', httpCode: 500 };
                    }

                    if (register.homework_locked_by_teacher.id != teacher.id) {
                        return { message: 'Assigned to another teacher', httpCode: 500 };
                    }
                }

                var lockEndHours = 3;
                var lockStartTime = DateTime.local();
                var lockEndTime = lockStartTime.plus({ hours: lockEndHours });
                var lockStartTimeIso = lockStartTime.toISO();
                var lockEndTimeIso = lockEndTime.toISO();

                const entry = await strapi.entityService.update('api::register.register', registerId, {
                    data: {
                        homework_locked_by_teacher: teacherId,
                        homeworkLockStartTime: lockStartTimeIso,
                        homeworkLockEndTime: lockEndTimeIso
                    }
                });

                await strapi.service('api::event-message.event-message').send({
                    eventCode: '1101',
                    template: 'The homework is locked to a teacher',
                    entity: 'register',
                    entityId: registerId,
                    receiverId: 'teacher-users',
                    background: true
                });

                return {
                    homeworkLockStartTime: entry.homeworkLockStartTime,
                    homeworkLockEndTime: entry.homeworkLockEndTime
                };
            } else {
                return { message: 'Register not found', httpCode: 404 };
            }
        } catch (err) {
            return { message: err.message, httpCode: 500 };
        }

        return {};
    },

    async getHomework(query) {
        try {
            var { teacherId } = query;

            if (!teacherId) {
                return { message: 'Missing teacherId query parameter', httpCode: 400 };
            }

            if (!query.filters) {
                query.filters = {};
            }
            if (!query.filters.homeworkDeadline) {
                query.filters.homeworkDeadline = {};
            }

            if (!query.populate) query.populate = {};

            if (Array.isArray(query.populate)) {
                if (!_.includes(query.populate, 'homework_locked_by_teacher'))
                    query.populate.push('homework_locked_by_teacher');
            } else {
                if (!query.populate.hasOwnProperty('homework_locked_by_teacher'))
                    query.populate.homework_locked_by_teacher = {
                        populate: ''
                    };
            }

            query.filters.homeworkDeadline.$notNull = true; // has homework files uploaded

            query.filters.homeworkDeadline.$lte = DateTime.now(); // only get homework with passed deadline

            query.filters.register_students = query.filters?.register_students ?? {};
            query.filters.register_students.homeworkSubmitted =
                query.filters?.register_students?.homeworkSubmitted ?? {};
            query.filters.register_students.homeworkSubmitted.$eq = true;

            const { results, pagination } = await super.find(query);

            for (let i = 0; i < results.length; i++) {
                const homeworkRegister = results[i];
                homeworkRegister.homeworkStatus = 'open';
                homeworkRegister.canTeacherMarkHomework = true;

                var registerStudents = await strapi.entityService.findMany('api::register-student.register-student', {
                    filters: {
                        register: homeworkRegister.id
                    }
                });

                homeworkRegister.homeworksTotal = _.filter(registerStudents, function (o) {
                    return o.homeworkSubmitted == true;
                }).length;
                homeworkRegister.homeworksMarked = _.filter(registerStudents, function (o) {
                    return o.homeworkSubmitted == true && o.homeworkMarkingStatus == 'marked';
                }).length;
                var anyHomeworkHasError = _.filter(registerStudents, function (o) {
                    return o.homeworkMarkingStatus == 'error';
                });

                if (homeworkRegister.homeworkMarkingBlocked) {
                    homeworkRegister.homeworkStatus = 'blocked';
                    homeworkRegister.canTeacherMarkHomework = false;
                } else if (homeworkRegister.homeworkMarkingComplete) {
                    homeworkRegister.homeworkStatus = 'completed';
                    homeworkRegister.canTeacherMarkHomework = false;
                } else if (homeworkRegister.homework_locked_by_teacher) {
                    homeworkRegister.homeworkStatus = 'locked';
                    homeworkRegister.canTeacherMarkHomework =
                        homeworkRegister.homework_locked_by_teacher.id == teacherId;
                }
            }

            return { results, pagination };
        } catch (err) {
            return { message: err.message, httpCode: 500 };
        }

        return {};
    },

    async changeTeacher(data) {
        try {
            var registerId = data.registerId;
            var newTeacherId = data.teacherId;

            if (!registerId) {
                return { message: 'Missing registerId', httpCode: 400 };
            }

            if (!newTeacherId) {
                return { message: 'Missing teacherId', httpCode: 400 };
            }

            var register = await super.findOne(registerId, {
                populate: ['class', 'teacher']
            });

            var teacher = await strapi.entityService.findOne('api::teacher.teacher', newTeacherId);

            if (!register) {
                return { message: 'Register does not exist', httpCode: 400 };
            }

            if (!teacher) {
                return { message: 'Teacher does not exist', httpCode: 400 };
            }

            var previousTeacherId = register.teacher.id;

            if (register.teacher && previousTeacherId != newTeacherId) {
                var classTeachers = await strapi.entityService.findMany('api::class-teacher.class-teacher', {
                    filters: {
                        class: register.class.id,
                        teacher: newTeacherId
                    }
                });

                if (classTeachers.length == 0) {
                    await strapi.entityService.create('api::class-teacher.class-teacher', {
                        data: {
                            class: register.class.id,
                            teacher: newTeacherId,
                            classId: register.class.classId,
                            type: 'cover'
                        }
                    });
                }

                await strapi.entityService.update('api::register.register', registerId, {
                    data: {
                        teacher: newTeacherId
                    }
                });

                // clear class-teacher records if teacher not linked to any of the classes
                await strapi
                    .service('api::class-teacher.class-teacher')
                    .clearTeacherClassLink(register.class.id, previousTeacherId);

                await strapi.service('api::event-message.event-message').send({
                    eventCode: '1102',
                    template: 'Class {{classId}} at {{classDate}} has been assigned to you',
                    entity: 'register',
                    entityId: register.id,
                    receiverId: 'teacher-user-' + newTeacherId,
                    messageValues: {
                        classId: register.class.classId,
                        classDate: DateTimeUtils.strapiDateToFormat(register.classDate, 'dd LLL')
                    }
                });

                await strapi.service('api::event-message.event-message').send({
                    eventCode: '1103',
                    template: 'Class {{classId}} at {{classDate}} has been assigned to someone else',
                    entity: 'register',
                    entityId: register.id,
                    receiverId: 'teacher-user-' + previousTeacherId,
                    messageValues: {
                        classId: register.class.classId,
                        classDate: DateTimeUtils.strapiDateToFormat(register.classDate, 'dd LLL')
                    }
                });

                // TODO send email also to let teacher know?
            }

            return {};
        } catch (err) {
            return { message: err.message, httpCode: 500 };
        }

        return {};
    },

    async updateClassStatus(data) {
        try {
            var registerId = data.registerId;
            var newStatus = data.newStatus;

            if (!registerId) {
                return { message: 'Missing registerId', httpCode: 400 };
            }

            if (!newStatus) {
                return { message: 'Missing newStatus', httpCode: 400 };
            }

            if (newStatus != 'cancelled' && newStatus != 'absent') {
                return { message: 'Only cancelled or absent allowed in newStatus', httpCode: 400 };
            }

            var register = await super.findOne(registerId, {
                populate: ['class', 'teacher']
            });

            if (!register) {
                return { message: 'Register does not exist', httpCode: 400 };
            }

            await strapi.entityService.update('api::register.register', registerId, {
                data: {
                    status: newStatus
                }
            });

            await strapi.service('api::event-message.event-message').send({
                eventCode: '1104',
                template: 'Class {{classId}} at {{classDate}} has been marked as {{status}}',
                entity: 'register',
                entityId: register.id,
                receiverId: 'teacher-user-' + register.teacher.id,
                messageValues: {
                    classId: register.class.classId,
                    classDate: DateTimeUtils.strapiDateToFormat(register.classDate, 'dd LLL'),
                    status: newStatus
                }
            });

            // TODO send email also to let teacher know?

            return {};
        } catch (err) {
            return { message: err.message, httpCode: 500 };
        }
    },

    async upcomingLessons(query) {
        try {
            const registerStudentsQuery = {
                filters: {
                    student_class:{
                        status:{
                            $in:['active','trial']
                        }
                    },
                    $or: [
                        {
                            freeTrialCancelled: false
                        },
                        {
                            freeTrialCancelled: {
                                $null: true
                            }
                        }
                    ],
                    register: {
                        classDate: {
                            $gte: DateTime.now().toISO(),
                            $lte: DateTime.now().plus({ days: 7 }).toISO()
                        }
                    }
                },
                populate: ['register.teacher', 'register.class', 'register.class.subject', 'student', 'student_class']
            };

            if (query?.studentsIds) {
                registerStudentsQuery.filters.student = {
                    id: {
                        $in: query.studentsIds
                    }
                };
            } else {
                return { message: "Missing 'studentsIds' query parameter", httpCode: 400 };
            }

            if (query.classIds && _.isArray(query.classIds)) {
                registerStudentsQuery.filters.register.class = {
                    id: {
                        $in: query.classIds
                    }
                };
            }

            const registerStudents = await strapi.entityService.findMany(
                'api::register-student.register-student',
                registerStudentsQuery
            );

            const registers = registerStudents.map((registerStudent) => ({
                type: registerStudent?.student_class?.status,
                classDate: registerStudent.register.classDate,
                classStartTime: registerStudent.register.startTime,
                classEndTime: registerStudent.register.endTime,
                classId: registerStudent.register.class.classId,
                registerId: registerStudent.register.id,
                subjectId: registerStudent.register.class.subject.id,
                subjectName: registerStudent.register.class.subject.name,
                subjectColour: registerStudent.register.class.subject.colour,
                subjectCode: registerStudent.register.class.subject.code,
                zoomLink: registerStudent.register.class.zoomLink,
                zoomMeetingId: registerStudent.register.class.zoomMeetingId,
                zoomMeetingPasscode: registerStudent.register.class.zoomMeetingPasscode,
                teacherId: registerStudent.register.teacher.id,
                teacherName: registerStudent.register.teacher.name,
                studentId: registerStudent.student.id,
                studentName: registerStudent.student.name
            }));

            // sorting the results by date and time in asc order.
            return _.filter(registers, (e) => {
                return DateTime.fromISO(`${e.classDate}T${e.classEndTime}`).diff(DateTime.now()).toMillis() > 0;
            }).sort(
                (a, b) =>
                    DateTime.fromISO(`${a.classDate}T${a.classStartTime}`).diff(DateTime.now()).toMillis() -
                    DateTime.fromISO(`${b.classDate}T${b.classStartTime}`).diff(DateTime.now()).toMillis()
            );
        } catch (err) {
            return { message: err.message, httpCode: 500 };
        }
    },
    async createRegisters() {
        strapi.log.info('Create registers task run');

        var todayDate = DateTimeUtils.getTodayDate();
        var todayDateFormatted = DateTimeUtils.toStrapiFormat(todayDate);

        var weeksToCheckForRegisters = 4;
        var fourWeekFutureDate = DateTimeUtils.addDays(todayDate, 7 * weeksToCheckForRegisters);
        var fourWeekFutureDateFormatted = DateTimeUtils.toStrapiFormat(fourWeekFutureDate);

        const classes = await strapi.entityService.findMany('api::class.class', {
            filters: {
                status: { $notIn: ['archived'] },
                startDate: { $lte: todayDateFormatted },
                endDate: { $gte: todayDateFormatted },
                $or: [
                    {
                        nextRegisterGenerateDate: {
                            $null: true
                        }
                    },
                    {
                        nextRegisterGenerateDate: {
                            $lte: fourWeekFutureDateFormatted
                        }
                    }
                ]
            },
            populate: ['teacher']
        });

        if (!classes || classes.length == 0) return {};

        for (let i = 0; i < classes.length; i++) {
            let _class = classes[i];
            await this.createRegisterForClass(_class);
        }

        strapi.log.info('Create registers task run complete');
    },

    async createRegisterForClass(classToProcess) {
        var todayDate = DateTimeUtils.getTodayDate();
        var weeksToCheckForRegisters = 4;

        var fourWeekFutureDate = DateTimeUtils.addDays(todayDate, 7 * weeksToCheckForRegisters);

        let _class = classToProcess;

        if (!_class.teacher) return;

        var classStartDate = DateTimeUtils.parseDate(_class.startDate);
        var classEndDate = DateTimeUtils.parseDate(_class.endDate);

        if (classStartDate > fourWeekFutureDate) return; // dont create classes after <weeksToCheckForRegisters>
        if (classEndDate < todayDate) return; // dont create classes after end date

        var classTeachers = await strapi.entityService.findMany('api::class-teacher.class-teacher', {
            filters: {
                class: _class.id,
                teacher: _class.teacher.id,
                type: 'active'
            }
        });

        if (classTeachers.length == 0) {
            await strapi.entityService.create('api::class-teacher.class-teacher', {
                data: {
                    class: _class.id,
                    teacher: _class.teacher.id,
                    classId: _class.classId,
                    type: 'active'
                }
            });
        }

        // if there are extra class-teacher records created, delete the extra ones
        if (classTeachers.length > 1) {
            for (let i = 1; i < classTeachers.length; i++) {
                const classTeacher = classTeachers[i];

                await strapi.entityService.delete('api::class-teacher.class-teacher', classTeacher.id);
            }
        }

        const registers = await strapi.entityService.findMany('api::register.register', {
            sort: [{ classDate: 'desc' }],
            filters: {
                class: _class.id
            },
            limit: 1
        });

        var lastRegisterDate = classStartDate;
        if (registers.length > 0) {
            var register = registers[0];
            lastRegisterDate = DateTimeUtils.parseDate(register.classDate);
        } else {
            lastRegisterDate = DateTimeUtils.subtractDays(lastRegisterDate, 7); // to ensure that the first class date register gets created
        }

        var lastDateCreated = lastRegisterDate;
        var datesToCreateRegister = [];

        while (lastDateCreated <= fourWeekFutureDate) {
            var lastDateCreated = DateTimeUtils.addDays(lastDateCreated, 1);
            if (DateTimeUtils.toDayOfWeek(lastDateCreated).toLowerCase() == _class.dayOfWeek) {
                datesToCreateRegister.push(lastDateCreated);
            }
        }

        var lastGeneratedDate = null;
        for (let j = 0; j < datesToCreateRegister.length; j++) {
            const nextLessonDate = datesToCreateRegister[j];

            if (nextLessonDate < classStartDate) continue; // dont create classes before start date
            if (nextLessonDate > classEndDate) continue; // dont create classes after end date

            const newRegister = await strapi.entityService.create('api::register.register', {
                data: {
                    name: _class.classId + ' ' + DateTimeUtils.toStrapiFormat(nextLessonDate),
                    teacher: _class.teacher.id,
                    class: _class.id,
                    classDate: DateTimeUtils.toStrapiFormat(nextLessonDate),
                    startTime: _class.startTime,
                    endTime: _class.endTime,
                    homeworkType: 'homework',
                    teacherPaymentStatus: 'pending',
                    payAmount: _class.rate
                }
            });

            lastGeneratedDate = nextLessonDate;

            const classTeachers = await strapi.entityService.findMany('api::class-teacher.class-teacher', {
                filters: {
                    teacher: _class.teacher.id,
                    class: _class.id,
                    type: 'active'
                }
            });

            if (classTeachers.length == 0) {
                const newClassTeacher = await strapi.entityService.create('api::class-teacher.class-teacher', {
                    data: {
                        teacher: _class.teacher.id,
                        class: _class.id,
                        classId: _class.classId,
                        type: 'active'
                    }
                });
            }
        }

        if (lastGeneratedDate || _class.nextRegisterGenerateDate == null) {
            if (!lastGeneratedDate) {
                lastGeneratedDate = lastRegisterDate;
            }

            await strapi.entityService.update('api::class.class', _class.id, {
                data: {
                    nextRegisterGenerateDate: DateTimeUtils.toStrapiFormat(DateTimeUtils.addDays(lastGeneratedDate, 7))
                }
            });
        }
    },

    async updateStudentRegisters() {
        strapi.log.info('Update student registers task run');

        var todayDate = DateTimeUtils.getTodayDate();
        var todayDateFormated = DateTimeUtils.toStrapiFormat(todayDate);

        const classes = await strapi.entityService.findMany('api::class.class', {
            filters: {
                endDate: {
                    $gte: todayDateFormated
                }
            }
        });

        for (let i = 0; i < classes.length; i++) {
            const _class = classes[i];
            await this.updateStudentRegistersForClass(_class);
        }

        strapi.log.info('Update student registers task run complete');
    },

    async updateStudentRegistersForClass(classToCheck) {
        var todayDate = DateTimeUtils.getTodayDate();
        var todayDateFormated = DateTimeUtils.toStrapiFormat(todayDate);

        const _class = classToCheck;
        var activeStudentsInClassIds = [];

        const studentsLinkedToClass = await strapi.entityService.findMany('api::student-class.student-class', {
            filters: {
                status: 'active',
                class: _class.id
            },
            populate: ['student']
        });

        for (let j = 0; j < studentsLinkedToClass.length; j++) {
            const item = studentsLinkedToClass[j];
            if (item.student) {
                activeStudentsInClassIds.push({
                    id: item.student.id,
                    studentId: item.student.studentId,
                    studentClass: item
                });
            } else {
                strapi.log.warn('Student missing for student-class %s', item.id);
            }
        }

        const registers = await strapi.entityService.findMany('api::register.register', {
            filters: {
                classDate: {
                    $gte: todayDateFormated
                },
                class: _class.id
            },
            populate: ['register_students', 'register_students.student']
        });

        for (let j = 0; j < registers.length; j++) {
            const register = registers[j];
            var registerStudentIds = [];

            for (let k = 0; k < register.register_students.length; k++) {
                const registerStudent = register.register_students[k];
                if (registerStudent.student) {
                    registerStudentIds.push({
                        id: registerStudent.student.id,
                        studentId: registerStudent.student.studentId,
                        registerStudentId: registerStudent.id,
                        freeTrial: registerStudent.freeTrial
                    });
                } else {
                    strapi.log.warn('Student missing for register-student %s', registerStudent.id);
                }
            }

            // add missing students
            var addMissingStudents = activeStudentsInClassIds.filter(function (activeStudentsInClassId_el) {
                return (
                    registerStudentIds.filter(function (registerStudentId_el) {
                        return registerStudentId_el.id == activeStudentsInClassId_el.id;
                    }).length == 0
                );
            });

            for (let l = 0; l < addMissingStudents.length; l++) {
                const studentToAddRecord = addMissingStudents[l];
                var canAdd = true;

                if (studentToAddRecord.studentClass) {
                    var registerDate = DateTimeUtils.parseDate(register.classDate);

                    if (studentToAddRecord.studentClass.classDate) {
                        var classStartDate = DateTimeUtils.parseDate(studentToAddRecord.studentClass.classDate);

                        // dont add to register if the start date has not yet arrived
                        if (classStartDate > registerDate) canAdd = false;
                    }

                    if (studentToAddRecord.studentClass.cancellationRequestDate) {
                        // has requested cancellation
                        var classCancellationDate = DateTimeUtils.parseDate(
                            studentToAddRecord.studentClass.cancellationRequestDate
                        );

                        // dont add to register if cancellation date has arrived
                        if (registerDate > classCancellationDate) canAdd = false;
                    }
                }

                if (canAdd) {
                    const newRegisterStudent = await strapi.entityService.create(
                        'api::register-student.register-student',
                        {
                            data: {
                                name: studentToAddRecord.studentId + ' ' + _class.classId + ' ' + register.classDate,
                                student: studentToAddRecord.id,
                                register: register.id,
                                student_class: studentToAddRecord?.studentClass?.id
                            }
                        }
                    );
                }
            }

            // remove extra students
            var removeExtraStudents = registerStudentIds.filter(function (registerStudentId_el) {
                return (
                    activeStudentsInClassIds.filter(function (activeStudentsInClassId_el) {
                        return activeStudentsInClassId_el.id == registerStudentId_el.id;
                    }).length == 0
                );
            });

            for (let l = 0; l < removeExtraStudents.length; l++) {
                const stuId = removeExtraStudents[l];

                if (!stuId.freeTrial) {
                    // dont remove free trial students
                    const deletedEntry = await strapi.entityService.delete(
                        'api::register-student.register-student',
                        stuId.registerStudentId
                    );
                }
            }
        }

        await strapi.service('api::class.class').setRateCalculated(_class.id);
    }
}));
