'use strict';
const Handlebars = require('handlebars');

/**
 * event-message service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::event-message.event-message', ({ strapi }) => ({
    async send(data) {
        if (!data.background) data.background = false;
        if (!data.persist) data.persist = false;
        if (!data.eventType) data.eventType = 'info';
        if (data.entityId) data.entityId = data.entityId.toString();

        data.message = data.template;

        const eventMessages = await strapi.entityService.findMany('api::event-message.event-message', {
            filters: {
                eventCode: data.eventCode,
                entityId: data.entityId,
                entity: data.entity,
                receiverId: data.receiverId
            }
        });

        // only send the notification once unless the forceSend is defined
        if (eventMessages?.length && !data.forceSend) return;

        if (!data.background) {
            if (data.messageValues) {
                var msg = data.template;
                const template = Handlebars.compile(msg);
                msg = template(data.messageValues);
                data.message = msg;
            }

            var result = await super.create({
                data: data
            });

            strapi.socketio.to(data.receiverId).emit('notify', {
                eventCode: data.eventCode,
                message: data.message,
                entity: data.entity,
                entityId: data.entityId,
                eventType: data.eventType,
                persist: data.persist
            });
        } else {
            strapi.socketio.to(data.receiverId).emit('notify-background', {
                eventCode: data.eventCode,
                message: data.message,
                entity: data.entity,
                entityId: data.entityId,
                eventType: data.eventType,
                messageValues: data.messageValues,
                background: true
            });
        }
    },

    async test(data) {
        setTimeout(() => {
            strapi.socketio.to(data?.receiverId ?? 'admin-users').emit('notify', {
                eventCode: '0000',
                message: 'This is a test notification with link',
                entity: 'parent',
                entityId: '0',
                eventType: 'info',
                persist: true
            });
        }, 1000);

        setTimeout(() => {
            strapi.socketio.to(data?.receiverId ?? 'admin-users').emit('notify', {
                eventCode: '0000',
                message: 'This is a test notification without link',
                entity: '',
                entityId: '',
                eventType: 'info',
                persist: true
            });
        }, 3000);

        setTimeout(() => {
            strapi.socketio.to(data?.receiverId ?? 'admin-users').emit('notify-background', {
                eventCode: '0000',
                message: 'This is a background notification',
                entity: 'register',
                entityId: '0',
                eventType: 'info',
                persist: true
            });
        }, 5000);

        return {};
    }
}));
