module.exports = {
    processRegisters: {
        task: async ({ strapi }) => {
            await strapi.service('api::register.register').processRegisters();
        },
        options: {
            rule:
                process.env.NODE_ENV === 'development'
                    ? '*/3 * * * *' // every 3 mins
                    : '*/15 * * * *' // every 15 mins
        }
    },

    updateLessonStatus: {
        task: async ({ strapi }) => {
            await strapi.service('api::register.register').updateLessonStatus();
        },
        options: {
            rule:
                process.env.NODE_ENV === 'development'
                    ? '*/3 * * * *' // every 3 mins
                    : '*/15 * * * *' // every 15 mins
        }
    },

    unlockHomework: {
        task: async ({ strapi }) => {
            await strapi.service('api::register.register').unlockHomeworkLock(); // legacy

            await strapi.service('api::homework.homework').unlock();
        },
        options: {
            rule:
                process.env.NODE_ENV === 'development'
                    ? '0/30 * * * * *' // every 30 seconds
                    : '0/15 * * * * *' // every 15 seconds
        }
    },

    clearPostponed: {
        task: async ({ strapi }) => {
            await strapi.service('api::student.student').clearPostponed();
        },
        options: {
            rule:
                process.env.NODE_ENV === 'development'
                    ? '0/30 * * * * *' // every 30 seconds
                    : '0/15 * * * * *' // every 15 seconds
        }
    },

    updateStudentClassStatus: {
        task: async ({ strapi }) => {
            await strapi.service('api::student-class.student-class').updateStatus();
        },
        options: {
            rule:
                process.env.NODE_ENV === 'development'
                    ? '0/45 * * * * *' // every 45 seconds
                    : '0 */6 * * *' // every 6 hours
        }
    },

    updateTeacherPaymentStatus: {
        task: async ({ strapi }) => {
            await strapi.service('api::teacher-payment.teacher-payment').markPaymentAsDue();
        },
        options: {
            rule:
                process.env.NODE_ENV === 'development'
                    ? '0/45 * * * * *' // every 45 seconds
                    : '0 */6 * * *' // every 6 hours
        }
    }
};
