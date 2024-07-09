'use strict';
const { DateTime } = require("luxon");
const DateTimeUtils = require('../../../../utils/datetime-utils');
var _ = require("lodash");

/**
 * homework-submission service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::homework-submission.homework-submission', ({ strapi }) => ({
    async find(params) {
        // some logic here

        const { results, pagination } = await super.find(params);
        // some more logic

        for (let i = 0; i < results.length; i++) {
            const element = results[i];
            await this.setStatus(element);
        }

        return { results, pagination };
    },

    async findOne(entityId, params) {
        // some logic here

        const result = await super.findOne(entityId, params);
        // some more logic

        await this.setStatus(result);

        return result;
    },

    async update(entityId, params) {
        // some logic here

        const result = await super.update(entityId, params);
        // some more logic

        await this.setStatus(result);

        return result;
    },

    async setStatus(originalSubmission) {

        try {

            var homeworkSubmission = await super.findOne(originalSubmission.id, {
                populate: ["homework", "homework.locked_by_teacher"]
            });

            var deadline = homeworkSubmission.homework.deadline
                && DateTimeUtils.parseDateTime(homeworkSubmission.homework.deadline);
            var completionDate = homeworkSubmission.completionDate
                && DateTimeUtils.parseDateTime(homeworkSubmission.completionDate);
            var isSubmittedLate = completionDate && deadline && completionDate > deadline;
            var isDeadlinePassed = deadline && deadline < DateTimeUtils.nowDateTimeStrapi();
            var isSubmittedByStudent = homeworkSubmission.submitted == true;
            var isUploadedByTeacher = false;
            if (homeworkSubmission.homework.deadline) isUploadedByTeacher = true;
            var isMarked = homeworkSubmission.markingStatus == "marked";
            var isError = homeworkSubmission.markingStatus == "error";
            var isAssignedToTeacher = homeworkSubmission.homework.locked_by_teacher != null
                || homeworkSubmission.homework.locked_by_teacher != undefined;

            originalSubmission.statusError = null;
            originalSubmission.status = null;
            originalSubmission.marksPercentage = null;
            originalSubmission.marksColour = null;

            // when no homework has been uploaded by the teacher yet
            if (!isUploadedByTeacher) {
                originalSubmission.status = "na";
                return;
            }

            if (isError) {
                originalSubmission.status = "blocked";

                if (isSubmittedLate) {
                    // submitted late
                    originalSubmission.status = originalSubmission.status + "_late";
                }

                return;
            }

            if (isSubmittedByStudent) {

                if (!isDeadlinePassed && !isMarked && !isAssignedToTeacher) {
                    originalSubmission.status = "submitted";

                    if (isSubmittedLate) {
                        // submitted late
                        originalSubmission.status = originalSubmission.status + "_late";
                    }

                    return;
                }

                // When hmk is submitted by student and needs marking
                if (!isMarked) {

                    // submitted on time
                    originalSubmission.status = "mark";

                    if (isAssignedToTeacher) {
                        // assigned to teacher for marking
                        originalSubmission.status = "inprogress";
                    }

                    if (isSubmittedLate) {
                        // submitted late
                        originalSubmission.status = originalSubmission.status + "_late";
                    }

                    return;
                } else {
                    // home submitted and was marked, output marks

                    var marksAchieved = homeworkSubmission.marksAchieved;
                    var total = homeworkSubmission.homework.marksTotal;

                    originalSubmission.status = "marked";
                    originalSubmission.marksPercentage = parseInt((100 * parseFloat(marksAchieved)) / parseFloat(total));

                    originalSubmission.marksColour = "red";
                    if (originalSubmission.marksPercentage >= 90)
                        originalSubmission.marksColour = "green";
                    else if (originalSubmission.marksPercentage >= 50)
                        originalSubmission.marksColour = "amber";

                    if (isSubmittedLate) {
                        // submitted late
                        originalSubmission.status = originalSubmission.status + "_late";
                    }

                    return;
                }
            }

            if (isDeadlinePassed) {

                // No submission even after the deadline passed
                if (!isSubmittedByStudent) {
                    originalSubmission.status = "missing";
                    return;
                }

            } else {

                // When a homework has not yet submitted by the student pre-deadline
                if (!isSubmittedByStudent) {
                    originalSubmission.status = "waiting";
                    return;
                }

            }

            originalSubmission.status = "review";
            return;

        } catch (error) {
            originalSubmission.statusError = error;
        }
    }
}));
