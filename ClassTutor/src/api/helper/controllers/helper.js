const { DateTime } = require('luxon');
const { calculateNextPaymentDate } = require('../../../../utils/payment');

module.exports = {
    async changeCollection(ctx, next) {
        try {
            var data = ctx.request.body;

            var entityName = data.entityName;
            var entityId = data.entityId;
            var collectionName = data.collectionName;
            var dataId = data.dataId;
            var action = data.action;
            var isAdd = action == 'ADD';
            var isRemove = action == 'REMOVE';

            var jsonPopulate = '{ "populate": { "' + collectionName + '": true } }';
            var jsonPopulateParsed = JSON.parse(jsonPopulate);

            const entry = await strapi.entityService.findOne(
                'api::' + entityName + '.' + entityName,
                entityId,
                jsonPopulateParsed
            );

            var processed = false;
            if (entry) {
                var collection = entry[collectionName];
                if (collection) {
                    if (isAdd || isRemove) {
                        var existing = [];
                        for (let i = 0; i < collection.length; i++) {
                            const collectionEntity = collection[i];
                            existing.push(collectionEntity.id);
                        }

                        var processCollection = false;
                        if (existing.indexOf(dataId) == -1) {
                            if (isAdd) {
                                existing.push(dataId);
                                processCollection = true;
                            }
                        }

                        if (existing.indexOf(dataId) != -1) {
                            if (isRemove) {
                                existing.splice(existing.indexOf(dataId), 1);
                                processCollection = true;
                            }
                        }

                        if (processCollection) {
                            var existingStr = String(existing);

                            var jsonModify =
                                '{ "data": { "' + collectionName + '": [ ' + existingStr + ' ] } }';
                            var jsonModifyParsed = JSON.parse(jsonModify);

                            const entry = await strapi.entityService.update(
                                'api::' + entityName + '.' + entityName,
                                entityId,
                                jsonModifyParsed
                            );

                            if (entityName == 'class') {
                                const response = await strapi
                                    .service('api::register.register')
                                    .processRegisters();
                            }

                            processed = true;
                        } else {
                            return ctx.notFound('Data ID not found in collection', {
                                dataId: dataId
                            });
                        }
                    }
                } else {
                    return ctx.notFound('Collection not found', {
                        collectionName: collectionName
                    });
                }
            } else {
                return ctx.notFound('Entity not found', { entityId: entityId });
            }

            if (!processed) {
                return ctx.badRequest('Collection not modified');
            }
        } catch (err) {
            return ctx.badRequest(err.message);
        }

        return {};
    },
    //TODO: move it to invoices
    async payInvoice(ctx, next) {
        const { studentId, invoiceId } = ctx.request.body.data;
        //validate
        if (!studentId) {
            return ctx.badRequest('studentId required');
        }
        if (!invoiceId) {
            return ctx.badRequest('invoiceId required');
        }
        let response = {};
        const invoice = await strapi.entityService.findOne('api::invoice.invoice', invoiceId, {
            populate: {
                invoice_items: {
                    populate: {
                        student_class: true
                    }
                }
            }
        });
        for (const invoiceItem of invoice.invoice_items) {
            let studentClassData = {};
            if (invoiceItem.student_class.status === 'cancelled') {
                studentClassData = {
                    status: 'cancelled',
                    cancellationPending: false,
                    cancelledDate: DateTime.now().toISO()
                };
            } else {
                studentClassData = {
                    status: 'active',
                    joinedDate: DateTime.now().toISO()
                };
            }
            await strapi.entityService.update(
                'api::student-class.student-class',
                invoiceItem.student_class.id,
                {
                    data: studentClassData
                }
            );      
        }
        await strapi.service('api::student.student').updateStatus(studentId);

        const currentDate = DateTime.now().toISO();
        await strapi.entityService.update('api::invoice.invoice', invoice.id, {
            data: {
                status: 'paid',
                paidDate: currentDate
            }
        });

        if (response.message) {
            if (response.httpCode == 400) {
                return ctx.badRequest(response.message);
            } else if (response.httpCode == 404) {
                return ctx.notFound(response.message);
            } else {
                return ctx.internalServerError(response.message);
            }
        }

        return response;
    },
    //TODO: move it to invoices
    async sendInvoice(ctx, next) {
        const { studentId, invoiceId } = ctx.request.body.data;
        //validate
        if (!studentId) {
            return ctx.badRequest('studentId required');
        }
        if (!invoiceId) {
            return ctx.badRequest('invoiceId required');
        }
        let response = {};
        const invoice = await strapi.entityService.findOne('api::invoice.invoice', invoiceId, {
            populate: {
                invoice_items: {
                    populate: {
                        student_class: true
                    }
                }
            }
        });

        const currentDate = DateTime.now().toISO();
        await strapi.entityService.update('api::invoice.invoice', invoice.id, {
            data: {
                status: 'sent',
                invoiceSentDate: currentDate
            }
        });

        // TODO:add your code to send the email

        if (response.message) {
            if (response.httpCode == 400) {
                return ctx.badRequest(response.message);
            } else if (response.httpCode == 404) {
                return ctx.notFound(response.message);
            } else {
                return ctx.internalServerError(response.message);
            }
        }

        return response;
    },
    //TODO: move it to invoices
    async cancelInvoice(ctx, next) {
        const { studentId, invoiceId } = ctx.request.body.data;
        //validate
        if (!studentId) {
            return ctx.badRequest('studentId required');
        }
        if (!invoiceId) {
            return ctx.badRequest('invoiceId required');
        }
        let response = {};
        const invoice = await strapi.entityService.findOne('api::invoice.invoice', invoiceId, {
            populate: {
                invoice_items: {
                    populate: {
                        student_class: true
                    }
                }
            }
        });
        for (const invoiceItem of invoice.invoice_items) {
            await strapi.entityService.update(
                'api::student-class.student-class',
                invoiceItem.student_class.id,
                {
                    data: {
                        status: 'inactive',
                        cancelledDate: DateTime.now().toISO()
                    }
                }
            );
        }
        const currentDate = DateTime.now().toISO();
        await strapi.entityService.update('api::invoice.invoice', invoice.id, {
            data: {
                status: 'cancelled',
                paidDate: currentDate
            }
        });

        if (response.message) {
            if (response.httpCode == 400) {
                return ctx.badRequest(response.message);
            } else if (response.httpCode == 404) {
                return ctx.notFound(response.message);
            } else {
                return ctx.internalServerError(response.message);
            }
        }

        return response;
    },
    //TODO: move it to invoices
    async getSubjectRate(ctx, next) {
        const {
            studentId,
            yearId, // to check A-Level Activation
            subjectId
        } = ctx.request.query;
        //validate
        if (!studentId) {
            return ctx.badRequest('studentId required');
        }
        if (!subjectId) {
            return ctx.badRequest('subjectId required');
        }
        if (!yearId) {
            return ctx.badRequest('yearId required');
        }

        response = await getSubjectRate({ studentId, yearId, subjectId });
        if (response.message) {
            if (response.httpCode == 400) {
                return ctx.badRequest(response.message);
            } else if (response.httpCode == 404) {
                return ctx.notFound(response.message);
            } else {
                return ctx.internalServerError(response.message);
            }
        }

        return response;
    }
};

