const { ValidationError } = require('@strapi/utils').errors;
const DateTimeUtils = require('../../../../../utils/datetime-utils');
const _ = require('lodash');

module.exports = {
    async beforeCreate(event) {
        const { params } = event;

        if (params.data.classId == 'GEN_NEW_ID' || _.isEmpty(params.data.classId)) {
            params.data.classId = await strapi.service('api::id-config.id-config').getNewId('class');
        }

        if (!params.data.dayOfWeek) {
            params.data.dayOfWeek = DateTimeUtils.strapiDateToDayOfWeek(params.data.startDate).toLowerCase();
        }

        const meetingAccountId = extractRelationId(params?.data?.meeting_account);

        if (meetingAccountId) {
            /* update the class account fields to match the selected meeting account data*/
            const meetingAccount = await strapi.entityService.findOne(
                'api::meeting-account.meeting-account',
                meetingAccountId
            );
            params.data.zoomAccount = meetingAccount.name;
            params.data.zoomPassword = meetingAccount.password;
        }
    },

    async afterCreate(event) {
        const { result, params } = event;

        if (result.teacher) {
            await strapi.entityService.create('api::class-teacher.class-teacher', {
                data: {
                    class: result.id,
                    teacher: result.teacher.id,
                    classId: result.classId,
                    type: 'active'
                }
            });
        }
    },

    async beforeUpdate(event) {
        const { result, params } = event;

        const meetingAccountId = extractRelationId(params?.data?.meeting_account);
        if (meetingAccountId) {
            /* update the class account fields to match the selected meeting account data*/
            const meetingAccount = await strapi.entityService.findOne(
                'api::meeting-account.meeting-account',
                meetingAccountId
            );
            params.data.zoomAccount = meetingAccount.name;
            params.data.zoomPassword = meetingAccount.password;
        }

        if (params?.data?.teacher) {
            const existingClass = await strapi.entityService.findOne('api::class.class', params.where.id, {
                fields: ['id'],
                populate: {
                    teacher: {
                        fields: ['id']
                    }
                }
            });

            event.state.checkClassTeacherLink = true;
            event.state.existingTeacherId = existingClass.teacher.id;
        }

        if (params?.data?.dayOfWeek || params?.data?.endTime || params?.data?.startTime) {
            const existingClass = await strapi.entityService.findOne('api::class.class', params.where.id, {
                fields: ['id', 'dayOfWeek', 'endTime', 'startTime'],
            });
            if (params?.data?.dayOfWeek != existingClass.dayOfWeek) {
                const registers = await strapi.entityService.findMany('api::register.register', {
                    filters: {
                        class: existingClass.id,
                        status: 'upcoming',
                    },
                });

                await Promise.all(registers.map(async (register) => {
                    const newDate = DateTimeUtils.changeDate(existingClass.dayOfWeek, params?.data?.dayOfWeek, register.classDate, params?.data?.startDate, params?.data?.endDate);
                    if (!newDate) {
                        const registerStudents = await strapi.entityService.findMany('api::register-student.register-student', {
                            filters: {
                                register: {
                                    class: {
                                        id: existingClass.id
                                    },
                                    status: 'upcoming',
                                    freeTrial: true,
                                },
                            },
                        });
                        if (registerStudents.length > 0) {
                            throw new ValidationError("The class day can't be changed as the new register date occurs after the end date of the class and that register has trial students");
                        }
                    }
                }));
            }

            event.state.dayOfWeek = existingClass.dayOfWeek;
            event.state.endTime = existingClass.endTime;
            event.state.startTime = existingClass.startTime;
            event.state.checkClassTiming = true;
        }
    },

    async afterUpdate(event) {
        const { result, params } = event;
        const { data, where, select, populate } = event.params;
        let timingUpdate = false;

        if (event.state.checkClassTeacherLink || event.state.checkClassTiming) {
            const updatedClass = await strapi.entityService.findOne('api::class.class', params.where.id, {
                fields: ['id', 'classId', 'dayOfWeek', 'endTime', 'startTime', 'startDate', 'endDate'],
                populate: {
                    teacher: {
                        fields: ['id']
                    }
                }
            });

            var newTeacherId = updatedClass.teacher.id;

            if (event.state.existingTeacherId != newTeacherId) {
                // check if class-teacher exists, change to "active" from "cover" and if not exists, create a new class-teacher link
                var classTeachers = await strapi.entityService.findMany('api::class-teacher.class-teacher', {
                    filters: {
                        class: updatedClass.id,
                        teacher: newTeacherId
                    }
                });

                if (classTeachers.length > 0) {
                    for (let id = 0; id < classTeachers.length; id++) {
                        const element = classTeachers[id];
                        if (element.type == 'cover') {
                            await strapi.entityService.update('api::class-teacher.class-teacher', element.id, {
                                data: {
                                    type: 'active'
                                }
                            });
                        }
                    }
                } else {
                    await strapi.entityService.create('api::class-teacher.class-teacher', {
                        data: {
                            class: updatedClass.id,
                            teacher: newTeacherId,
                            classId: updatedClass.classId,
                            type: 'active'
                        }
                    });
                }

                const registers = await strapi.entityService.findMany('api::register.register', {
                    filters: {
                        class: updatedClass.id,
                        status: 'upcoming',
                        teacher: event.state.existingTeacherId
                    },
                    populate: {
                        class: {
                            fields: ['classId', 'id']
                        }
                    }
                });

                registers.map(async (register) => {
                    // set the new teacher to the register
                    await strapi.entityService.update('api::register.register', register.id, {
                        data: {
                            teacher: newTeacherId
                        }
                    });
                });

                // send event message to new and existing teacher
                await strapi.service('api::event-message.event-message').send({
                    eventCode: '1102',
                    template: 'Class {{classId}} and all lessons have been assigned to you',
                    entity: 'class',
                    entityId: updatedClass.id,
                    receiverId: 'teacher-user-' + newTeacherId,
                    messageValues: {
                        classId: updatedClass.classId
                    }
                });

                await strapi.service('api::event-message.event-message').send({
                    eventCode: '1103',
                    template: 'Class {{classId}} and all future lessons have been assigned to someone else',
                    entity: 'class',
                    entityId: updatedClass.id,
                    receiverId: 'teacher-user-' + event.state.existingTeacherId,
                    messageValues: {
                        classId: updatedClass.classId
                    }
                });

                // clear class-teacher records if teacher not linked to any of the classes
                await strapi
                    .service('api::class-teacher.class-teacher')
                    .clearTeacherClassLink(result.id, event.state.existingTeacherId);
            }

            if (event.state.dayOfWeek != updatedClass.dayOfWeek) {
                timingUpdate = true;
                const registers = await strapi.entityService.findMany('api::register.register', {
                    filters: {
                        class: updatedClass.id,
                        status: 'upcoming',
                    },
                });

                let takenDates = []

                registers.map(async (register) => {
                    const newDate = DateTimeUtils.changeDate(event.state.dayOfWeek, updatedClass.dayOfWeek, register.classDate, updatedClass.startDate, updatedClass.endDate)
                    takenDates.push(newDate);
                    if (newDate) {
                        await strapi.entityService.update('api::register.register', register.id, {
                            data: {
                                dayOfWeek: updatedClass.dayOfWeek,
                                endTime: updatedClass.endTime,
                                startTime: updatedClass.startTime,
                                classDate: newDate
                            }
                        });
                    } else {
                        const registerStudents = await strapi.entityService.findMany('api::register-student.register-student', {
                            filters: {
                                register: {
                                    id: register.id,
                                },
                            },
                        });
                        registerStudents?.map(async (relation) => {
                            await strapi.entityService.delete('api::register-student.register-student', relation.id)
                        })
                        await strapi.entityService.delete('api::register.register', register.id);
                    }
                });

                //handling changing class interval

                /*            if (takenDates.length >= 2) {
                               const newPrevDates = DateTimeUtils.fillGaps(updatedClass.startDate, takenDates.sort()[0], updatedClass.dayOfWeek)//fill gaps @the beg
                               newPrevDates.map(async (date) => {
                                   await strapi.entityService.create('api::register.register', {
                                       data: {
                                           name: updatedClass.classId + ' ' + date,
                                           teacher: updatedClass.teacher.id,
                                           class: updatedClass.id,
                                           classDate: date,
                                           startTime: updatedClass.startTime,
                                           endTime: updatedClass.endTime,
                                           homeworkType: 'homework',
                                           teacherPaymentStatus: 'pending',
                                       }
                                   });
                               });
           
                               const newPostDates = DateTimeUtils.fillGaps(takenDates.sort()[takenDates.length - 1], updatedClass.endDate, updatedClass.dayOfWeek)//fill gaps @the end
                               newPostDates.map(async (date) => {
                                   await strapi.entityService.create('api::register.register', {
                                       data: {
                                           name: updatedClass.classId + ' ' + date,
                                           teacher: updatedClass.teacher.id,
                                           class: updatedClass.id,
                                           classDate: date,
                                           startTime: updatedClass.startTime,
                                           endTime: updatedClass.endTime,
                                           homeworkType: 'homework',
                                           teacherPaymentStatus: 'pending',
                                       }
                                   });
                               })
                           }
                           else {
                               const newDates = DateTimeUtils.fillGaps(updatedClass.startDate, updatedClass.endDate, updatedClass.dayOfWeek)//fill the whole interval
                               newDates.map(async (date) => {
                                   await strapi.entityService.create('api::register.register', {
                                       data: {
                                           name: updatedClass.classId + ' ' + date,
                                           teacher: updatedClass.teacher.id,
                                           class: updatedClass.id,
                                           classDate: date,
                                           startTime: updatedClass.startTime,
                                           endTime: updatedClass.endTime,
                                           homeworkType: 'homework',
                                           teacherPaymentStatus: 'pending',
                                       }
                                   });
                               })
                           } */
            }
            if (event.state.startTime != updatedClass.startTime || event.state.endTime != updatedClass.endTime) {
                timingUpdate = true;
                const registers = await strapi.entityService.findMany('api::register.register', {
                    filters: {
                        class: updatedClass.id,
                        status: 'upcoming',
                    },
                });

                registers.map(async (register) => {
                    await strapi.entityService.update('api::register.register', register.id, {
                        data: {
                            startTime: updatedClass.startTime,
                            endTime: updatedClass.endTime
                        }
                    });
                });
            }
            if (timingUpdate) {
                let message = `Class ${updatedClass.classId} and all its lessons`
                if (event.state.dayOfWeek != updatedClass.dayOfWeek) {
                    message = message + ` dates have been changed to be on ${updatedClass.dayOfWeek}`
                    if (event.state.startTime != updatedClass.startTime || event.state.endTime != updatedClass.endTime) {
                        message = message + ` from ${updatedClass.startTime} to ${updatedClass.endTime}`
                    }
                }
                else if (event.state.startTime != updatedClass.startTime || event.state.endTime != updatedClass.endTime) {
                    message = message + ` times have been changed to from ${updatedClass.startTime} to ${updatedClass.endTime}`
                }
                await strapi.service('api::event-message.event-message').send({
                    eventCode: '1106',
                    template: message,
                    entity: 'Class',
                    entityId: updatedClass.id,
                    receiverId: 'teacher-user-' + updatedClass.teacher.id,
                    messageValues: {
                        classId: updatedClass.classId
                    },
                    forceSend: true
                });

                const registerStudents = await strapi.entityService.findMany('api::register-student.register-student', {
                    filters: {
                        register: {
                            class: {
                                id: updatedClass.id
                            },
                            status: 'upcoming'
                        },
                    },
                    populate: {
                        student: {
                            fields: ['id']
                        }
                    }
                });

                [...new Set(registerStudents.map(reg => reg.student.id))]?.map(async (id) => {
                    const link = await strapi
                        .service('api::family-link.family-link')
                        .findByEntityId('student', id);

                    await strapi.service('api::event-message.event-message').send({
                        eventCode: '1304',
                        template: message,
                        entity: 'Class',
                        entityId: updatedClass.id,
                        receiverId: 'student-user-' + id,
                        messageValues: {
                            classId: updatedClass.classId
                        },
                        forceSend: true
                    });

                    link?.parentIds?.map(async (parent) => {
                        await strapi.service('api::event-message.event-message').send({
                            eventCode: '1204',
                            template: message,
                            entity: 'class',
                            entityId: updatedClass.id,
                            receiverId: 'parent-user-' + parent,
                            messageValues: {
                                classId: updatedClass.classId
                            },
                            forceSend: true
                        });
                    })
                })

            }
        }
    },
    async afterFindMany(event) {

        const { result } = event;

        result.map(async (classItem) => {
            const capacity = await getClassCapacity(classItem.id);
            classItem.classCapacity = capacity;
        })
    },
    async afterFindOne(event) {

        const { result } = event;

        if (result) {
            const capacity = await getClassCapacity(result?.id);
            result.classCapacity = capacity;
        }
    }
};

function extractRelationId(relation) {
    let relationId;
    if (typeof relation === 'object') {
        relationId = _.first(relation?.connect)?.id;
    } else {
        relationId = relation;
    }
    return relationId;
}

async function getClassCapacity(classId) {
    var studentClasses = await strapi.entityService.findMany('api::student-class.student-class', {
        fields: ['id'],
        filters: {
            class: classId,
            status: ['active']
        }
    });
    return studentClasses.length;
}