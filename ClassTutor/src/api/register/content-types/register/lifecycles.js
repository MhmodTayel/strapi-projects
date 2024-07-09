// Validation error types: https://forum.strapi.io/t/throw-error-message-in-lifecycle-hook-doesnt-change-the-error-message-display-in-the-ui/1515/15?u=umair
const { ValidationError } = require('@strapi/utils').errors;
const DateTimeUtils = require('../../../../../utils/datetime-utils');
const { DateTime } = require('luxon');
const _ = require('lodash');

module.exports = {
    async beforeCreate(event) {
        const { params } = event;
        var data = params.data;

        if (data.classDate && data.startTime) {
            var classTime = DateTimeUtils.dateAndTimeToStrapiFormat(data.classDate, data.startTime);
            data.classTime = classTime;
        }
    },

    async beforeUpdate(event) {
        const { data, where, select, populate } = event.params;

        var originalRegister = await strapi.entityService.findOne('api::register.register', where.id, {
            populate: ['class']
        });

        if (data.isComplete == true) {
            if (originalRegister.status == 'open' || originalRegister.status == 'missing') {
                data.status = 'completed';

                if (originalRegister.status == 'missing') {
                    data.isCompleteLate = true;

                    const dateNow = DateTime.local();
                    const dateClass = DateTime.fromISO(originalRegister.classTime);
                    const diff = dateNow.diff(dateClass, ['days', 'hours']).toObject();
                    const diffDays = diff.days;

                    if (diffDays && diffDays > 0) data.attendanceLateDays = diffDays;
                    const teacherPayment = _.first(
                        await strapi.entityService.findMany('api::teacher-payment.teacher-payment', {
                            filters: {
                                register: originalRegister.id,
                                class: originalRegister.class.id
                            }
                        })
                    );
                    await strapi
                        .service('api::teacher-payment.teacher-payment')
                        .addTransaction(teacherPayment.id, 'penalty', data.attendanceLateDays,true);
                }
            }
        }

        if (data.classDate) {
            if (
                originalRegister.classDate != data.classDate ||
                originalRegister.classDate != data.startTime ||
                originalRegister.endTime != data.endTime
            ) {
                var startTime = data.startTime ?? originalRegister.startTime;
                var endTime = data.endTime ?? originalRegister.endTime;

                var existingRegister = await strapi.entityService.findMany('api::register.register', {
                    filters: {
                        id: { $ne: where.id },
                        class: originalRegister.class.id,
                        classDate: data.classDate,
                        startTime: startTime,
                        endTime: endTime
                    }
                });

                if (existingRegister.length > 0) {
                    throw new ValidationError('There is already a lesson taking place at the same date and time');
                }
            }
        }

        if (data.classDate || data.startTime || data.classTime) {
            var date = data.classDate ?? originalRegister.classDate;
            var startTime = data.startTime ?? originalRegister.startTime;

            var classTime = DateTimeUtils.dateAndTimeToStrapiFormat(date, startTime);
            data.classTime = classTime;
        }
    }
};
