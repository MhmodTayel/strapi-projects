import * as yup from 'yup';
const _ = require('lodash');
import utils from '@strapi/utils';
const { errors } = utils;

const createYupSchema = (schema, config) => {
  const { id, validationType, validations = [] } = config;
  if (!yup[validationType]) {
    return schema;
  }
  let validator = yup[validationType]();

  validations.forEach((validation) => {
    const { params, type } = validation;
    if (!validator[type]) {
      return;
    }
    validator = validator[type](...params);
  });

  schema[id] = validator;
  return schema;
};

const getServiceSchema = (slug, dynamicServices) => {
  return dynamicServices.find((service) => service.slug === slug);
};

const getCurrentActivitySchema = ({
  dynamicService,
  statusFrom,
  statusTo,
  userType,
}) => {
  return dynamicService.activities.find((activity: any) => {
    return (
      activity.statusFrom?.includes(statusFrom) &&
      (statusTo ? activity.statusTo?.includes(statusTo) : true) &&
      activity.owner === userType
    );
  });
};

const checkActivityValidations = async ({
  event,
  userType,
  statusFrom,
  dynamicServices,
}) => {
  const dynamicService = getServiceSchema(event.model.uid, dynamicServices);

  const currentActivity = getCurrentActivitySchema({
    dynamicService,
    statusFrom,
    statusTo: event.params.data.status,
    userType,
  });
  if (!currentActivity) {
    throw new errors.ValidationError('Action not allowed');
  }
  const statusTo = event.params.data.status || currentActivity.statusTo[0];

  const {
    fields: { [statusTo]: activityFields },
  } = currentActivity;

  const schemaFields = dynamicService.fields.filter((field) =>
    activityFields.includes(field.id)
  );

  const yupSchema = schemaFields.reduce(createYupSchema, {});
  const validateSchema = yup.object().shape(yupSchema);

  const dataToValidate = _.pick(event.params.data, activityFields);
  try {
    const validatedData = await validateSchema.validate(dataToValidate, {
      abortEarly: false,
    });

    const dataToOmit = dynamicService.fields
      .filter((field) => !activityFields.includes(field.id))
      .map((item) => item.id);

    event.params.data = _.omit(event.params.data, dataToOmit);
    event.params.data = _.merge(event.params.data, validatedData);
    event.params.data.validatedFields = validatedData;
  } catch (error) {
    throw new errors.ValidationError('VALIDATIONS', {
      errors: error.errors.map((message) => ({
        path: [message.split(' ')[0]],
        message,
        name: 'ValidationError',
      })),
    });
  }
  event.params.data.status = statusTo;
};

module.exports = {
  createYupSchema,
  checkActivityValidations,
};
