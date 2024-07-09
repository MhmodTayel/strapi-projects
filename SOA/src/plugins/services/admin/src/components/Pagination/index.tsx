import {
  Dots,
  NextLink,
  PageLink,
  Pagination as PaginationEle,
  PreviousLink,
} from '@strapi/design-system';
import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Pagination() {
  return (
    <PaginationEle>
      <NextLink as={NavLink} to="/2">
        Next page
      </NextLink>
      <PageLink as={NavLink} to="/1">
        1
      </PageLink>
      <PageLink as={NavLink} to="/2">
        2
      </PageLink>
      <PreviousLink as={NavLink} to="/1">
        Previous
      </PreviousLink>
     
      
    </PaginationEle>
  );
}
