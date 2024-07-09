'use strict';

/**
 * id-config service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::id-config.id-config', ({ strapi }) => ({
    async getNewId(forType) {
        return await parseNewId(forType, false);
    },
    async peekNewId(forType) {
        return await parseNewId(forType, true);
    }
}));

async function parseNewId(forType, isPeek) {
    if (!forType) return "";

    var entity = await strapi.entityService.findOne("api::id-config.id-config", 1);

    var existingId;

    switch (forType.toLowerCase()) {
        case "student": existingId = entity.studentId; break;
        case "class": existingId = entity.classId; break;
        case "teacher": existingId = entity.teacherId; break;
        case "parent": existingId = entity.parentId; break;
        default: return "";
    }

    var newId;
    var typeSuffix = existingId.replace(/[^A-Za-z]/g, '');

    var matches = existingId.match(/(\d+)/);

    if (matches) {
        newId = parseInt(matches[0]) + 1;
    }

    var finalId = typeSuffix + zeroPad(newId, 4);

    if (!isPeek) {
        switch (forType.toLowerCase()) {
            case "student": entity.studentId = finalId; break;
            case "class": entity.classId = finalId; break;
            case "teacher": entity.teacherId = finalId; break;
            case "parent": entity.parentId = finalId; break;
            default: return "";
        }

        await strapi.entityService.update("api::id-config.id-config", 1, {
            "data": entity
        });
    }

    return finalId;
}

function zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}
