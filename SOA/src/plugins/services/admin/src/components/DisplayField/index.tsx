import React from 'react';
import { Box, Flex, Typography, Badge } from '@strapi/design-system';
import AttachmentFormField from '../AttachementFormField';

export default function DisplayField({ fieldData }: { fieldData: any }) {
  const { label, hint, previewType, value } = fieldData;
  const renderElementValue = (type, value) => {
    switch (type) {
      case 'text':
      case 'number':
        return <Typography variant="omega">{value}</Typography>;
      case 'multiSelect':
        return (
          <Flex>
            {value.map((val, idx) => (
              <Badge size="M" key={idx}>
                {val}
              </Badge>
            ))}
          </Flex>
        );
      case 'attachment':
        return <AttachmentFormField attachments={value} />;
      default:
        return 'foo';
    }
  };
  return (
    <Box padding={5} background="neutral0">
      <Flex direction="column" alignItems="stretch" gap={1}>
        <Typography variant="epsilon" fontWeight="bold">
          {label}
        </Typography>

        <div className="displayFieldValue">
          {renderElementValue(previewType, value)}
        </div>
        {hint && (
          <Typography variant="pi" className="displayFieldHint">
            {hint}
          </Typography>
        )}
      </Flex>
    </Box>
  );
}
