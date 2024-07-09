import React from 'react';
import {
  Box,
  MultiSelect,
  MultiSelectOption,
  Field,
  FieldLabel,
  FieldHint,
  Flex,
} from '@strapi/design-system';

export default function ArrayFormField({ fieldData }: { fieldData: any }) {
  return (
    <Box padding={5} background="neutral0">
      <Field hint={fieldData.hint}>
        <Flex direction="column" alignItems="stretch">
          <FieldLabel variant="epsilon">{fieldData.label} </FieldLabel>
          <MultiSelect
            // label="الاعضاء"
            value={fieldData.value}
            withTags
            disabled={true}
          >
            {fieldData.value.map((item: any, idx: any) => (
              <MultiSelectOption key={`box-${idx}`} value={item}>
                {item}
              </MultiSelectOption>
            ))}
          </MultiSelect>
          <FieldHint />
        </Flex>
      </Field>
    </Box>
  );
}
