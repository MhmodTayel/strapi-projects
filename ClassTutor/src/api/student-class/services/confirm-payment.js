const { DateTime } = require('luxon');
const _ = require('lodash');
const { parseDate, getTodayDate } = require('../../../../utils/datetime-utils');

const confirmPayment = async (strapi, studentId, payments) => {
    return await strapi.db.transaction(async () => {
        for (const payment of payments) {
            let paymentSubscription;
            if (payment.parentId) {
                paymentSubscription = await updateOrCreatePaymentSubscription(strapi, studentId, payment);
            }
            // it will be uses to create an invoice only for these ids.
            const payableStudentClassesIds = [];

            for (const paymentSubscriptionItem of payment.items) {
                if (isNewPaymentSubscriptionItem(paymentSubscriptionItem)) {
                    const studentClass = await onNewPaymentSubscription(
                        strapi,
                        studentId,
                        payableStudentClassesIds,
                        payment,
                        paymentSubscription,
                        paymentSubscriptionItem
                    );
                    if (paymentSubscriptionItem?.agents) {
                        await linkAgentsToStudent(strapi, studentClass.id, paymentSubscriptionItem?.agents);
                    }
                    if (studentClass.type === 'booking') {
                        await strapi
                            .service('api::student-class.student-class-events')
                            .bookingClassBookedEvent(strapi, studentClass.id, paymentSubscription?.id);
                    } else if (studentClass.type === 'trial') {
                        await strapi
                            .service('api::student-class.student-class-events')
                            .trialClassBookedEvent(strapi, studentClass.id);
                    }
                    const createdStudentClass = await strapi.entityService.findOne(
                        'api::student-class.student-class',
                        studentClass.id,
                        {
                            populate: ['class']
                        }
                    );
                    await strapi
                        .service('api::register.register')
                        .updateStudentRegistersForClass(createdStudentClass.class);
                } else {
                    await onUpdateOrCancelSubscription(
                        strapi,
                        studentId,
                        payableStudentClassesIds,
                        payment,
                        paymentSubscription,
                        paymentSubscriptionItem
                    );
                }
            }

            // disabled for next release please check out this task https://dev.azure.com/classtutor/ClassTutor/_workitems/edit/1528
            // await onCreateInvoice(
            //     strapi,
            //     studentId,
            //     payment,
            //     payableStudentClassesIds,
            //     payments,
            //     paymentSubscription
            // );
        }

        await strapi.service('api::student.student').updateStatus(studentId);

        return true;
    });
};

async function updateOrCreatePaymentSubscription(strapi, studentId, payment) {
    const paymentSubscription = await getPaymentSubscriptionOrCreate(
        strapi,
        studentId,
        payment.parentId,
        payment.firstPaymentDate
    );

    if (paymentSubscription) {
        await strapi.entityService.update('api::payment-subscription.payment-subscription', paymentSubscription?.id, {
            data: {
                paymentDate: payment.firstPaymentDate ?? paymentSubscription?.paymentDate,
                invoiceDate: payment.invoiceDate ?? paymentSubscription?.invoiceDate
            }
        });
    }
    return paymentSubscription;
}

async function onUpdateOrCancelSubscription(
    strapi,
    studentId,
    payableStudentClassesIds,
    payment,
    paymentSubscription,
    paymentSubscriptionItem
) {
    studentClass = await updateStudentClass(strapi, studentId, payment.parentId, paymentSubscriptionItem);
    if (paymentSubscriptionItem?.agents?.length) {
        await linkAgentsToStudent(strapi, studentClass?.id, paymentSubscriptionItem?.agents);
    }
    if (paymentSubscriptionItem.status === 'cancelled') {
        await cancelStudentClass(strapi, paymentSubscriptionItem.studentClassId);
    } else {
        paymentSubscriptionItem.studentClassId = studentClass.id;
        // delete the old payment subscriptions if exists
        const oldPaymentSubscriptions = await strapi.entityService.findMany(
            'api::payment-subscription-item.payment-subscription-item',
            {
                filters: {
                    student_class: paymentSubscriptionItem.studentClassId
                }
            }
        );
        if (oldPaymentSubscriptions.length) {
            await strapi.entityService.delete(
                'api::payment-subscription-item.payment-subscription-item',
                oldPaymentSubscriptions[0].id
            );
        }
        //
        if (paymentSubscription) {
            await storePaymentSubscriptionItem(strapi, paymentSubscription.id, paymentSubscriptionItem);
        }

        if (isPaymentSubscriptionItemForAPayableStudentClass(paymentSubscriptionItem)) {
            payableStudentClassesIds.push(studentClass.id);
        }
    }
    const createdStudentClass = await strapi.entityService.findOne(
        'api::student-class.student-class',
        studentClass.id,
        {
            populate: ['class']
        }
    );
    await strapi.service('api::register.register').updateStudentRegistersForClass(createdStudentClass.class);
}

