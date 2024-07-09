import React from 'react';
import { Box, Grid, GridItem } from '@strapi/design-system';
import ServiceCard from '../ServiceCard';

export default function ServicesGrid({ services }: { services: any }) {
  return (
    <Box height="100%" width="100%" background="neutral150" padding={6}>
      <Grid gap={6}>
        {services.map((service: any, idx: number) => (
          <GridItem
            col={4}
            shadow="tableShadow"
            padding={3}
            hasRadius
            background="neutral0"
            key={`${idx}-${service.id}`}
          >
            <ServiceCard data={service.attributes} />
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
}
