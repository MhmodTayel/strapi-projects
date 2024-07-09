import utils from '@strapi/utils';
const { errors } = utils;
const {
  checkRequestStatus,
  requestStatus,
} = require('../../../../helpers/generalHelpers');
const {
  getTemplates,
  sendPushToken,
  createInAppNotification,
} = require('../../../../helpers/notificationHelpers');
function getFieldsWithValue(obj, value) {
  const fields = [];

  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const fieldValue = obj[key];

      if (fieldValue === value) {
        fields.push(key);
      } else if (typeof fieldValue === 'object' && fieldValue !== null) {
        const nestedFields = getFieldsWithValue(fieldValue, value);
        if (nestedFields.length > 0) {
          fields.push(`${key}.${nestedFields.join('.')}`);
        }
      }
    }
  }

  return fields;
}
function checkRequiredFields(event) {
  const request = event.params.data;
  const requiredFields = [];
  const fields = getFieldsWithValue(request, 'اخري');
  if (fields.length != 0) {
    fields.forEach((field) => {
      if (
        !request[`another_${field}`] ||
        request[`another_${field}`].length == 0
      ) {
        requiredFields.push(`another_${field}`);
      }
    });
  }
  const attributes = event.model.attributes;
  for (const field in attributes) {
    if (
      field == 'license_front' ||
      field == 'license_back' ||
      field == 'validation'
    )
      continue;
    if (
      (attributes[field].required &&
        !request.field &&
        request[field] == undefined) ||
      attributes[field].type == 'relation'
    ) {
      requiredFields.push(attributes[field].columnName || field);
    }
  }

  if (request.talent?.includes('عزف'))
    requiredFields.push('talent_instruments');
  if (request.talent?.includes('فنون تشكيليه'))
    requiredFields.push('talent_art');
  if (request.talent?.includes('اخري')) requiredFields.push('another_talent');
  if (request.accents === true) requiredFields.push('another_accents');
  if (request.drive === true)
    requiredFields.push('vehicle', 'license_front', 'license_back');
  return requiredFields;
}

function calculateAge(birthdate) {
  const today = new Date();
  const birthdateObj = new Date(birthdate);
  let age = today.getFullYear() - birthdateObj.getFullYear();
  const monthDiff = today.getMonth() - birthdateObj.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthdateObj.getDate())
  ) {
    age--;
  }
  return age;
}

function hookLogic(event) {
  const data = event.params.data;

  const age = calculateAge(data.birth_date);

  const { min_playable_age, max_playable_age } = data;

  const playable_age_errors = [];

  if (
    (min_playable_age && !max_playable_age) ||
    (!min_playable_age && max_playable_age)
  ) {
    if (!min_playable_age) {
      playable_age_errors.push({
        field: 'min_playable_age',
        message: 'min_playable_age is required.',
      });
    } else if (!max_playable_age) {
      playable_age_errors.push({
        field: 'max_playable_age',
        message: 'max_playable_age is required.',
      });
    }
  }

  if (
    (min_playable_age && min_playable_age < age - 12) ||
    min_playable_age > age ||
    min_playable_age == 0
  )
    playable_age_errors.push({
      field: 'min_playable_age',
      message: "Minimum playable age cant't exceed -12 years",
    });
  if (max_playable_age) {
    if (
      max_playable_age > age + 15 ||
      max_playable_age < age ||
      max_playable_age == 0
    )
      playable_age_errors.push('max_playable_age', {
        field: 'max_playable_age',
        message: "Maximum playable age cant't exceed +15 years",
      });
  }

  if (playable_age_errors.length != 0) {
    throw new errors.ValidationError(`ValidationError`, {
      errors: playable_age_errors.map((error) => ({
        path: [error.field],
        message: error.message,
        name: 'ValidationError',
      })),
    });
  }

  const requiredFields = checkRequiredFields(event).filter(function (field) {
    return !(
      (field.split('.')[0] in data &&
        data[field] !== null &&
        data[field] !== '') ||
      field == 'createdBy' ||
      field == 'updatedBy' ||
      field.includes('another_vehicle')
    );
  });

  if (data.publishedAt) {
    requiredFields.length = 0;
  } else {
    if (requiredFields.length != 0) {
      throw new errors.ValidationError(`REQUIRED_FIELDS`, {
        errors: requiredFields.map((field) => ({
          path: [field],
          message: `${field} is required`,
          name: 'ValidationError',
        })),
      });
    }
    if (data.terms_and_conditions === false)
      throw new errors.ValidationError(`terms_and_conditions`, {
        errors: [
          {
            path: ['terms_and_conditions'],
            message: `you must agree on terms and conditions`,
            name: 'ValidationError',
          },
        ],
      });

    if (new Date(data.birth_date) >= new Date())
      throw new errors.ValidationError(`INVALID_BIRTH_DATE`, {
        errors: [
          {
            path: ['birth_date'],
            message: `invalid birth date`,
            name: 'ValidationError',
          },
        ],
      });
  }
}