/**
 * it returns the new student class that created
 * @param {*} strapi
 * @param {*} payableStudentClassesIds
 * @param {*} payment
 * @param {*} paymentSubscription
 * @param {*} paymentSubscriptionItem
 * @returns
 */
async function onNewPaymentSubscription(
    strapi,
    studentId,
    payableStudentClassesIds,
    payment,
    paymentSubscription,
    paymentSubscriptionItem
) {
    studentClass = await storeStudentClass(strapi, studentId, payment.parentId, paymentSubscriptionItem);
    paymentSubscriptionItem.studentClassId = studentClass.id;
    await storePaymentSubscriptionItem(strapi, paymentSubscription.id, paymentSubscriptionItem);
    if (isPaymentSubscriptionItemForAPayableStudentClass(paymentSubscriptionItem)) {
        payableStudentClassesIds.push(studentClass.id);
    }
    return studentClass;
}

async function onCreateInvoice(strapi, studentId, payment, payableStudentClassesIds, payments, paymentSubscription) {
    if (!payableStudentClassesIds.length) return;
    // creating the invoice
    const shouldCreateAnInvoice = _.toArray(payments).find((payment) => {
        const hasABookingStudentClass = _.toArray(payment.items).find((item) => {
            return item.type === 'booking' && !['cancelled', 'updated'].includes(item.status);
        });
        return hasABookingStudentClass;
    });
    if (shouldCreateAnInvoice) {
        const _paymentSubscription = await strapi.entityService.findOne(
            'api::payment-subscription.payment-subscription',
            paymentSubscription.id,
            {
                populate: '*'
            }
        );
        // create a new invoice for only the new or the services had changed.
        const _paymentSubscriptionItems = await strapi.entityService.findMany(
            'api::payment-subscription-item.payment-subscription-item',
            {
                filters: {
                    payment_subscription: _paymentSubscription.id,
                    student_class: {
                        id: {
                            $in: payableStudentClassesIds.filter((e) => {
                                const subscriptionItem = payment.items.find(
                                    (x) => x.studentClassId?.toString() === e?.toString()
                                );
                                return subscriptionItem.status !== 'updated';
                            })
                        }
                    }
                },
                populate: '*'
            }
        );
        const createdInvoiceId = await createAnInvoice(
            strapi,
            studentId,
            _paymentSubscription,
            _paymentSubscriptionItems
        );
        await strapi.service('api::student-class.student-class-events').invoiceCreatedEvent(strapi, createdInvoiceId);
    }
}

