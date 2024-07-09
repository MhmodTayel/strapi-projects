const { DateTime } = require('luxon');

module.exports = {
    async afterCreate(event) {
        const { result, params } = event;

        await strapi.db.query('api::teacher-payment.teacher-payment').update({
            where: { id: result.id },
            data: {
                totalAmount: await strapi.service('api::teacher-payment.teacher-payment').getTotal(result.id)
            },
            options: {
                ignoreSetAmount: true
            }
        });
    },

    async afterUpdate(event) {
        const { result, params } = event;
        const { data, where, select, populate, options } = event.params;

        var ignoreSetAmount = options && options.ignoreSetAmount == true;

        if (!ignoreSetAmount && result) {
            await strapi.db.query('api::teacher-payment.teacher-payment').update({
                where: { id: result.id },
                data: {
                    totalAmount: await strapi.service('api::teacher-payment.teacher-payment').getTotal(result.id)
                },
                options: {
                    ignoreSetAmount: true
                }
            });
        }
    }
};
