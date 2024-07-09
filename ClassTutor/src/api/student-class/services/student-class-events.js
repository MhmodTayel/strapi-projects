const EmailHelper = require('../../../../utils/email-helper');
const EmailTemplates = require('../../../../utils/email-templates');
const _ = require('lodash');
const { DateTime } = require('luxon');
const process = require('process');
/**
 * a new trial student class created.
 * Note: trial student classes doesn't has a payment subscription
 */
module.exports.trialClassBookedEvent = async (strapi, studentClassId) => {
    console.log('trialClassBookedEvent triggered with', studentClassId);
    const studentClass = await strapi.entityService.findOne('api::student-class.student-class', studentClassId, {
        populate: ['billing_parent', 'student', 'class.subject', 'class.year', 'class.teacher']
    });

    await EmailHelper.sendTemplateEmail(
        EmailTemplates.TRIAL.TRAIL_EMAIL_TEMPLATE_CONFIRM,
        `${studentClass?.billing_parent?.name} ${studentClass?.billing_parent?.lastName}`,
        studentClass?.billing_parent?.email,
        {
            studentName: `${studentClass?.student?.name} ${studentClass?.student?.lastName}`,
            parent: studentClass?.billing_parent,
            student: studentClass?.student,
            classDate: studentClass?.trialDate,
            portal: process.env.FRONTEND_URL,
            signupRoute: 'signup',
            subject: studentClass?.class?.subject,
            year: studentClass?.class?.year,
            teacher: studentClass?.class?.teacher,
            class: {
                ...studentClass?.class,
                dayOfWeek: _.capitalize(studentClass?.class?.dayOfWeek),
                startDate: DateTime.fromISO(`${studentClass?.trialDate}T${studentClass?.class?.startTime}`)
                    .setZone('Europe/London')
                    .toFormat('dd MMM'),
                startTime: DateTime.fromISO(`${studentClass?.trialDate}T${studentClass?.class?.startTime}`)
                    .setZone('Europe/London')
                    .toFormat('hh:mm'),
                endTime: DateTime.fromISO(`${studentClass?.trialDate}T${studentClass?.class?.endTime}`)
                    .setZone('Europe/London')
                    .toFormat('hh:mma')
            },
            otherSubjects: []
        }
    );
};

/**
 * a new trial student class changed. such as updating the class ids
 */
module.exports.trialClassChangedEvent = async (strapi, studentClassId, oldStudentClassData) => {
    console.log('trialClassChangedEvent triggered with', studentClassId, oldStudentClassData);
    const studentClass = await strapi.entityService.findOne('api::student-class.student-class', studentClassId, {
        populate: ['billing_parent', 'student', 'class.subject', 'class.year', 'class.teacher']
    });

    await EmailHelper.sendTemplateEmail(
        EmailTemplates.TRIAL.TRAIL_EMAIL_TEMPLATE_CHANGED,
        `${studentClass?.billing_parent?.name} ${studentClass?.billing_parent?.lastName}`,
        studentClass?.billing_parent?.email,
        {
            studentName: `${studentClass?.student?.name} ${studentClass?.student?.lastName}`,
            parent: studentClass?.billing_parent,
            student: studentClass?.student,
            classDate: studentClass?.trialDate,
            portal: process.env.FRONTEND_URL,
            signupRoute: 'signup',
            subject: studentClass?.class?.subject,
            year: studentClass?.class?.year,
            teacher: studentClass?.class?.teacher,
            class: {
                ...studentClass?.class,
                dayOfWeek: _.capitalize(studentClass?.class?.dayOfWeek),
                startDate: DateTime.fromISO(`${studentClass?.trialDate}T${studentClass?.class?.startTime}`)
                    .setZone('Europe/London')
                    .toFormat('dd MMM'),
                startTime: DateTime.fromISO(`${studentClass?.trialDate}T${studentClass?.class?.startTime}`)
                    .setZone('Europe/London')
                    .toFormat('hh:mm'),
                endTime: DateTime.fromISO(`${studentClass?.trialDate}T${studentClass?.class?.endTime}`)
                    .setZone('Europe/London')
                    .toFormat('hh:mma')
            },
            otherSubjects: []
        }
    );
};

/**
 * when trial student class cancelled.
 */
