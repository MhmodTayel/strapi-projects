"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    async create(ctx) {
        try {
            ctx.body = await strapi
                .plugin("async-mail")
                .service("async-mail")
                .create(ctx.request.body);
        }
        catch (error) {
            throw error;
        }
    },
});
