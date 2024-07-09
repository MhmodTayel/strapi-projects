"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    create(ctx) {
        try {
            ctx.body = strapi
                .plugin("async-mail")
                .service("async-mail")
                .create(ctx.body);
        }
        catch (error) {
            ctx.throw(500, error);
        }
    },
});