module.exports.trialClassCancelledEvent = async (strapi, studentClassId) => {
    console.log('trialClassCancelledEvent triggered with', studentClassId);
    const studentClass = await strapi.entityService.findOne('api::student-class.student-class', studentClassId, {
        populate: ['billing_parent', 'student', 'class.subject', 'class.year', 'class.teacher']
    });

    await EmailHelper.sendTemplateEmail(
        EmailTemplates.TRIAL.TRAIL_EMAIL_TEMPLATE_CANCELLED,
        `${studentClass?.billing_parent?.name} ${studentClass?.billing_parent?.lastName}`,
        studentClass?.billing_parent?.email,
        {
            studentName: `${studentClass?.student?.name} ${studentClass?.student?.lastName}`,
            parent: studentClass?.billing_parent,
            student: studentClass?.student,
            classDate: studentClass?.trialDate,
            portal: process.env.FRONTEND_URL,
            signupRoute: 'signup',
            subject: studentClass?.class?.subject,
            year: studentClass?.class?.year,
            teacher: studentClass?.class?.teacher,
            class: {
                ...studentClass?.class,
                dayOfWeek: _.capitalize(studentClass?.class?.dayOfWeek),
                startDate: DateTime.fromISO(`${studentClass?.trialDate}T${studentClass?.class?.startTime}`)
                    .setZone('Europe/London')
                    .toFormat('dd MMM'),
                startTime: DateTime.fromISO(`${studentClass?.trialDate}T${studentClass?.class?.startTime}`)
                    .setZone('Europe/London')
                    .toFormat('hh:mm'),
                endTime: DateTime.fromISO(`${studentClass?.trialDate}T${studentClass?.class?.endTime}`)
                    .setZone('Europe/London')
                    .toFormat('hh:mma')
            },
            otherSubjects: []
        }
    );
};

/**
 * created a new booking student class which has a payment subscription where you can find the payment details.
 */
module.exports.bookingClassBookedEvent = async (strapi, studentClassId, paymentSubscriptionId) => {
    console.log('bookingClassBookedEvent triggered with', studentClassId, paymentSubscriptionId);
};

/**
 * when changing the booking details such as the class or start date .
 */
