'use strict';

/**
 * class router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::class.class', {
    config: {
        create: {
            middlewares: [
                async (ctx, next) => {
                    var t = await next();

                    var newClassId = ctx.body.data.id;

                    const response = await strapi.service('api::register.register').processRegisterForClass(newClassId);

                    return t;
                }
            ]
        },
        update: {
            middlewares: [
                async (ctx, next) => {
                    var t = await next();

                    var updatedClassId = ctx.params.id;

                    const response = await strapi
                        .service('api::register.register')
                        .processRegisterForClass(updatedClassId);

                    return t;
                }
            ]
        }
    }
});
