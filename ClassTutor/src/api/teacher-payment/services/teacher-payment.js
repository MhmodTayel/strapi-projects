'use strict';
const { DateTime } = require('luxon');
const DateTimeUtils = require('../../../../utils/datetime-utils');
var _ = require('lodash');

/**
 * teacher-payment service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::teacher-payment.teacher-payment', ({ strapi }) => ({
    async markPaymentAsDue() {
        var paymentsDue = await strapi.entityService.findMany('api::teacher-payment.teacher-payment', {
            filters: {
                date: {
                    $lte: DateTimeUtils.todayDateStrapi()
                },
                status: 'pending'
            }
        });

        for (let i = 0; i < paymentsDue.length; i++) {
            const element = paymentsDue[i];

            await strapi.entityService.update('api::teacher-payment.teacher-payment', element.id, {
                data: {
                    status: 'due'
                }
            });
        }
    },
    async getTotal(id) {
        if (!id) return;
        let total = 0;
        const teacherPayment = await strapi.entityService.findOne('api::teacher-payment.teacher-payment', id, {
            populate: ['transactions']
        });
        for (const transaction of teacherPayment?.transactions) {
            if (transaction.type === 'penalty') {
                total -= transaction.amount;
            } else {
                total += transaction.amount;
            }
        }
        return total;
    },
    async addTransaction(id, type, amount, systemGenerated) {
        const teacherPayment = await strapi.entityService.findOne('api::teacher-payment.teacher-payment', id, {
            populate: ['transactions']
        });
        if (!teacherPayment?.transactions) teacherPayment.transactions = [];
        if (type === 'penalty') {
            const total = await this.getTotal(id);
            let maximumToDeduct = amount;
            if (total - maximumToDeduct < 0) maximumToDeduct = total;
            teacherPayment?.transactions?.push({
                type,
                amount: maximumToDeduct,
                systemGenerated: systemGenerated ?? false
            });
        } else {
            teacherPayment?.transactions?.push({
                type,
                amount
            });
        }
        return await strapi.entityService.update('api::teacher-payment.teacher-payment', teacherPayment.id, {
            data: {
                transactions: teacherPayment?.transactions
            }
        });
    }
}));
