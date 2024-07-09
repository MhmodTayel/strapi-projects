import React from 'react';
import { Box, Flex, LinkButton, Typography } from '@strapi/design-system';
import { ExternalLink } from '@strapi/icons';

export default function ServiceCard({ data }: { data: any }) {
  return (
    <>
      <img alt="img" src="https://picsum.photos/id/12/50/50" />
      <Flex paddingTop={3} alignItems="flex-start" direction="column">
        <Typography fontWeight="bold" variant="beta">
          {data.label}
        </Typography>
        <Box width="100%" paddingTop={100}>
          <Typography variant="pi" textColor="neutral600">
            {data.description}
          </Typography>
        </Box>
      </Flex>
      <Flex justifyContent="flex-end" paddingTop={5}>
        <Box paddingRight={1}>
          <LinkButton
            to={`/plugins/services/${data.slug}`}
            endIcon={<ExternalLink />}
            variant="tertiary"
          >
            الذهاب الي الطلبات
          </LinkButton>
        </Box>
      </Flex>
    </>
  );
}