async function updateStudentClass(strapi, studentId, parentId, paymentSubscriptionItem) {
    let studentClassId = paymentSubscriptionItem.studentClassId;
    if (!studentClassId) return false;

    const oldStudentClass = await strapi.entityService.findOne('api::student-class.student-class', studentClassId, {
        populate: ['student', 'class.subject', 'class.teacher', 'class.year', 'billing_parent']
    });

    const studentClassLogData = {
        student_class: oldStudentClass?.id,
        previousRawData: JSON.stringify(oldStudentClass),
        name: oldStudentClass?.student?.studentId,
        status: oldStudentClass.status
    };

    const oldRegister = await strapi.entityService.findOne('api::register.register', oldStudentClass?.id, {
        populate: ['student', 'class.subject', 'class.year', 'register_students', 'teacher']
    });

    let currentStudentClass = null;

    const name = (await getStudentById(strapi, studentId)).studentId;

    const oldStudentClassItem = (
        await strapi.entityService.findMany('api::payment-subscription-item.payment-subscription-item', {
            populate: ['student_class'],
            filters: {
                student_class: oldStudentClass.id
            }
        })
    )?.at(0);

    const isPostpone =
        !oldStudentClass.postponeDate &&
        paymentSubscriptionItem.status === 'postpone' &&
        !!paymentSubscriptionItem.postponeDate;

    const cancellingPostpone = !!oldStudentClass.postponeDate && !paymentSubscriptionItem.postponeDate;

    const isCancelling =
        oldStudentClass.status !== 'cancelled' && ['cancelled', 'inactive'].includes(paymentSubscriptionItem.status);

    const isStudentClassTypeChanged =
        !!paymentSubscriptionItem.type && paymentSubscriptionItem.type !== oldStudentClass.type;

    const latestStudentClassType = isStudentClassTypeChanged ? paymentSubscriptionItem.type : oldStudentClass.type;

    const latestStudentClassStatus =
        paymentSubscriptionItem.status && paymentSubscriptionItem.status !== 'postpone'
            ? paymentSubscriptionItem.status
            : oldStudentClass.status;

    const isSettingAsActive =
        oldStudentClass.status !== 'active' &&
        paymentSubscriptionItem.status === 'active' &&
        latestStudentClassType === 'booking';

    const createReplication = oldStudentClass.type === 'trial' && paymentSubscriptionItem.type === 'booking';

    let isCancellingNewSubscription = false;

    let data = {
        name,
        year: paymentSubscriptionItem.yearId,
        subject: paymentSubscriptionItem.subjectId,
        student_scholarship: paymentSubscriptionItem.scholarshipId,
        class: paymentSubscriptionItem.classId,
        payment: paymentSubscriptionItem.totalRate,
        status: latestStudentClassStatus,
        cancellationPending:
            paymentSubscriptionItem.cancellationPending === null
                ? paymentSubscriptionItem.cancellationPending
                : oldStudentClass?.cancellationPending,
        cancellationRequestDate:
            paymentSubscriptionItem.cancellationRequestDate === null
                ? paymentSubscriptionItem.cancellationRequestDate
                : oldStudentClass?.cancellationRequestDate,
        classType: paymentSubscriptionItem.classType || oldStudentClass.classType
    };

    if (paymentSubscriptionItem?.paymentFrequency) {
        data.paymentFrequency = paymentSubscriptionItem?.paymentFrequency;
    }

    if (parentId) {
        data.billing_parent = parentId;
    }

    if (isStudentClassTypeChanged) {
        data.type = latestStudentClassType;
    }

    if (isPostpone) {
        data.postponeDate = DateTime.fromJSDate(new Date(paymentSubscriptionItem.postponeDate)).toISO();
        data.postponeReason = paymentSubscriptionItem.postponeReason;
    }

    if (cancellingPostpone) {
        data.postponeDate = null;
    }

    if (paymentSubscriptionItem.reasonToChange) {
        data.changeReason = paymentSubscriptionItem.reasonToChange;
    }
    if (paymentSubscriptionItem.startAt) {
        if (latestStudentClassType === 'booking') {
            data.trialDate = null;
            data.classDate = DateTime.fromFormat(
                paymentSubscriptionItem.startAt || oldStudentClass.classDate,
                'yyyy-MM-dd'
            ).toISO();
        } else {
            data.trialDate = DateTime.fromFormat(
                paymentSubscriptionItem.startAt || oldStudentClass.trialDate,
                'yyyy-MM-dd'
            ).toISO();
            data.classDate = null;
        }
    }

    if (isSettingAsActive) {
        data.status = 'active';
        data.joinedDate = DateTime.now().toISO();
    }

    if (isCancelling) {
        const cancellationDate =
            DateTime.fromFormat(paymentSubscriptionItem.date, 'yyyy-MM-dd').toISO() || DateTime.now().toISO();

        data = {
            ...data,
            cancelReason: paymentSubscriptionItem.statusReason,
            changeReason: oldStudentClass.changeReason,
            cancellationRequestDate: cancellationDate,
            cancellationPending: latestStudentClassType === 'booking'
        };

        if (latestStudentClassType === 'trial') {
            data.status = 'inactive';
            data.cancelledDate = cancellationDate;
        } else {
            data.status = oldStudentClass.status;
        }

        if (oldStudentClass.status === 'new') {
            isCancellingNewSubscription = true;
        }
    }

    if (oldStudentClassItem) {
        oldStudentClass.paymentSubscription = _.first(
            await strapi.entityService.findMany('api::payment-subscription.payment-subscription', {
                filters: {
                    student_class: oldStudentClass.id
                },
                populate: ['payment_subscription_items']
            })
        );

        await strapi.entityService.update(
            'api::payment-subscription-item.payment-subscription-item',
            oldStudentClassItem.id,
            {
                data: {
                    multiClassDiscount: paymentSubscriptionItem?.multiClassDiscount,
                    scholarshipDiscount: paymentSubscriptionItem?.scholarshipDiscount,
                    managementDiscount: paymentSubscriptionItem?.managementDiscount,
                    classRate: paymentSubscriptionItem?.totalRate,
                    total: paymentSubscriptionItem?.monthly
                }
            }
        );
    }

    if (createReplication) {
        // delete the old student class invoice item
        const invoiceItem = _.first(
            await strapi.entityService.findMany('api::invoice-item.invoice-item', {
                filters: {
                    student_class: {
                        id: studentClassId
                    }
                },
                populate: ['invoice']
            })
        );
        if (invoiceItem?.invoice?.status === 'new') {
            await strapi.entityService.delete('api::invoice-item.invoice-item', invoiceItem.id);

            const invoiceItems = await strapi.entityService.findMany('api::invoice-item.invoice-item', {
                filters: {
                    invoice: {
                        id: invoiceItem?.invoice?.id
                    }
                }
            });
            if (!invoiceItems?.length) {
                await strapi.entityService.update('api::invoice.invoice', invoiceItem.invoice.id, {
                    data: {
                        status: 'cancelled'
                    }
                });
            }
        }

        await strapi.entityService.update('api::student-class.student-class', studentClassId, {
            data: {
                status: oldStudentClass?.type === 'trial' ? 'inactive' : 'cancelled',
                changeReason: paymentSubscriptionItem.statusReason,
                cancelledDate: oldStudentClass?.type === 'trial' ? data.cancellationRequestDate : null,
                cancellationPending: oldStudentClass?.type === 'booking'
            }
        });

        const createdStudentClass = await strapi.entityService.create('api::student-class.student-class', {
            data: {
                ...data,
                status: latestStudentClassStatus,
                student: studentId,
                changeReason: null
            }
        });

        studentClassId = createdStudentClass.id;
    } else {
        await strapi.entityService.update('api::student-class.student-class', _.toNumber(oldStudentClass.id), {
            data
        });
    }

    currentStudentClass = await strapi.entityService.findOne('api::student-class.student-class', studentClassId, {
        populate: ['student', 'class', 'billing_parent']
    });

    /**
     * ignore when cancelling a new subscription which doesn't has associated class yet
     */
    if (!isCancellingNewSubscription) {
        await updateStudentClassLessons(strapi, oldStudentClass, currentStudentClass);
    }

    if (isCancelling) {
        if (currentStudentClass.type === 'trial') {
            await strapi
                .service('api::student-class.student-class-events')
                .trialClassCancelledEvent(strapi, studentClassId);
        }
    } else if (createReplication) {
        await strapi
            .service('api::student-class.student-class-events')
            .subscriptionUpgradedEvent(strapi, oldStudentClass.id, studentClassId);
    } else if (isSettingAsActive) {
        await strapi
            .service('api::student-class.student-class-events')
            .subscriptionActivatedEvent(strapi, studentClassId);
    } else if (isPostpone) {
        await strapi
            .service('api::student-class.student-class-events')
            .subscriptionPostponeEvent(strapi, studentClassId);
    } else if (cancellingPostpone) {
        await strapi
            .service('api::student-class.student-class-events')
            .subscriptionPostponeCancelledEvent(strapi, studentClassId);
    } else {
        if (oldStudentClass.type === 'booking') {
            await strapi
                .service('api::student-class.student-class-events')
                .bookingClassChangedEvent(strapi, studentClassId, oldStudentClass);
        } else if (oldStudentClass.type === 'trial') {
            await strapi
                .service('api::student-class.student-class-events')
                .trialClassChangedEvent(strapi, studentClassId, oldStudentClass);
        }
    }

    const latestStudentClassVersion = await strapi.entityService.findOne(
        'api::student-class.student-class',
        studentClassId,
        {
            populate: ['student', 'class', 'billing_parent']
        }
    );

    studentClassLogData.rawData = JSON.stringify(latestStudentClassVersion);

    await strapi.entityService.create('api::student-class-log.student-class-log', {
        data: studentClassLogData
    });

    return latestStudentClassVersion;
}

