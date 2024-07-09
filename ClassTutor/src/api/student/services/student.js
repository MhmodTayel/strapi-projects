'use strict';
const { DateTime } = require('luxon');
const DateTimeUtils = require('../../../../utils/datetime-utils');
var qs = require('qs');
var _ = require('lodash');

/**
 * student service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::student.student', ({ strapi }) => ({
    async clearPostponed() {
        var postponementEndTime = DateTime.local().toISO();

        const postponedStudents = await strapi.entityService.findMany('api::student.student', {
            filters: {
                postponeNotifyDate: { $null: true },
                postponeDate: { $lte: postponementEndTime }
            }
        });

        for (let i = 0; i < postponedStudents.length; i++) {
            const student = postponedStudents[i];

            await strapi.entityService.update('api::student.student', student.id, {
                data: {
                    postponeNotifyDate: DateTimeUtils.nowDateTimeStrapi()
                }
            });

            await strapi.service('api::event-message.event-message').send({
                eventCode: '1007',
                template: 'Postponement end for student {{name}}',
                entity: 'student',
                entityId: student.id,
                receiverId: 'admin-users',
                messageValues: { name: student.name + ' ' + student.lastName }
            });
        }

        const postponedStudentClass = await strapi.entityService.findMany('api::student-class.student-class', {
            filters: {
                postponeDate: { $notNull: true },
                postponeDate: { $lte: postponementEndTime }
            },
            populate: ['student']
        });

        for (let i = 0; i < postponedStudentClass.length; i++) {
            const studentClass = postponedStudentClass[i];

            await strapi.entityService.update('api::student-class.student-class', studentClass.id, {
                data: {
                    postponeDate: null
                }
            });

            await strapi.service('api::event-message.event-message').send({
                eventCode: '1008',
                template: 'Postponement end for student {{name}} subject',
                entity: 'student',
                entityId: studentClass.student.id,
                receiverId: 'admin-users',
                messageValues: { name: studentClass.student.name + ' ' + studentClass.student.lastName }
            });

            await strapi.service('api::student.student').updateStatus(studentClass.student.id);
        }
    },
    async updateStatus(studentId) {
        const studentClasses = await strapi.entityService.findMany('api::student-class.student-class', {
            filters: { student: studentId },
            populate: ['student', 'student.primary_parent']
        });
        const lookup = {
            paymentWriteOff: { status: 'inactive', priority: 1 },
            inactive: { status: 'inactive', priority: 1 },
            new: { status: 'new', priority: 2 },
            active: { status: 'active', priority: 3 },
            firstPaymentPending: { status: 'inProcess', priority: 4 },
            paused: { status: 'inProcess', priority: 4 },
            trial: { status: 'inProcess', priority: 4 },
            cancelled: { status: 'inProcess', priority: 4 },
            postponed: { status: 'postponed', priority: 5 },
            cancellationRequested: { status: 'actionRequired', priority: 6 },
            changeRequested: { status: 'actionRequired', priority: 6 },
            paymentFailed: { status: 'actionRequired', priority: 6 },
            awaitingFeedback: { status: 'actionRequired', priority: 6 },
            paymentOverdue: { status: 'actionRequired', priority: 6 }
        };

        const parentLookup = {
            inactive: 1,
            new: 2,
            active: 3,
            inProcess: 4,
            postponed: 5,
            actionRequired: 6
        };

        let highestPriorityStatus = { status: null, priority: 0 };

        let parentId = '';
        for (const studentClass of studentClasses) {
            const adminStatus = studentClass.adminStatus;
            parentId = studentClass.student.primary_parent.id;
            if (lookup[adminStatus] && lookup[adminStatus].priority > highestPriorityStatus.priority) {
                highestPriorityStatus = lookup[adminStatus];
            }
        }

        if (highestPriorityStatus.status) {
            await strapi.db.query('api::student.student').update({
                where: { id: studentId },
                data: { status: highestPriorityStatus.status }
            });
        }

        const students = await strapi.entityService.findMany('api::student.student', {
            filters: { primary_parent: parentId },
            fields: ['status']
        });

        let highestPriorityParentStatus = { status: null, priority: 0 };

        for (const student of students) {
            const status = student.status;
            if (parentLookup[status] && parentLookup[status] > highestPriorityParentStatus.priority) {
                highestPriorityParentStatus = { status: status, priority: parentLookup[status] };
            }
        }

        if (highestPriorityParentStatus.status) {
            await strapi.db.query('api::parent.parent').update({
                where: { id: parentId },
                data: { status: highestPriorityParentStatus.status }
            });
        }
    }
}));