async function getSubjectRate(data) {
    const { studentId, yearId, subjectId } = data;

    const subjectRates = [
        {
            subjectsTakenCount: [0, 1],
            amounts: [
                {
                    numberOfLessons: [0, 1],
                    amount: 15
                },
                {
                    numberOfLessons: [2, 3],
                    amount: 12
                },
                {
                    numberOfLessons: [4, 16],
                    amount: 10
                }
            ]
        },
        {
            subjectsTakenCount: [1, 2],
            amounts: [
                {
                    numberOfLessons: [0, 1],
                    amount: 14
                },
                {
                    numberOfLessons: [2, 3],
                    amount: 11
                },
                {
                    numberOfLessons: [4, -1],
                    amount: 10
                }
            ]
        },
        {
            subjectsTakenCount: [3, -1],
            amounts: [
                {
                    numberOfLessons: [0, 1],
                    amount: 13
                },
                {
                    // lessons number range from 2 to 3
                    numberOfLessons: [2, 3],
                    amount: 10
                },
                {
                    // lessons number range from 4 and greater
                    numberOfLessons: [4, -1],
                    amount: 10
                }
            ]
        }
    ];

    const subjectPriceCalculator = new SubjectPriceCalculator(subjectRates);
    if (await isALevelYear(strapi, yearId)) {
        subjectPriceCalculator.enableALevel();
    }
    const parentSubjectId = (await getParentSubjectIfExists(strapi, subjectId)) || subjectId;
    const subjectsTakenCount = (await getStudentSubjectsCountTaken(strapi, studentId)) || 1;
    subjectPriceCalculator.setSubjectsTakenCount(subjectsTakenCount);
    const subjectLessonsCount =
        (await getSubjectLessonsCount(strapi, studentId, parentSubjectId)) || 1;
    return {
        hourlyRate: subjectPriceCalculator.getHourlyRate(subjectLessonsCount),
        weeklyRate: subjectPriceCalculator.getWeeklyRate(subjectLessonsCount),
        monthlyRate: subjectPriceCalculator.getMonthlyRate(subjectLessonsCount)
    };
}