async function storeStudentClass(strapi, studentId, parentId, paymentSubscriptionItem) {
    const name = (await getStudentById(strapi, studentId)).studentId;
    const studentClassData = {
        name,
        student: studentId,
        type: paymentSubscriptionItem.type,
        year: paymentSubscriptionItem.yearId,
        subject: paymentSubscriptionItem.subjectId,
        student_scholarship: paymentSubscriptionItem.scholarshipId,
        class: paymentSubscriptionItem.classId,
        payment: paymentSubscriptionItem.totalRate,
        classType: paymentSubscriptionItem.classType
    };

    if (paymentSubscriptionItem?.paymentFrequency) {
        studentClassData.paymentFrequency = paymentSubscriptionItem?.paymentFrequency;
    }

    if (parentId) {
        studentClassData.billing_parent = parentId;
    }

    if (paymentSubscriptionItem.reasonToChange) {
        studentClassData.changeReason = paymentSubscriptionItem.reasonToChange;
    }
    if (paymentSubscriptionItem.type === 'booking') {
        studentClassData.trialDate = null;
        studentClassData.classDate = DateTime.fromFormat(paymentSubscriptionItem.startAt, 'yyyy-MM-dd').toISO();
        studentClassData.status = 'firstPaymentPending';
    } else {
        studentClassData.classDate = null;
        studentClassData.trialDate = DateTime.fromFormat(paymentSubscriptionItem.startAt, 'yyyy-MM-dd').toISO();
        studentClassData.status = 'trial';
    }
    const createdStudentClass = await strapi.entityService.create('api::student-class.student-class', {
        data: studentClassData
    });
    await onStudentClassCreated(strapi, createdStudentClass.id, paymentSubscriptionItem.agents);
    return createdStudentClass;
}

