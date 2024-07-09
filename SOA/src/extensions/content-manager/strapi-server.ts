import _ from 'lodash';

export default (plugin) => {
  const originalControllers = {
    relations: {
      findAvailable: plugin.controllers.relations.findAvailable,
    },
  };

  plugin.controllers.relations.findAvailable = async (ctx) => {
    const { model, targetField } = _.get(ctx, 'request.params');
    const targetModel = strapi.getModel(model).attributes[targetField].target;
    const relationWithPublishedAt = [
      'api::tag.tag',
      'api::category.category',
      'api::authority-board.authority-board',
      'api::new.new',
      'api::source.source',
    ];
    const filters: { publishedAt?: any; categories?: any; Title?: any } = {};

    if (relationWithPublishedAt.includes(targetModel)) {
      filters.publishedAt = { $ne: null };
    }

    if (targetField == 'slider') {
      filters.categories = { Title: { $eq: 'slider' } };
    } else if (ctx.request.url.includes('multi-fields.news/category')) {
      filters.Title = { $ne: 'slider' };
    }

    _.set(ctx, 'request.query.filters', filters);

    await originalControllers.relations.findAvailable(ctx);
  };

  return plugin;
};
