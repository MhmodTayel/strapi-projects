'use strict';

/**
 *  register-student controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::register-student.register-student', ({ strapi }) => ({
    async bulkUpdate(ctx) {
        const { classTopics, data } = ctx.request.body;
        const response = await strapi
            .service('api::register-student.register-student')
            .bulkUpdate(ctx.request.body, ctx.state.user);

        if (classTopics?.length)
            for (let i = 0; i < classTopics.length; i++) {
                const classTopic = await strapi.db.query('api::class-topic.class-topic').findOne({
                    where: { topic: classTopics[i].topicId }
                });

                if (classTopic) {
                    if (
                        Object.prototype.hasOwnProperty.call(classTopics[i], 'taught') &&
                        classTopics[i].taught == false
                    ) {
                        await strapi.db.query('api::class-topic.class-topic').delete({ where: { id: classTopic.id } });
                    } else
                        await strapi.db.query('api::class-topic.class-topic').update({
                            where: { topic: classTopics[i].topicId },
                            data: {
                                disabled: classTopics[i].disabled,
                                taught: classTopics[i].taught
                            }
                        });
                } else {
                    await strapi.db.query('api::class-topic.class-topic').create({
                        data: {
                            disabled: classTopics[i].disabled,
                            taught: classTopics[i].taught,
                            topic: classTopics[i].topicId,
                            class: classTopics[i].class,
                            register: classTopics[i].register
                        }
                    });
                }

                if (classTopics[i].taught) {
                    const topic = await strapi.db.query('api::topic.topic').findOne({
                        where: { id: classTopics[i].topicId },
                        populate: ['topic_links']
                    });
                    if (topic && topic.topic_links.length) {
                        const topic_links = topic.topic_links;
                        for (let i = 0; i < topic_links.length; i++) {
                            const classTopic = await strapi.db.query('api::class-topic.class-topic').findOne({
                                where: { topic: topic_links[i].id }
                            });
                            if (classTopic) {
                                await strapi.db.query('api::class-topic.class-topic').update({
                                    where: { topic: topic_links[i].id },
                                    data: {
                                        taught: classTopics[i].taught
                                    }
                                });
                            } else {
                                await strapi.db.query('api::class-topic.class-topic').create({
                                    data: {
                                        disabled: classTopics[i].disabled,
                                        taught: classTopics[i].taught,
                                        topic: topic_links[i].id,
                                        class: classTopics[i].class,
                                        register: classTopics[i].register
                                    }
                                });
                            }
                        }
                    }
                }
            }
        if (response && response.message) {
            if (response.httpCode == 400) {
                return ctx.badRequest(response.message);
            } else if (response.httpCode == 404) {
                return ctx.notFound(response.message);
            } else {
                return ctx.internalServerError(response.message);
            }
        }


        return response;
    }
}));