function isPaymentSubscriptionItemForAPayableStudentClass(paymentSubscriptionItem) {
    return paymentSubscriptionItem.type === 'booking' && paymentSubscriptionItem.status !== 'cancelled';
}

function isNewPaymentSubscriptionItem(paymentSubscriptionItem) {
    return (
        !paymentSubscriptionItem.studentClassId ||
        (paymentSubscriptionItem.studentClassId === '' &&
            (!paymentSubscriptionItem?.paymentSubscriptionItemId ||
                paymentSubscriptionItem?.paymentSubscriptionItemId === ''))
    );
}

async function getPaymentSubscriptionOrCreate(strapi, studentId, parentId, firstPaymentDate, invoiceDate) {
    let paymentSubscription = await getPaymentSubscription(strapi, studentId, parentId, firstPaymentDate);
    if (!paymentSubscription) {
        paymentSubscription = await createPaymentSubscription(
            strapi,
            studentId,
            parentId,
            firstPaymentDate,
            invoiceDate
        );
        paymentSubscription = await getPaymentSubscription(strapi, studentId, parentId, firstPaymentDate);
    }

    return paymentSubscription;
}

async function createPaymentSubscription(strapi, studentId, parentId, firstPaymentDate, invoiceDate) {
    const name = (await getStudentById(strapi, studentId)).studentId;
    const paymentSubscription = await strapi.entityService.create('api::payment-subscription.payment-subscription', {
        data: {
            name,
            billing_parent: parentId,
            student: studentId,
            paymentDate: firstPaymentDate ?? 1,
            invoiceDate: invoiceDate ?? null
        }
    });
    return paymentSubscription;
}

