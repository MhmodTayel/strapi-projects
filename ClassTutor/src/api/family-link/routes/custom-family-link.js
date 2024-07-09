'use strict';

module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/family-links/findByEntityId/:type/:entityId',
            handler: 'family-link.findByEntityId'
        },
        {
            method: 'PUT',
            path: '/family-links/createOrUpdate',
            handler: 'family-link.createOrUpdate'
        },
        {
            method: 'PUT',
            path: '/family-links/unLinkByEntityId/:type/:entityId',
            handler: 'family-link.unLinkByEntityId'
        },
        {
            method: 'GET',
            path: '/family-links/canUnLinkByEntityId/:type/:entityId',
            handler: 'family-link.canUnLinkByEntityId'
        }
    ]
};
