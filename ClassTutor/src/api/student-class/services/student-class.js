'use strict';

var _ = require('lodash');
const { confirmPayment } = require('./confirm-payment');
const { getClassesForSales } = require('./get-classes-for-sales');
const { createStudentClass } = require('./create-student-class');
const { updateStudentClass, updateStatus } = require('./update-student-class');

/**
 * student-class service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::student-class.student-class', ({ strapi }) => ({
    // temp overrides
    async create(params) {
        return await createStudentClass(super.create, params);
    },
    async update(entityId, params) {
        return await updateStudentClass(super.update, entityId, params);
    },
    async getClassesForSales(studentId, classType, subjectId, yearId,classId) {
        return await getClassesForSales(studentId, classType, subjectId, yearId,classId);
    },
    async confirmPayment(studentId, studentClasses) {
        return await confirmPayment(strapi, studentId, studentClasses);
    },
    async updateStatus() {
        await updateStatus(strapi);
    }
}));
