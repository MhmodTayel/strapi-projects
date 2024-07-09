const _ = require('lodash');

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::family-link.family-link', ({ strapi }) => ({
    /**
     * Returns the relationship for parent or student by id
     * @param {string} type
     * @param {int} entityId
     * @returns {{familyLinkId:int,studentIds:int[],parentIds:int[]}}
     */
    async findByEntityId(type, entityId) {
        const query = {
            fields: ['id'],
            populate: {
                parents: {
                    fields: ['id']
                },
                students: {
                    fields: ['id']
                }
            },
            limit: 1
        };
        if (type === 'student') {
            query.filters = {
                students: {
                    id: entityId
                }
            };
        } else if (type === 'parent') {
            query.filters = {
                parents: {
                    id: entityId
                }
            };
        } else {
            return {
                familyLinkId: undefined,
                studentIds: [],
                parentIds: []
            };
        }

        const familyLink = _.first(await strapi.entityService.findMany('api::family-link.family-link', query));

        if (familyLink) {
            return {
                familyLinkId: familyLink.id,
                parentIds: familyLink.parents.map((e) => e.id),
                studentIds: familyLink.students.map((e) => e.id)
            };
        }

        return {
            familyLinkId: undefined,
            studentIds: [],
            parentIds: []
        };
    },

    /**
     * Creates or updates the relationship for parents or students.
     * @param {int[]} parentIds
     * @param {int[]} studentIds
     * @returns family link id
     */
    async createOrUpdate(parentIds, studentIds) {
        let familyLink = _.first(
            await strapi.entityService.findMany('api::family-link.family-link', {
                fields: ['id'],
                populate: {
                    parents: {
                        fields: ['id']
                    },
                    students: {
                        fields: ['id']
                    }
                },
                filters: {
                    $or: [
                        {
                            parents: parentIds
                        },
                        {
                            students: studentIds
                        }
                    ]
                },
                limit: 1
            })
        );

        if (!familyLink && parentIds?.length && studentIds?.length) {
            familyLink = await strapi.entityService.create('api::family-link.family-link', {
                data: {
                    parents: parentIds,
                    students: studentIds
                }
            });
            return familyLink.id;
        } else if (familyLink) {
            familyLink = await strapi.entityService.update('api::family-link.family-link', familyLink.id, {
                data: {
                    parents: familyLink.parents.map((e) => e.id).concat(parentIds),
                    students: familyLink.students.map((e) => e.id).concat(studentIds)
                }
            });
            return familyLink.id;
        }
        return true;
    },

    /**
     * if you can link parents to a specific student or parents to students
     * Note: don't pass the exists parents or students
     * @param {*} studentIds
     * @param {*} parentIds
     * @returns
     */
    async canLink(entityId, entityType, studentIds, parentIds) {
        if (!studentIds?.length || !parentIds?.length) {
            return true;
        } else {
            const familyLinks = await strapi.entityService.findMany('api::family-link.family-link', {
                fields: ['id'],
                populate: {
                    parents: {
                        fields: ['id']
                    },
                    students: {
                        fields: ['id']
                    }
                },
                filters: {
                    $or: [
                        {
                            parents: parentIds
                        },
                        {
                            students: studentIds
                        }
                    ]
                }
            });

            if (entityType === 'student') {
                return familyLinks.filter((e) => !e.students.find((a) => a.id.toString() === entityId?.toString()));
            } else if (entityType === 'parent') {
                return familyLinks.filter((e) => !e.parents.find((a) => a.id.toString() === entityId?.toString()));
            }
            return false;
        }
    },
    async canUnLinkByEntityId(type, entityId, entityTypeToUnlink, entityIdsToUnlink) {
        const entityFamilyLink = await this.findByEntityId(type, entityId);
        if (!entityFamilyLink.familyLinkId) return true;

        const excludedEntityIds = _.toArray(entityIdsToUnlink).map((e) => _.toString(e));
        let parentIds = entityFamilyLink.parentIds;
        let studentIds = entityFamilyLink.studentIds;

        if (entityTypeToUnlink === 'parent') {
            parentIds = parentIds.filter((e) => !excludedEntityIds.find((a) => a.toString() === e.toString()));
        } else if (entityTypeToUnlink === 'student') {
            studentIds = studentIds.filter((e) => !excludedEntityIds.find((a) => a.toString() === e.toString()));
        } else {
            return new Error('entityTypeToUnlink required');
        }

        const query = {
            fields: ['id'],
            limit:1
        };

        if (entityTypeToUnlink === 'parent') {
            // student has those parents connected for any student classes
            query.filters = {
                student: entityId,
                billing_parent: excludedEntityIds
            };
        } else if (entityTypeToUnlink === 'student') {
            // parent connected to any student classes for those students
            query.filters = {
                student: excludedEntityIds,
                billing_parent: entityId
            };
        }

        const studentClassesHasSameParents = await strapi.entityService.findMany(
            'api::student-class.student-class',
            query
        );
        if (studentClassesHasSameParents?.length) {
            return new Error('Can not unlink. This is set as a billing parent for the student');
        }
        return true;
    },

    /**
     * unlink students or parents of the relation.
     * as well as if the relation didn't has parents or students we delete the family link.
     * @param {*} type which will be student or parent
     * @param {*} entityId
     * @param {*} entityTypeToUnlink which will be student or parent
     * @param {*} entityIdsToUnlink array for parents or students to exclude them of the relation
     * @returns
     */
    async unLinkByEntityId(type, entityId, entityTypeToUnlink, entityIdsToUnlink) {
        // validate
        if ((await this.canUnLinkByEntityId(type, entityId, entityTypeToUnlink, entityIdsToUnlink)) instanceof Error)
            return false;

        const entityFamilyLink = await this.findByEntityId(type, entityId);
        if (!entityFamilyLink.familyLinkId) return true;

        const excludedEntityIds = _.toArray(entityIdsToUnlink).map((e) => _.toString(e));
        let parentIds = entityFamilyLink.parentIds;
        let studentIds = entityFamilyLink.studentIds;

        if (entityTypeToUnlink === 'parent') {
            parentIds = parentIds.filter((e) => !excludedEntityIds.find((a) => a.toString() === e.toString()));
        } else if (entityTypeToUnlink === 'student') {
            studentIds = studentIds.filter((e) => !excludedEntityIds.find((a) => a.toString() === e.toString()));
        }

        // delete the relation if it has a single entity or nothing
        if (
            (!parentIds?.length && !studentIds?.length) ||
            (parentIds?.length === 1 && !studentIds?.length) ||
            (studentIds?.length === 1 && !parentIds?.length)
        ) {
            await strapi.entityService.delete('api::family-link.family-link', entityFamilyLink.familyLinkId);
            return true;
        }

        // update the relation
        switch (entityTypeToUnlink) {
            case 'parent':
                familyLink = await strapi.entityService.update(
                    'api::family-link.family-link',
                    entityFamilyLink.familyLinkId,
                    {
                        data: {
                            parents: parentIds
                        }
                    }
                );
                break;

            case 'student':
                familyLink = await strapi.entityService.update(
                    'api::family-link.family-link',
                    entityFamilyLink.familyLinkId,
                    {
                        data: {
                            students: studentIds
                        }
                    }
                );
                break;
        }
        return true;
    }
}));
