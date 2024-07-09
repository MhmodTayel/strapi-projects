'use strict';

/**
 * family-link controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::family-link.family-link', ({ strapi }) => ({
    async findByEntityId(ctx) {
        var { type, entityId } = ctx.request.params;

        const response = await strapi.service('api::family-link.family-link').findByEntityId(type, entityId);

        if (response.message) {
            if (response.httpCode == 400) {
                return ctx.badRequest(response.message);
            } else if (response.httpCode == 404) {
                return ctx.notFound(response.message);
            } else {
                return ctx.internalServerError(response.message);
            }
        }

        return {
            data: response
        };
    },

    async createOrUpdate(ctx) {
        var { entityId, entityType, parentIds, studentIds } = ctx.request.body;

        const valid = await strapi
            .service('api::family-link.family-link')
            .canLink(entityId, entityType, studentIds, parentIds);

        if (!valid) return ctx.badRequest("can't link them because they are exists in other families");

        const response = await strapi.service('api::family-link.family-link').createOrUpdate(parentIds, studentIds);

        if (response.message) {
            if (response.httpCode == 400) {
                return ctx.badRequest(response.message);
            } else if (response.httpCode == 404) {
                return ctx.notFound(response.message);
            } else {
                return ctx.internalServerError(response.message);
            }
        }

        return {
            data: response
        };
    },
    async canUnLinkByEntityId(ctx) {
        var { type, entityId } = ctx.request.params;
        var { entityTypeToUnlink, entityIdsToUnlink } = ctx.request.query;

        const result = await strapi
            .service('api::family-link.family-link')
            .canUnLinkByEntityId(type, entityId, entityTypeToUnlink, entityIdsToUnlink);
        const response = result instanceof Error ? { message: result.message, httpCode: 400 } : {};

        if (response.message) {
            if (response.httpCode == 400) {
                return ctx.badRequest(response.message);
            } else if (response.httpCode == 404) {
                return ctx.notFound(response.message);
            } else {
                return ctx.internalServerError(response.message);
            }
        }

        return {
            data: {}
        };
    },
    async unLinkByEntityId(ctx) {
        var { type, entityId } = ctx.request.params;
        var { entityTypeToUnlink, entityIdsToUnlink } = ctx.request.body;

        const result = await strapi
            .service('api::family-link.family-link')
            .unLinkByEntityId(type, entityId, entityTypeToUnlink, entityIdsToUnlink);
        const response = !result ? { message: "couldn't unlink the entities", httpCode: 400 } : {};

        if (response.message) {
            if (response.httpCode == 400) {
                return ctx.badRequest(response.message);
            } else if (response.httpCode == 404) {
                return ctx.notFound(response.message);
            } else {
                return ctx.internalServerError(response.message);
            }
        }

        return {
            data: response
        };
    }
}));