async function getParentSubjectIfExists(strapi, subjectId) {
    const subjectEntity = await strapi.entityService.findOne(
        'api::subject.subject',
        subjectId?.toString(),
        {
            populate: {
                parent_subject: {
                    fields: ['id', 'name']
                }
            }
        }
    );
    return subjectEntity?.parent_subject?.id;
}

async function isALevelYear(strapi, yearId) {
    const year = strapi.entityService.findOne('api::year.year', yearId.toString(), {
        fields: ['shortName', 'isALevels']
    });
    return year.isALevels;
}

async function getStudentSubjectsCountTaken(strapi, studentId) {
    const essentialSubjectsEntities = await getEssentialSubjects(strapi);
    const essentialSubjectsEntitiesIds = essentialSubjectsEntities?.map(
        (essentialSubjectsEntity) => {
            return essentialSubjectsEntity.id;
        }
    );
    const studentClassesEntries = await strapi.entityService.findMany(
        'api::student-class.student-class',
        {
            filters: {
                student: {
                    id: {
                        $eq: studentId?.toString()
                    }
                },
                subject: {
                    $or: [
                        {
                            parent_subject: {
                                id: {
                                    $in: essentialSubjectsEntitiesIds
                                }
                            }
                        },
                        {
                            id: {
                                $in: essentialSubjectsEntitiesIds
                            }
                        }
                    ]
                },
                type: {
                    $eq: 'booking'
                },
                status: {
                    $eq: 'active'
                }
            },
            populate: {
                subject: {
                    parent_subject: {
                        fields: ['id', 'name']
                    }
                }
            }
        }
    );

    const studentClassesHasLessonsAlreadyTakenOnly = [];
    for (const studentClass of studentClassesEntries) {
        const registerStudents = await strapi.entityService.findMany(
            'api::register-student.register-student',
            {
                filters: {
                    student_class: {
                        id: {
                            $eq: studentClass.id
                        }
                    }
                }
            }
        );
        if (registerStudents.length > 0) {
            studentClassesHasLessonsAlreadyTakenOnly.push(studentClass);
        }
    }

    // group student classes by subjects
    const essentialSubjectsTaken = new Map();
    for (const studentClass of studentClassesHasLessonsAlreadyTakenOnly) {
        const subjectName =
            studentClass.subject?.parent_subject?.name || studentClass.subject?.name;
        if (!essentialSubjectsTaken.has(subjectName)) {
            essentialSubjectsTaken.set(subjectName, 0);
        }
        essentialSubjectsTaken.set(subjectName, essentialSubjectsTaken.get(subjectName) + 1);
    }
    return essentialSubjectsTaken.size;
}

