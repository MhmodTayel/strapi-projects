'use strict';
var _ = require('lodash');

/**
 * student-feed service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::student-feed.student-feed', ({ strapi }) => ({
    async create(params) {
        // don't duplicate the feeds
        let result = _.first(
            await strapi.entityService.findMany('api::student-feed.student-feed', {
                filters: params?.data
            })
        );
        if (!result) {
            result = await super.create(params);
        }
        return result;
    },

    async getFeed(query) {
        try {
            const findQuery = {
                fields: [],
                filters: {},
                populate: [],
                sort: ['createdAt:desc']
            };

            if (query?.studentIds) {
                findQuery.filters.student = {
                    id: {
                        $in: query?.studentIds
                    }
                };
            } else {
                return { message: 'Missing studentIds parameter', httpCode: 400 };
            }

            if (query.classIds) {
                findQuery.filters.register = {
                    class: {
                        id: {
                            $in: query.classIds
                        }
                    }
                };
            }

            if (findQuery.pagination) {
                findQuery.pagination = query.pagination;
            }

            if (query.sort) {
                findQuery.sort.push(..._.toArray(query.sort));
            }

            if (query.fields) {
                findQuery.fields.push(..._.toArray(query.fields));
            }

            if (_.isArray(query.populate)) {
                findQuery.populate.push(..._.toArray(query.populate));
            }

            const { results, pagination } = await super.find(findQuery);

            return { results, pagination };
        } catch (err) {
            return { message: err.message, httpCode: 500 };
        }
    }
}));
