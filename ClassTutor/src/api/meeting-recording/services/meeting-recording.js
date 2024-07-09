'use strict';

/**
 * meeting-recording service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::meeting-recording.meeting-recording', ({ strapi }) => ({

    async update(entityId, params) {

        const result = await super.update(entityId, params);

        var existingMeetingRecording = await strapi.entityService.findOne("api::meeting-recording.meeting-recording", entityId, {
            populate: ["register"]
        });

        if (existingMeetingRecording.register && existingMeetingRecording.register.id && existingMeetingRecording.recordingLink && !existingMeetingRecording.register.recordingLink) {
            await strapi.entityService.update("api::register.register", existingMeetingRecording.register.id, {
                data: {
                    recordingLink: existingMeetingRecording.recordingLink,
                    recordingChat: existingMeetingRecording.meetingChat,
                    recordingTranscript: existingMeetingRecording.meetingTranscript,
                }
            });
        }

        return result;
    }
}));
