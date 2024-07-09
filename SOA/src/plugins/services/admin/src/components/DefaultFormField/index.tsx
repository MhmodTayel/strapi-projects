import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Field,
  FieldHint,
  Flex,
  FieldLabel,
  FieldInput,
  FieldError,
} from '@strapi/design-system';

export default function DefaultFormField({
  fieldData,
  enabled,
  register,
  errors,
}: {
  fieldData: any;
  enabled?: boolean;
  register?: any;
  errors?: any;
}) {
  return (
    <Box padding={5} background="neutral0">
      <Field
        hint={fieldData?.hint}
        error={
          errors?.[fieldData?.id]?.message ||
          (fieldData.id == errors?.serverError?.type &&
            errors?.serverError?.message)
        }
      >
        <Flex direction="column" alignItems="stretch" gap={1}>
          <FieldLabel variant="epsilon" required={fieldData.required}>
            {fieldData.label}
          </FieldLabel>
          <FieldInput
            type={fieldData.previewType}
            variant="epsilon"
            disabled={enabled ? false : true}
            required={fieldData.required}
            value={fieldData?.value}
            {...(register &&
              register(
                fieldData?.id,
                ...fieldData.validations.map((validation: any) => ({
                  [validation.type]: validation.params.toString(),
                  maxLength: {
                    value: fieldData.previewType == 'number' ? 8 : 300,
                    message: `${fieldData.label} تعدي الحد الاقصي`,
                  },
                  pattern: {
                    value:
                      fieldData.previewType == 'number'
                        ? /^(\d{1,}|\d{0,}\.\d{1,2})$/
                        : /\S+/,
                    message:
                      fieldData.previewType == 'number'
                        ? 'برجاء كتابه رقم صحيح'
                        : 'برجاء وضع تعليق مناسب',
                  },
                }))
              ))}
          />

          <FieldError />
          <FieldHint />
        </Flex>
      </Field>
    </Box>
  );
}