async function getEssentialSubjects(strapi) {
    const essentialSubjectsEntities = await strapi.entityService.findMany('api::subject.subject', {
        fields: ['id', 'name'],
        filters: {
            name: {
                $in: ['Maths', 'English', 'Science']
            }
        }
    });
    return essentialSubjectsEntities;
}

async function getSubjectLessonsCount(strapi, studentId, subjectId) {
    const studentClassesEntries = await strapi.entityService.findMany(
        'api::student-class.student-class',
        {
            filters: {
                student: {
                    id: {
                        $eq: studentId?.toString()
                    }
                },
                subject: {
                    $or: [
                        {
                            id: {
                                $eq: subjectId?.toString()
                            }
                        },
                        {
                            parent_subject: {
                                id: {
                                    $eq: subjectId?.toString()
                                }
                            }
                        }
                    ]
                },
                type: {
                    $eq: 'booking'
                },
                status: {
                    $eq: 'active'
                }
            },
            populate: {
                subject: {
                    parent_subject: {
                        fields: ['id', 'name']
                    }
                }
            }
        }
    );
    // get only lessons the student already taken
    return studentClassesEntries.length;
}

function SubjectPriceCalculator(subjectRates) {
    let isALevelEnabled = false;
    let ALevelRate = 1.5;
    let weeklyPremiumRate = 0.2;
    // because few months has extra days 31 and others 30
    // so the month weeks count will be calculated on 4.5 instead of 4 weeks
    let monthlyPaidFixedRate = 4.5;

    // this data should be has it's own table later
    let subjectCountsToLessonsCounts = subjectRates;
    let subjectsTakenCount = null;
    this.setSubjectsTakenCount = (count) => {
        subjectsTakenCount = count;
        return this;
    };
    this.enableALevel = () => {
        isALevelEnabled = true;
        return this;
    };
    this.disableALevel = () => {
        isALevelEnabled = false;
        return this;
    };
    this.getHourlyRate = (lessonsCount) => {
        const subjectCountsToLessonsCount = subjectCountsToLessonsCounts.find(
            (_subjectCountsToLessonsCount) =>
                (_subjectCountsToLessonsCount.subjectsTakenCount[0] <= subjectsTakenCount &&
                    _subjectCountsToLessonsCount.subjectsTakenCount[1] >= subjectsTakenCount) ||
                (_subjectCountsToLessonsCount.subjectsTakenCount[0] <= subjectsTakenCount &&
                    _subjectCountsToLessonsCount.subjectsTakenCount[1] === -1)
        );
        if (!subjectCountsToLessonsCount) return null;
        return subjectCountsToLessonsCount.amounts.find((_amount) => {
            return (
                (lessonsCount >= _amount.numberOfLessons[0] &&
                    lessonsCount <= _amount.numberOfLessons[1]) ||
                (lessonsCount >= _amount.numberOfLessons[0] && _amount.numberOfLessons[1] === -1)
            );
        })?.amount;
    };
    this.getMonthlyRate = (lessonsCount) => {
        const rate = this.getHourlyRate(lessonsCount);
        let total = rate * lessonsCount * monthlyPaidFixedRate;
        if (isALevelEnabled) {
            total *= ALevelRate;
        }
        return total;
    };
    this.getWeeklyRate = (lessonsCount) => {
        const rate = this.getHourlyRate(lessonsCount);
        let total = (rate * lessonsCount) / (1 - weeklyPremiumRate);
        if (isALevelEnabled) {
            total *= ALevelRate;
        }
        return total;
    };
}