async function getPaymentSubscription(strapi, studentId, parentId, firstPaymentDate) {
    const paymentSubscriptions = await strapi.entityService.findMany('api::payment-subscription.payment-subscription', {
        filters: {
            student: studentId,
            billing_parent: parentId,
            paymentDate: firstPaymentDate ?? 1
        },
        populate: '*'
    });
    return paymentSubscriptions[0];
}

async function storePaymentSubscriptionItem(strapi, paymentSubscriptionId, paymentSubscriptionItem) {
    const paymentSubscription = await strapi.entityService.findOne(
        'api::payment-subscription.payment-subscription',
        paymentSubscriptionId,
        {
            populate: {
                student: true
            }
        }
    );
    const name = paymentSubscription.student.studentId;
    const createdPaymentSubscriptionItem = await strapi.entityService.create(
        'api::payment-subscription-item.payment-subscription-item',
        {
            data: {
                payment_subscription: paymentSubscription.id,
                name,
                student_class: paymentSubscriptionItem.studentClassId,
                student: paymentSubscription.student.id,
                paymentDate: paymentSubscription.firstPaymentDate,
                invoiceDate: paymentSubscription.invoiceDate,
                multiClassDiscount: paymentSubscriptionItem.multiClassDiscount,
                scholarshipDiscount: paymentSubscriptionItem.scholarshipDiscount,
                managementDiscount: paymentSubscriptionItem.managementDiscount,
                classRate: paymentSubscriptionItem.totalRate,
                total: paymentSubscriptionItem.monthly
            }
        }
    );
    return createdPaymentSubscriptionItem.id;
}

async function createAnInvoice(strapi, studentId, paymentSubscription, paymentSubscriptionItems) {
    const invoiceIdentifier = (await getStudentById(strapi, paymentSubscription.student.id)).studentId;
    let amount = 0;
    _.toArray(paymentSubscriptionItems).forEach((e) => {
        amount += e.total;
    });
    let invoiceDueDate = DateTime.fromFormat(paymentSubscriptionItems[0].student_class.classDate, 'yyyy-MM-dd');

    const invoiceData = {
        name: invoiceIdentifier,
        invoiceIdentifier,
        student: studentId,
        billing_parent: paymentSubscription.billing_parent.id,
        paymentIdentifier: paymentSubscription.name,
        amount,
        status: 'new',
        dueDate: invoiceDueDate.toISO()
    };
    const invoice = await strapi.entityService.create('api::invoice.invoice', {
        data: invoiceData
    });
    for (const paymentSubscriptionItem of paymentSubscriptionItems) {
        const studentClassDate = DateTime.fromFormat(paymentSubscriptionItem.student_class.classDate, 'yyyy-MM-dd');
        if (invoiceDueDate.diff(studentClassDate) >= 0) {
            invoiceDueDate = studentClassDate;
        }
        const invoiceItemIdentifier = (await getStudentById(strapi, studentId)).studentId;
        const invoiceItemData = {
            name: invoiceItemIdentifier,
            multiClassDiscount: paymentSubscriptionItem.multiClassDiscount,
            scholarshipDiscount: paymentSubscriptionItem.scholarshipDiscount,
            managementDiscount: paymentSubscriptionItem.managementDiscount,
            classRate: paymentSubscriptionItem.classRate,
            total: paymentSubscriptionItem.total,
            student_class: paymentSubscriptionItem.student_class.id,
            invoice: invoice.id
        };
        const invoiceItem = await strapi.entityService.create('api::invoice-item.invoice-item', {
            data: invoiceItemData
        });
    }
    await strapi.entityService.update('api::invoice.invoice', invoice.id, {
        data: {
            dueDate:
                invoiceDueDate.startOf('day').minus({ days: 2 }).diff(DateTime.now()) >= 0
                    ? invoiceDueDate.startOf('day').minus({ days: 2 }).toISO()
                    : invoiceDueDate.startOf('day').toISO()
        }
    });
    return invoice.id;
}

async function getStudentById(strapi, studentId) {
    return await strapi.entityService.findOne('api::student.student', studentId);
}

