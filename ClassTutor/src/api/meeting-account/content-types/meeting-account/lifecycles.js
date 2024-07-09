module.exports = {
    async afterUpdate(event) {
        const { result } = event;
        /* update classes account fields to match the new meeting account data*/
        const classes = await strapi.entityService.findMany('api::class.class', {
            filters: {
                meeting_account: result.id
            }
        });

        for (const _class of classes) {
            await strapi.entityService.update('api::class.class', _class.id, {
                data: {
                    zoomAccount: result.name,
                    zoomPassword: result.password
                }
            });
        }
    }
};
