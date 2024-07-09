'use strict';
const { DateTime } = require("luxon");
const DateTimeUtils = require('../../../../utils/datetime-utils');
var qs = require('qs');
var _ = require('lodash');

/**
 * homework service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::homework.homework', ({ strapi }) => ({

    async unlock() {

        var unlockTime = DateTimeUtils.nowDateTimeStrapi();

        const lockedHomeworks = await strapi.entityService.findMany('api::homework.homework', {
            filters: {
                lockEndTime: { $notNull: true },
                lockEndTime: { $lte: unlockTime }
            },
        });

        for (let i = 0; i < lockedHomeworks.length; i++) {
            const element = lockedHomeworks[i];

            const entry = await strapi.entityService.update('api::homework.homework', element.id, {
                data: {
                    locked_by_teacher: null,
                    lockStartTime: null,
                    lockEndTime: null
                },
            });

            await strapi.service("api::event-message.event-message").send(
                {
                    eventCode: "1100",
                    template: "The homework is available for marking",
                    entity: "homework",
                    entityId: element.id,
                    receiverId: "teacher-users",
                    background: true
                });
        }

        return {};
    },

    async assignToTeacher(homeworkId, teacherId) {

        try {
            if (!teacherId) {
                return { message: "Missing teacherId", httpCode: 400 };
            }

            if (!homeworkId) {
                return { message: "Missing homeworkId", httpCode: 400 };
            }

            const homework = await strapi.entityService.findOne('api::homework.homework', homeworkId, {
                populate: ["locked_by_teacher"]
            });

            if (homework) {

                const teacher = await strapi.entityService.findOne('api::teacher.teacher', teacherId, {});

                if (!teacher) {
                    return { message: "Teacher not found", httpCode: 404 };
                }

                if (homework.locked_by_teacher) {
                    if (homework.locked_by_teacher.id == teacher.id) {
                        return { message: "Already assigned to same teacher", httpCode: 500 };
                    }

                    if (homework.locked_by_teacher.id != teacher.id) {
                        return { message: "Assigned to another teacher", httpCode: 500 };
                    }
                }

                var lockEndHours = 3;
                var lockStartTime = DateTime.local();
                var lockEndTime = lockStartTime.plus({ hours: lockEndHours });
                var lockStartTimeIso = lockStartTime.toISO();
                var lockEndTimeIso = lockEndTime.toISO();

                const entry = await strapi.entityService.update('api::homework.homework', homeworkId, {
                    data: {
                        locked_by_teacher: teacherId,
                        lockStartTime: lockStartTimeIso,
                        lockEndTime: lockEndTimeIso
                    },
                });

                await strapi.service("api::event-message.event-message").send(
                    {
                        eventCode: "1101",
                        template: "The homework is locked to a teacher",
                        entity: "homework",
                        entityId: homeworkId,
                        receiverId: "teacher-users",
                        background: true
                    });

                return {
                    lockStartTime: entry.lockStartTime,
                    lockEndTime: entry.lockEndTime
                };

            } else {
                return { message: "Homework not found", httpCode: 404 };
            }

        } catch (err) {
            return { message: err.message, httpCode: 500 };
        }

        return {};
    },

    async get(query) {
        try {
            var { teacherId } = query;

            if (!teacherId) {
                return { message: "Missing teacherId query parameter", httpCode: 400 };
            }

            if (!query.filters) { query.filters = {}; };
            if (!query.filters.deadline) { query.filters.deadline = {}; };

            if (!query.populate) query.populate = {};

            if (Array.isArray(query.populate)) {
                if (!_.includes(query.populate, "locked_by_teacher"))
                    query.populate.push("locked_by_teacher");

            } else {
                if (!query.populate.hasOwnProperty("locked_by_teacher"))
                    query.populate.locked_by_teacher = {
                        populate: ""
                    };
            }

            query.filters.deadline.$notNull = true; // has homework files uploaded
            query.filters.deadline.$lte = DateTimeUtils.nowDateTimeStrapi(); // only get homework with passed deadline
            //query.filters.homework_submissions.submitted.$eq = true; // only get records with homework submitted

            if (!query.filters.hasOwnProperty("homework_submissions")) {
                query.filters.homework_submissions = {};
            }

            if (!query.filters.homework_submissions.hasOwnProperty("submitted")) {
                query.filters.homework_submissions.submitted = {};
            }

            if (!query.filters.homework_submissions.submitted.hasOwnProperty("$eq")) {
                query.filters.homework_submissions.submitted.$eq = true;
            }

            if (query.filters.homework_submissions.submitted.$eq != true)
                query.filters.homework_submissions.submitted.$eq = true;

            const { results, pagination } = await super.find(query);

            for (let i = 0; i < results.length; i++) {
                const homework = results[i];
                homework.status = "open";
                homework.canTeacherMark = true;

                var homeworkSubmissions = await strapi.entityService.findMany("api::homework-submission.homework-submission", {
                    filters: {
                        homework: homework.id
                    }
                });

                homework.totalCount = _.filter(homeworkSubmissions, function (o) { return o.submitted == true; }).length;
                homework.markedCount = _.filter(homeworkSubmissions, function (o) {
                    return o.submitted == true && o.markingStatus == "marked";
                }).length;
                var anyHomeworkHasError = _.filter(homeworkSubmissions, function (o) { return o.markingStatus == "error"; });

                if (homework.markingBlocked) {
                    homework.status = "blocked";
                    homework.canTeacherMark = false;
                }

                else if (homework.markingComplete) {
                    homework.status = "completed";
                    homework.canTeacherMark = false;
                }

                else if (homework.locked_by_teacher) {
                    homework.status = "locked";
                    homework.canTeacherMark = homework.locked_by_teacher.id == teacherId;
                }
            }

            return { results, pagination };

        } catch (err) {
            return { message: err.message, httpCode: 500 };
        }

        return {};
    },

}));
