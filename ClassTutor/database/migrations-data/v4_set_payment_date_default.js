module.exports = async () => {
    const records = await strapi.entityService.findMany('api::payment-subscription.payment-subscription', {
        fields: ['id'],
        filters: {
            paymentDate: {
                $null: true
            }
        }
    });
    for (const e of records) {
        await strapi.entityService.update('api::payment-subscription.payment-subscription', e.id, {
            fields: ['id'],
            data: {
                paymentDate: 1
            }
        });
    }
};