module.exports.bookingClassChangedEvent = async (strapi, studentClassId, oldStudentClassData) => {
    console.log('bookingClassChangedEvent triggered with', studentClassId, oldStudentClassData);
    const studentClass = await strapi.entityService.findOne('api::student-class.student-class', studentClassId, {
        populate: ['billing_parent', 'student', 'class.subject', 'class.year', 'class.teacher']
    });
    if (
        studentClass?.status === 'active' &&
        !studentClass?.cancellationRequestDate &&
        oldStudentClassData?.status === 'active'
    ) {
        const paymentSubscription = _.first(
            await strapi.entityService.findMany('api::payment-subscription.payment-subscription', {
                filters: {
                    student_class: studentClass.id
                },
                populate: ['payment_subscription_items']
            })
        );

        let totalInvoice = 0;
        paymentSubscription?.payment_subscription_items?.forEach((e) => (totalInvoice += e.total));
        let prevTotalInvoice = 0;
        oldStudentClassData?.paymentSubscription?.payment_subscription_items?.forEach(
            (e) => (prevTotalInvoice += e.total)
        );

        const totalChanged = totalInvoice !== prevTotalInvoice;
        const rateChanged = studentClass?.payment !== oldStudentClassData?.payment;
        const paymentFrequencyChanged = studentClass?.paymentFrequency !== oldStudentClassData?.paymentFrequency;
        const isClassChanged = studentClass?.class?.id?.toString() !== oldStudentClassData?.class?.id?.toString();
        const isDateChanged =
            studentClass?.classDate !== oldStudentClassData?.classDate ||
            studentClass?.trialDate !== oldStudentClassData?.trialDate;
        const isBillingParentChanged =
            studentClass?.billing_parent?.id?.toString() !== oldStudentClassData?.billing_parent?.id?.toString();

        if (
            isBillingParentChanged ||
            isClassChanged ||
            isDateChanged ||
            totalChanged ||
            rateChanged ||
            paymentFrequencyChanged
        ) {
            await EmailHelper.sendTemplateEmail(
                EmailTemplates.BOOKING.BOOKING_CHANGED,
                `${studentClass?.billing_parent?.name} ${studentClass?.billing_parent?.lastName}`,
                studentClass?.billing_parent?.email,
                {
                    studentName: `${studentClass?.student?.name} ${studentClass?.student?.lastName}`,
                    portal: process.env.FRONTEND_URL,
                    oldLesson: {
                        subject: oldStudentClassData?.class?.subject,
                        year: oldStudentClassData?.class?.year,
                        teacher: oldStudentClassData?.class?.teacher,
                        class: {
                            ...studentClass?.class,
                            dayOfWeek: _.capitalize(oldStudentClassData?.class?.dayOfWeek),
                            startDate: DateTime.fromISO(
                                `${oldStudentClassData?.classDate}T${oldStudentClassData?.class?.startTime}`
                            )
                                .setZone('Europe/London')
                                .toFormat('dd MMM'),
                            startTime: DateTime.fromISO(
                                `${oldStudentClassData?.classDate}T${oldStudentClassData?.class?.startTime}`
                            )
                                .setZone('Europe/London')
                                .toFormat('hh:mm'),
                            endTime: DateTime.fromISO(
                                `${oldStudentClassData?.classDate}T${oldStudentClassData?.class?.endTime}`
                            )
                                .setZone('Europe/London')
                                .toFormat('hh:mma')
                        }
                    },
                    newLesson: {
                        subject: studentClass?.class?.subject,
                        year: studentClass?.class?.year,
                        teacher: studentClass?.class?.teacher,
                        class: {
                            ...studentClass?.class,
                            dayOfWeek: _.capitalize(studentClass?.class?.dayOfWeek),
                            startDate: DateTime.fromISO(`${studentClass?.classDate}T${studentClass?.class?.startTime}`)
                                .setZone('Europe/London')
                                .toFormat('dd MMM'),
                            startTime: DateTime.fromISO(`${studentClass?.classDate}T${studentClass?.class?.startTime}`)
                                .setZone('Europe/London')
                                .toFormat('hh:mm'),
                            endTime: DateTime.fromISO(`${studentClass?.classDate}T${studentClass?.class?.endTime}`)
                                .setZone('Europe/London')
                                .toFormat('hh:mma')
                        }
                    },

                    amount: paymentSubscription?.payment_subscription_items?.reduce(
                        (prev, next) => prev.total + next.total,
                        0
                    ),
                    // invoiceTitle: 'Invoice Title',
                    // invoiceDate: studentClass?.firstPaymentDate, // should be the date when we did the transaction. or an estimation date
                    invoiceItems: paymentSubscription?.payment_subscription_items?.map((e) => ({
                        subject: studentClass?.class?.subject,
                        class: studentClass?.class,
                        year: studentClass?.class?.year,
                        rate: `£${e.classRate}`,
                        total: `£${e.total}`
                    })),
                    // totalInvoiceBeforeDiscount: '410',
                    totalInvoice: `£${totalInvoice}`
                }
            );
        }
    }
};

/**
 * it calls only when confirmed the cancellation. by the cron job
 */
module.exports.bookingClassCancelledEvent = async (strapi, studentClassId) => {
    console.log('bookingClassCancelledEvent triggered with', studentClassId);
    const studentClass = await strapi.entityService.findOne('api::student-class.student-class', studentClassId, {
        populate: ['billing_parent', 'student', 'class.subject', 'class.year', 'class.teacher', 'agents']
    });

    const paymentSubscription = _.first(
        await strapi.entityService.findMany('api::payment-subscription.payment-subscription', {
            filters: {
                student_class: studentClass.id
            },
            populate: ['payment_subscription_items']
        })
    );

    let totalInvoice = 0;
    paymentSubscription?.payment_subscription_items?.forEach((e) => (totalInvoice += e.total));

    await EmailHelper.sendTemplateEmail(
        EmailTemplates.BOOKING.BOOKING_CANCELLED,
        `${studentClass?.billing_parent?.name} ${studentClass?.billing_parent?.lastName}`,
        studentClass?.billing_parent?.email,
        {
            studentName: `${studentClass?.student?.name} ${studentClass?.student?.lastName}`,
            parent: studentClass?.billing_parent,
            classDate: studentClass?.classDate,
            portal: process.env.FRONTEND_URL,
            signupRoute: 'signup',
            subject: studentClass?.class?.subject,
            year: studentClass?.class?.year,
            teacher: studentClass?.class?.teacher,
            class: {
                ...studentClass?.class,
                dayOfWeek: _.capitalize(studentClass?.class?.dayOfWeek),
                startDate: DateTime.fromISO(`${studentClass?.classDate}T${studentClass?.class?.startTime}`)
                    .setZone('Europe/London')
                    .toFormat('dd MMM'),
                startTime: DateTime.fromISO(`${studentClass?.classDate}T${studentClass?.class?.startTime}`)
                    .setZone('Europe/London')
                    .toFormat('hh:mm'),
                endTime: DateTime.fromISO(`${studentClass?.classDate}T${studentClass?.class?.endTime}`)
                    .setZone('Europe/London')
                    .toFormat('hh:mma')
            },
            amount: paymentSubscription?.payment_subscription_items?.reduce((prev, next) => prev.total + next.total, 0),
            // invoiceTitle: 'Invoice Title',
            // invoiceDate: studentClass?.firstPaymentDate, // should be the date when we did the transaction. or an estimation date
            invoiceItems: paymentSubscription?.payment_subscription_items?.map((e) => ({
                subject: studentClass?.class?.subject,
                class: studentClass?.class,
                year: studentClass?.class?.year,
                rate: `£${e.classRate}`,
                total: `£${e.total}`
            })),
            // totalInvoiceBeforeDiscount: '410',
            totalInvoice: `£${totalInvoice}`,
            salesAgent: studentClass?.agents?.at(0)?.name
        }
    );
};

