module.exports = {
    async beforeUpdate(event) {
        const { data, where, select, populate } = event.params;

        if (data.marksAchieved) {
            var originalSubmission = await strapi.entityService.findOne(
                'api::homework-submission.homework-submission',
                where.id,
                { populate: [homework] }
            );

            if (!originalSubmission.marksAchieved) {
                event.state.hasMarksSet = true;
                event.state.homeworkId = originalSubmission.homework.id;
            }
        }
    },

    async afterUpdate(event) {
        const { data, where, select, populate } = event.params;

        if (event.state.hasMarksSet) {
            var homeworkSubmissionsRemaining = await strapi.entityService.findMany(
                'api::homework-submission.homework-submission',
                {
                    filters: {
                        homework: event.state.homeworkId,
                        marksAchieved: {
                            $null: true
                        },
                        submitted: true
                    }
                }
            );

            if (homeworkSubmissionsRemaining.length == 0) {
                // close the homework and update status

                var homework = await strapi.entityService.update('api::homework.homework', event.state.homeworkId, {
                    data: {
                        markingComplete: true,
                        markingBlocked: false,
                        locked_by_teacher: null,
                        lockStartTime: null,
                        lockEndTime: null
                    }
                });

                await strapi.service('api::event-message.event-message').send({
                    eventCode: '1105',
                    template: 'The homework marking is complete',
                    entity: 'homework',
                    entityId: event.state.homeworkId,
                    receiverId: 'teacher-users',
                    background: true
                });
            }
        }
    }
};

function setHomworkStatus(item) {
    if (item) {
    }
}
