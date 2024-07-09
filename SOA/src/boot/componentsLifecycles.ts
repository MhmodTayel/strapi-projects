import utils from '@strapi/utils';
const { errors } = utils;

const commentsValidation = (event) => {
  const { field, error_msg } = event.params.data;
  if (!error_msg || !field.length) {
    throw new errors.ValidationError(`required data`, {
      errors: [
        {
          path: ['validation'],
          message: 'fields and error message are required',
          name: 'ValidationError',
        },
      ],
    });
  }
};
const dateRangeValidation = async (event) => {
  const { data } = event.params;
  const {
    request: { body },
  } = strapi.requestContext.get();

  const checkFromDateUniqueness = await strapi.db
    .query('api::authority-board.authority-board')
    .findOne({
      where: {
        ...(body.id && { id: { $ne: body.id } }),
        boardDate: { from: body.boardDate.from },
        locale: body.locale,
      },
    });
  const checkToDateUniqueness = await strapi.db
    .query('api::authority-board.authority-board')
    .findOne({
      where: {
        ...(body.id && { id: { $ne: body.id } }),
        boardDate: { to: body.boardDate.to },
        locale: body.locale,
      },
    });
  if (checkFromDateUniqueness) {
    throw new errors.ValidationError(`INVALID_DATE`, {
      errors: [
        {
          path: ['boardDate'],
          message: 'already exist an authority board with the same start date',
          name: 'ValidationError',
        },
      ],
    });
  }
  if (checkToDateUniqueness) {
    throw new errors.ValidationError(`INVALID_DATE`, {
      errors: [
        {
          path: ['boardDate'],
          message: 'already exist an authority board with the same end date',
          name: 'ValidationError',
        },
      ],
    });
  }
  if (data.from > data.to || data.from === data.to) {
    throw new errors.ValidationError(`INVALID_DATE`, {
      errors: [
        {
          path: ['boardDate'],
          message: 'start date must be less than end date',
          name: 'ValidationError',
        },
      ],
    });
  }
};
const validateTalentWork = (event) => {
  const ctx = strapi.requestContext.get();
  const { dateOfBirth, dateOfDeath, theirWork } = ctx.request.body;
  const dob = new Date(dateOfBirth);
  const dod = new Date(dateOfDeath);
  const now = new Date();
  if (dob > now) {
    throw new errors.ValidationError('Date of birth cannot be in the future');
  }

  if (dod > now) {
    throw new errors.ValidationError('Date of death cannot be in the future');
  }

  if (dateOfDeath && dod < dob) {
    throw new errors.ValidationError(
      'Date of death cannot be before date of birth'
    );
  }
  const currentYear = new Date().getFullYear();
  if (theirWork.length) {
    const invalidYears = theirWork
      .filter((work) => {
        return (
          parseInt(work.year) > currentYear ||
          parseInt(work.year) < dob.getFullYear() ||
          (dateOfDeath && parseInt(work.year) > dod?.getFullYear())
        );
      })
      .map((work) => parseInt(work.year));

    if (invalidYears.length != 0) {
      throw new errors.ValidationError(`Invalid years: ${invalidYears}`);
    }
  }
};

export default (strapi) => {
  strapi.db.lifecycles.subscribe({
    models: ['validation.validation'],
    beforeUpdate: (event) => {
      commentsValidation(event);
    },
    beforeCreate: (event) => {
      commentsValidation(event);
    },
  });
  strapi.db.lifecycles.subscribe({
    models: ['custom-fields.date-range'],
    beforeCreate: async (event) => {
      await dateRangeValidation(event);
    },
    beforeUpdate: async (event) => {
      await dateRangeValidation(event);
    },
  });
  strapi.db.lifecycles.subscribe({
    models: ['multi-fields.news'],
    beforeCreate: async (event) => {
      const { Title, category } = event.params.data;
      if (!Title || !category.connect.length) {
        throw new errors.ValidationError(`required data`, {
          errors: [
            {
              path: [''],
              message: 'Title and category are required',
              name: 'ValidationError',
            },
          ],
        });
      }
    },
    beforeUpdate: async (event) => {
      const {
        data: {
          Title,
          category: { connect, disconnect },
        },
        where,
      } = event.params;
      if (!Title || (disconnect.length && !connect.length)) {
        throw new errors.ValidationError(`required data`, {
          errors: [
            {
              path: [''],
              message: 'Title and category are required',
              name: 'ValidationError',
            },
          ],
        });
      }
    },
  });
  strapi.db.lifecycles.subscribe({
    models: ['work.their-work'],
    beforeCreate: (event) => {
      validateTalentWork(event);
    },
    beforeUpdate: (event) => {
      validateTalentWork(event);
    },
  });
};