function changeStatus(event, reqStatus) {
  const {
    params: { data },
  } = event;
  const ctx = strapi.requestContext.get();
  const fromAdminPortal = ctx.request.url.includes('/content-manager/');
  if (!fromAdminPortal) data.status = 'تم التسليم من قبل العضو (قيد المراجعة)';
  else if (fromAdminPortal && reqStatus == requestStatus.PUBLISH)
    data.status = 'تم الموافقة';
  else data.status = 'تم الرفض';
}

export default {
  async beforeCreate(event) {
    const ctx = strapi.requestContext.get();
    const user = await strapi.plugins[
      'users-permissions'
    ].services.jwt.getToken(ctx);
    event.params.data.user = {
      disconnect: [],
      connect: [
        {
          id: user.id,
          position: {
            end: true,
          },
        },
      ],
    };

    const oldData = await strapi.db.query('api::profile.profile').findOne({
      where: {
        user: {
          id: user.id,
        },
      },
    });
    if (oldData)
      throw new errors.ApplicationError(`USER`, {
        errors: [
          {
            path: ['user'],
            message: `Profile already created for this account`,
            name: 'ApplicationError',
          },
        ],
      });

    event.params.data.publishedAt = null;
    event.params.data.status = 'تم التسليم من قبل العضو (قيد المراجعة)';
    hookLogic(event);
  },
  async afterCreate(event) {
    // const userId = event.params.data.user.connect[0].id;
    const ctx = strapi.requestContext.get();
    const userId = ctx.state.user.id;
    strapi.db.query('plugin::users-permissions.user').update({
      where: { id: userId },
      data: { profileId: event.result.id },
    });
  },
  async beforeUpdate(event) {
    const ctx = strapi.requestContext.get();
    const where = event.params.where;

    const oldData = await strapi.db.query('api::profile.profile').findOne({
      where,
      populate: [
        'attachments',
        'user',
        'validation',
        'syndicate_card_back',
        'syndicate_card_front',
        'national_id_front',
        'national_id_back',
        'license_front',
        'license_back',
        'validation',
      ],
    });

    const reqState = checkRequestStatus(event.params.data, oldData);

    changeStatus(event, reqState);

    const user = await strapi.plugins[
      'users-permissions'
    ].services.jwt.getToken(ctx);

    if (
      !ctx.request.url.includes('/content-manager/') &&
      oldData.user.id != user.id
    ) {
      throw new errors.UnauthorizedError(`USER`);
    }
    event.params.data.user = {
      disconnect: [],
      connect: [
        {
          id: oldData.user.id,
          position: {
            end: true,
          },
        },
      ],
    };

    if (!ctx.request.url.includes('/content-manager/') && oldData.publishedAt) {
      const date = new Date();
      const publishedDate = new Date(oldData.publishedAt);
      const allawedDate = new Date(
        publishedDate.setMonth(publishedDate.getMonth() + 3)
      );
      const canUpdate = date >= allawedDate;
      if (!canUpdate) {
        throw new errors.ForbiddenError(
          `Not allowed to update before ${allawedDate}`,
          {
            message: allawedDate,
            name: 'NOT_ALLOWED_PERIOD',
          }
        );
      }
    }
    if (
      ctx.request.url.includes('/content-manager/') &&
      !event.params.data.publishedAt
    ) {
      if (
        !event.params.data.validation?.length &&
        !oldData.validation?.length
      ) {
        event.params.data.status = 'تم التسليم من قبل العضو (قيد المراجعة)';
      }
    }
    event.params.data.user = {
      disconnect: [],
      connect: [
        {
          id: oldData.user.id,
          position: {
            end: true,
          },
        },
      ],
    };

    if (reqState === requestStatus.PUBLISH) {
      if (oldData.validation.length) {
        throw new errors.ValidationError(`ValidationError`, {
          errors: [
            {
              path: ['validation'],
              message:
                "You can't publish this profile before clear all valiation",
              name: 'ValidationError',
            },
          ],
        });
      }
      // hookLogic({ params: { data: oldData } });
      return;
    }
    if (event.params.data.publishedAt == null && oldData.publishedAt != null) {
      const eventData = event.params.data;
      event.params.data = { ...oldData, ...eventData };
      event.params.data.publishedAt = null;
      hookLogic(event);
      return;
    }
    if (reqState === requestStatus.UPDATE) event.params.data.publishedAt = null;
    hookLogic(event);
  },

  async afterUpdate(event) {
    const { validation, user } = event.params.data;

    if (validation?.length) {
      const userId = user.connect[0]?.id;
      const userData = await strapi.db
        .query('plugin::users-permissions.user')
        .findOne({
          where: {
            id: userId,
          },
          populate: ['pushTokens', 'role'],
        });

      const templates = await getTemplates('update-cv');

      await createInAppNotification('update-cv', userData);
      await sendPushToken(userData, templates);
    }
  },
};
