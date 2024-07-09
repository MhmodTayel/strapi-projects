const _ = require('lodash');

import dayjsAr from './arDayjs';
export function extractDataByColumns(data: any, columns: any) {
  const extractedData = data.map((item: any) => {
    const extractedItem: any = {};
    for (const column of Object.keys(columns)) {
      if (item.hasOwnProperty(column)) {
        extractedItem[column] = item[column];
      }
    }
    extractedItem.status = statusMap[item.status] || item.status;
    extractedItem.createdAt = dayjsAr(extractedItem.createdAt).format(
      'D MMMM YYYY h:mm A'
    );
    extractedItem.updatedAt = dayjsAr(extractedItem.updatedAt).format(
      'D MMMM YYYY h:mm A'
    );
    return extractedItem;
  });

  return extractedData;
}
const getCurrentActivitySchema = (schema: any, request: any) => {
  const requestStatus = request.status;
  let result = schema.activities.find(
    (activity: any) =>
      activity.statusFrom.includes(requestStatus) &&
      activity.owner == 'employee'
  );
  if (!result) {
    result = schema.activities.find((activity: any) =>
      activity.statusFrom.includes(requestStatus)
    );
  }
  return result;
};
export function prepareUserData(schema: any, userData: any) {
  const userFields = schema.userFields || {};
  const singleObjectUserSchema = Object.assign({}, ...userFields);
  const selectedFields = _.pick(userData, Object.keys(singleObjectUserSchema));
  const mapKeys = Object.entries(selectedFields).map(([key, val]) => [
    singleObjectUserSchema[key],
    val,
  ]);
  const result = Object.fromEntries(mapKeys);
  return result;
}

export function checkEditingAllowance(schema: any, request: any) {
  // const requestStatus = request.status;
  // const currentActivitySchema = schema.activities[requestStatus];
  // const currentActivitySchema = schema.activities.find((activity:any) => activity.statusFrom.includes(requestStatus)&& activity.owner==='employee');
  // const activityOwner = currentActivitySchema.owner;
  // return activityOwner !== 'employee' ? false : true;
  const activity = getCurrentActivitySchema(schema, request);
  return activity.owner === 'employee';
}
export function prepareDataForPreview(schema: any, request: any) {
  // const requestStatus = request.status;
  // const currentActivitySchema = schema.activities[requestStatus];
  const currentActivitySchema = getCurrentActivitySchema(schema, request);
  const requestData = _.pick(request, currentActivitySchema.previewFields);

  const currentFieldsSchema = schema.fields.filter((fieldSchema: any) => {
    const fieldValue = requestData[fieldSchema.id];
    return (
      (fieldValue !== undefined &&
        fieldValue !== null &&
        !Array.isArray(fieldValue)) ||
      (Array.isArray(fieldValue) && fieldValue.length)
    );
    // requestData[field.id]
  });

  const result = currentFieldsSchema.map((fieldSchema: any) => {
    if (Array.isArray(requestData[fieldSchema.id])) {
      fieldSchema.value = requestData[fieldSchema.id].map(
        (item: any) => schema.dictionary[item] || item
      );
    } else {
      fieldSchema.value =
        schema.dictionary[requestData[fieldSchema.id]] ||
        requestData[fieldSchema.id];
    }

    return fieldSchema;
  });
  const metaData = [
    { label: 'رقم الطلب', value: request.id, previewType: 'text' },
    {
      label: 'تايخ الانشاء',
      value: dayjsAr(request.createdAt).format('D MMMM YYYY h:mm A'),
      previewType: 'text',
    },
    {
      label: 'تاريخ اخر تعديل',
      value: dayjsAr(request.updatedAt).format('D MMMM YYYY h:mm A'),
      previewType: 'text',
    },
  ];

  return [...metaData, ...result];
}
export const statusMap: Record<string, string> = {
  reviewing: 'قيد المراجعه',
  rejected: 'تم الرفض',
  waitForPayment: 'فى انتظار الدفع',
  missingData: 'استيفاء بيانات',
  cancelled: 'تم الغاء الطلب',
  paid: 'تم الدفع',
  readyToPick: 'جاهز للاستلام',
  picked: 'تم الاستلام',
};

export function prepareControllers(schema: any, request: any) {
  const currentActivitySchema = getCurrentActivitySchema(schema, request);
  return currentActivitySchema.controllers;
}

export function prepareReqHistory(schema: any, request: any) {
  const history = request.history;
  if (!history) return;
  const dictionary = schema.dictionary;
  const schemaFields = schema.fields;
  const translatedHistory = history.map((historyItem: any) => {
    historyItem.status = dictionary[historyItem.status];
    historyItem.statusFrom = dictionary[historyItem.statusFrom];
    historyItem['editingDate'] = dayjsAr(historyItem.updatedAt).format(
      'D MMMM YYYY'
    );
    historyItem['editingTime'] = dayjsAr(historyItem.updatedAt).format(
      'mm : h A'
    );
    if (historyItem.data) {
      let data: any = [];
      for (const [key, value] of Object.entries(historyItem.data)) {
        let field = {
          ...schemaFields.find(({ id }: { id: string }) => id === key),
        };
        field.value = value;
        data.push(field);
      }
      historyItem.data = data;
    }

    return historyItem;
  });

  return translatedHistory;
}
