import React, { useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  Box,
  Flex,
  Typography,
  IconButton,
  VisuallyHidden,
} from '@strapi/design-system';

import { Pencil,  } from '@strapi/icons';
import { extractDataByColumns } from '../../helpers';

type Props = {
  data: any;
  // handleDelete: any;
  handleEdit: any;
  columns: any;
};

const BaseTable: React.FC<Props> = ({
  data,
  columns,
  // handleDelete,
  handleEdit,
}) => {
  return (
    <Box
      background="neutral0"
      hasRadius={true}
      shadow="filterShadow"
      padding={8}
      style={{ marginTop: '10px' }}
    >
      <Table colCount={4} rowCount={10}>
        <Thead>
          <Tr>
            {Object.values(columns).map((column: any, idx: number) => (
              <Th key={idx}>
                <Typography variant="sigma">{column}</Typography>
              </Th>
            ))}
            <Th>
              <VisuallyHidden>أجراءات</VisuallyHidden>
            </Th>
          </Tr>
        </Thead>

        <Tbody>
          {extractDataByColumns(data, columns).map((item: any) => {
            return (
              <Tr key={item.id}>
                {Object.keys(item).map((key: any, idx: number) => (
                  <Td key={idx}>
                    <Typography textColor="neutral800">{item[key]}</Typography>
                  </Td>
                ))}

                <Td>
                  <Flex style={{ justifyContent: 'end' }}>
                    <IconButton
                      onClick={() => handleEdit(item.id)}
                      label="Edit"
                      noBorder
                      icon={<Pencil />}
                    />
                  </Flex>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
};

export default BaseTable;