async function cancelStudentClass(strapi, studentClassId) {
    //get student class payment subscription
    // get it's invoice and invoice item
    // add the invoice item total to the invoice refound
    // delete the invoice item
    // delete any payment subscription for that student class.
    const studentClassInvoiceItem = _.first(
        (await strapi.entityService.findMany('api::invoice-item.invoice-item', {
            filters: {
                student_class: {
                    id: {
                        $eq: studentClassId
                    }
                }
            },
            populate: {
                invoice: true
            }
        })) || []
    );
    if (studentClassInvoiceItem) {
        if (['new', 'sent'].includes(studentClassInvoiceItem.invoice.status)) {
            await strapi.entityService.update('api::invoice.invoice', studentClassInvoiceItem.invoice.id, {
                data: {
                    status: 'cancelled'
                }
            });
        }
        await strapi
            .service('api::student-class.student-class-events')
            .invoiceCancelledEvent(strapi, studentClassInvoiceItem.invoice.id);
        // await removePaymentSubscription(strapi, studentClassId);
    }
}

async function removePaymentSubscription(strapi, studentClassId) {
    const paymentSubscription = _.first(
        (await strapi.entityService.findMany('api::payment-subscription-item.payment-subscription-item', {
            filters: {
                student_class: {
                    id: {
                        $eq: studentClassId
                    }
                }
            }
        })) || []
    );
    if (paymentSubscription) {
        await strapi.entityService.delete(
            'api::payment-subscription-item.payment-subscription-item',
            paymentSubscription.id
        );
    }
    return true;
}

/**
 * create a new register student class
 * @param {*} strapi
 * @param {*} studentClassId the created student class
 * @param {string[]} agents should be used in the next version
 */
async function onStudentClassCreated(strapi, studentClassId, agents) {
    const studentClass = await strapi.entityService.findOne('api::student-class.student-class', studentClassId, {
        populate: {
            class: true,
            student: true
        }
    });

    var student = await strapi.entityService.findOne('api::student.student', studentClass.student.id, {
        populate: ['agents']
    });

    if (studentClass.trialDate && studentClass.class && studentClass.status == 'trial') {
        const registers = await strapi.entityService.findMany('api::register.register', {
            filters: {
                classDate: studentClass.trialDate,
                class: studentClass.class
            },
            limit: 1,
            populate: ['class']
        });
        for (const register of registers) {
            await strapi.entityService.create('api::register-student.register-student', {
                data: {
                    name: student.studentId + ' ' + register.class.classId + ' ' + register.classDate,
                    student: student.id,
                    register: register.id,
                    freeTrial: studentClass.type === 'trial',
                    student_class: studentClassId
                }
            });
        }
    }
}

/**
 * update the register student for the student class.
 * @param {*} strapi
 * @param {*} previousStudentClass should populate the student and class
 * @param {*} currentStudentClass should populate the student and class
 */
async function updateStudentClassLessons(strapi, previousStudentClass, currentStudentClass) {
    const registers = await strapi.entityService.findMany('api::register.register', {
        filters: {
            classDate: {
                $in: [currentStudentClass.trialDate, currentStudentClass.classDate]
            },
            limit: 1,
            class: currentStudentClass.class.id
        },
        populate: ['class', 'register_student']
    });

    // same trial but trial date is changed
    const isOnlyTrialDateChanged =
        previousStudentClass.status == 'trial' &&
        currentStudentClass.status == 'trial' &&
        currentStudentClass.trialDate &&
        parseDate(currentStudentClass.trialDate) != parseDate(previousStudentClass.trialDate);

    const isChangedFromNewToTrial = previousStudentClass.status == 'new' && currentStudentClass.status == 'trial';

    if (isOnlyTrialDateChanged || isChangedFromNewToTrial) {
        // cancel previous trial record as the date has changed
        const previousRegisterStudents = await strapi.entityService.findMany('api::register-student.register-student', {
            filters: {
                student: currentStudentClass.student.id,
                freeTrial: true,
                student_class: previousStudentClass.id
            },
            populate: ['register']
        });

        for (const registerStudent of previousRegisterStudents) {
            if (
                parseDate(registerStudent.register.classDate) >= getTodayDate() &&
                !['cancelled', 'completed'].includes(registerStudent.register.status) &&
                registerStudent.register.classDate == previousStudentClass.trialDate
            ) {
                await strapi.entityService.update('api::register-student.register-student', registerStudent.id, {
                    data: {
                        freeTrialCancelled: true
                    }
                });
            }
        }
        // create a new register student
        for (const register of registers) {
            await strapi.entityService.create('api::register-student.register-student', {
                data: {
                    name:
                        currentStudentClass.student.studentId + ' ' + register.class.classId + ' ' + register.classDate,
                    student: currentStudentClass.student.id,
                    register: register.id,
                    freeTrial: true,
                    student_class: currentStudentClass.id
                }
            });
        }
    }
}