/**
 * switched from trial to booking
 */
module.exports.subscriptionUpgradedEvent = async (strapi, oldStudentClassId, newStudentClassId) => {
    console.log('subscriptionUpgradedEvent triggered with', oldStudentClassId, newStudentClassId);
};

/**
 * when activated the booking student class.
 */
module.exports.subscriptionActivatedEvent = async (strapi, studentClassId) => {
    console.log('subscriptionActivatedEvent triggered with', studentClassId);
    const studentClass = await strapi.entityService.findOne('api::student-class.student-class', studentClassId, {
        populate: ['billing_parent', 'student', 'class.subject', 'class.year', 'class.teacher']
    });

    await EmailHelper.sendTemplateEmail(
        EmailTemplates.BOOKING.BOOKING_CONFIRM,
        `${studentClass?.billing_parent?.name} ${studentClass?.billing_parent?.lastName}`,
        studentClass?.billing_parent?.email,
        {
            studentName: `${studentClass?.student?.name} ${studentClass?.student?.lastName}`,
            parent: studentClass?.billing_parent,
            student: studentClass?.student,
            classDate: studentClass?.trialDate,
            signupRoute: 'signup',
            subjects: [
                {
                    ...studentClass?.class?.subject,
                    year: studentClass?.class?.year,
                    teacher: studentClass?.class?.teacher,
                    class: {
                        ...studentClass?.class,
                        dayOfWeek: _.capitalize(studentClass?.class?.dayOfWeek),
                        startDate: DateTime.fromISO(`${studentClass?.classDate}T${studentClass?.class?.startTime}`)
                            .setZone('Europe/London')
                            .toFormat('dd MMM'),
                        startTime: DateTime.fromISO(`${studentClass?.classDate}T${studentClass?.class?.startTime}`)
                            .setZone('Europe/London')
                            .toFormat('hh:mm'),
                        endTime: DateTime.fromISO(`${studentClass?.classDate}T${studentClass?.class?.endTime}`)
                            .setZone('Europe/London')
                            .toFormat('hh:mma')
                    },
                    portal: process.env.FRONTEND_URL
                }
            ],
            otherSubjects: []
        }
    );
};

/**
 * when postpone a student class
 */
module.exports.subscriptionPostponeEvent = async (strapi, studentClassId) => {
    console.log('subscriptionPostponeEvent triggered with', studentClassId);
};

/**
 * when canceling postpone for a student class
 */
module.exports.subscriptionPostponeCancelledEvent = async (strapi, studentClassId) => {
    console.log('subscriptionPostponeCancelledEvent triggered with', studentClassId);
};

/**
 * when an invoice get cancelled and that happen after we are canceled a student class.
 */
module.exports.invoiceCancelledEvent = async (strapi, invoiceId) => {
    console.log('invoiceCancelledEvent triggered with', invoiceId);
};

/**
 * when a bew invoice created after creating only new booking student class
 */
module.exports.invoiceCreatedEvent = async (strapi, invoiceId) => {
    console.log('invoiceCreatedEvent triggered with', invoiceId);
};
