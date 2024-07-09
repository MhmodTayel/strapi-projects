'use strict';

/**
 * teacher-capability service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::teacher-capability.teacher-capability', ({ strapi }) => ({
    async getForTeacher(teacherId) {
        var teacherCapabilities = await strapi.entityService.findMany('api::teacher-capability.teacher-capability', {
            filters: {
                teacher: teacherId
            },
            populate: ["education_level", "subject"],
            sort: {
                subject: {
                    name: "asc"
                }
            }
        });

        var capabilities = [];

        for (let i = 0; i < teacherCapabilities.length; i++) {
            const teacherCapability = teacherCapabilities[i];
            var existing = capabilities.find(x => x.subject == teacherCapability.subject.name);
            if (!existing) {
                capabilities.push({
                    "subject": teacherCapability.subject.name,
                    "educationLevels": []
                });
            }
        }

        for (let i = 0; i < teacherCapabilities.length; i++) {
            const teacherCapability = teacherCapabilities[i];
            var recordToUpdate = capabilities.find(x => x.subject == teacherCapability.subject.name);

            if (recordToUpdate && teacherCapability.education_level) {
                recordToUpdate.educationLevels.push({
                    "name": teacherCapability.education_level.name,
                    "type": teacherCapability.type,
                    "coverPriority": teacherCapability.coverPriority
                })
            }
        }

        return capabilities;
    },

    async updateForTeacher(teacherId, capabilities) {
        var teacherCapabilities = await strapi.entityService.findMany('api::teacher-capability.teacher-capability', {
            filters: {
                teacher: teacherId
            }
        });

        for (let i = 0; i < teacherCapabilities.length; i++) {
            const teacherCapability = teacherCapabilities[i];
            const entry = await strapi.entityService.delete('api::teacher-capability.teacher-capability', teacherCapability.id);
        }

        if (capabilities) {
            var subjects = await strapi.entityService.findMany('api::subject.subject');
            var educationLevels = await strapi.entityService.findMany('api::education-level.education-level');

            for (let i = 0; i < capabilities.length; i++) {
                const capability = capabilities[i];

                if (capability.subject) {
                    var subject = subjects.find(x => x.name.toLowerCase() == capability.subject.toLowerCase());

                    for (let j = 0; j < capability.educationLevels.length; j++) {
                        const educationLevelObj = capability.educationLevels[j];

                        var educationLevel = educationLevels.find(x => x.name.toLowerCase() == educationLevelObj.name.toLowerCase());
                        if (educationLevel && (educationLevelObj.type || educationLevelObj.coverPriority)) {
                            var body = {
                                teacher: teacherId,
                                subject: subject.id,
                                education_level: educationLevel.id
                            }
                            if (educationLevelObj.type)
                                body.type = educationLevelObj.type.toLowerCase();
                            if (educationLevelObj.coverPriority)
                                body.coverPriority = educationLevelObj.coverPriority

                            await strapi.entityService.create('api::teacher-capability.teacher-capability', {
                                "data": body
                            });
                        }
                    }
                }
            }
        }

        return {};
    },
}));