/**
 * update student status
 * @param {*} strapi
 * @param {*} studentId student id
 */

async function linkAgentsToStudent(strapi, studentClassId, agents) {
    const allAgents = [...agents];
    const studentClass = (
        await strapi.entityService.findMany('api::student-class.student-class', {
            filters: {
                id: studentClassId
            },
            populate: ['student.agents']
        })
    )?.at(0);

    allAgents.push(...studentClass?.student.agents?.map((e) => e.id));

    await strapi.entityService.update('api::student.student', studentClass?.student?.id, {
        data: {
            agents: allAgents?.map((e) => _.toNumber(e))
        }
    });

    await strapi.entityService.update('api::student-class.student-class', studentClassId, {
        data: {
            agents: allAgents?.map((e) => _.toNumber(e))
        }
    });
}

async function onPaymentSubscriptionUpdated(strapi, paymentSubscriptionItemId) {
    const paymentSubscriptionItem = await strapi.entityService.findOne(
        'api::payment-subscription-item.payment-subscription-item',
        paymentSubscriptionItemId,
        {
            populate: {
                student_class: {
                    fields: ['id'],
                    populate: {
                        student: {
                            fields: ['id', 'studentId']
                        }
                    }
                }
            }
        }
    );
    const studentClassId = paymentSubscriptionItem?.student_class?.id?.toString();
    let invoiceItem = await strapi.entityService.findMany('api::invoice-item.invoice-item', {
        populate: {
            invoice: {
                fields: ['id'],
                populate: {
                    invoice_items: {
                        populate: {
                            student_class: {
                                fields: ['id']
                            }
                        }
                    }
                }
            },
            student_class: {
                fields: ['id']
            }
        },
        filters: {
            student_class: studentClassId,
            invoice: {
                status: {
                    $in: ['new', 'sent']
                }
            }
        }
    });

    if (!invoiceItem?.length) return;

    invoiceItem = _.toArray(invoiceItem).at(0);

    await strapi.entityService.update('api::invoice-item.invoice-item', invoiceItem.id, {
        data: {
            multiClassDiscount: paymentSubscriptionItem.multiClassDiscount,
            scholarshipDiscount: paymentSubscriptionItem.scholarshipDiscount,
            managementDiscount: paymentSubscriptionItem.managementDiscount,
            classRate: paymentSubscriptionItem.classRate,
            total: paymentSubscriptionItem.total
        }
    });

    const invoiceItems = invoiceItem.invoice.invoice_items.filter(
        (x) => x.student_class.id.toString() !== invoiceItem.student_class.id?.toString()
    );

    invoiceItems.push({
        multiClassDiscount: paymentSubscriptionItem.multiClassDiscount,
        scholarshipDiscount: paymentSubscriptionItem.scholarshipDiscount,
        managementDiscount: paymentSubscriptionItem.managementDiscount,
        classRate: paymentSubscriptionItem.classRate,
        total: paymentSubscriptionItem.total,
        student_class: paymentSubscriptionItem.student_class.id,
        name: paymentSubscriptionItem.student_class.student.studentId
    });

    const total = _.toArray(invoiceItems).reduce((prev, next) => prev.total + next.total, {
        total: 0
    });

    await strapi.entityService.update('api::invoice.invoice', invoiceItem.invoice.id, {
        data: {
            amount: total
        }
    });
}

module.exports.confirmPayment = confirmPayment;
