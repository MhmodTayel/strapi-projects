import React from 'react';
import {
  BaseHeaderLayout,
  Box,
  Breadcrumbs,
  Crumb,
  Button,
} from '@strapi/design-system';
import { ChevronLeft } from '@strapi/icons';
import { Link, useParams } from 'react-router-dom';

export default function RequestPageHeader({
  serviceTitle,
}: {
  serviceTitle: string;
}) {
  const { slug } = useParams<{ slug: string }>();
  return (
    <>
      <Box background="neutral100" className="appHeader">
        <BaseHeaderLayout
          title={serviceTitle}
          subtitle={
            <Breadcrumbs label="folders" marginTop={2}>
              <Crumb>الطلبات</Crumb>
              <Crumb>عرض بيانات الطلب</Crumb>
            </Breadcrumbs>
          }
          as="h2"
        />
        <Link to={`/plugins/services/${slug}`}>
          <Button
            variant="secondary"
            endIcon={<ChevronLeft />}
          >
            العوده الي الطلبات
          </Button>
        </Link>
      </Box>
    </>
  );
}
