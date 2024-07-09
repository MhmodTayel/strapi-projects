import React from 'react';
import _ from 'lodash';
import {
  Box,
  Typography,
  Divider,
  Icon,
  Grid,
  GridItem,
  Flex,
} from '@strapi/design-system';
import { Information } from '@strapi/icons';

export default function UserDataCard({ userData }: { userData: any }) {
  return (
    <Box padding={6} background="neutral0" marginBottom={4}>
      <Flex>
        <Icon
          marginLeft={2}
          width={`${25 / 16}rem`}
          height={`${25 / 16}rem`}
          as={Information}
        />
        <Typography variant="beta">بيانات مقدم الطلب </Typography>
        {!userData.user && (
          <>
            <span> &nbsp; &nbsp;</span>
            <Typography variant="omega" style={{ color: 'red' }}>
              {' '}
              ( المستخدم غير موجود ){' '}
            </Typography>
          </>
        )}
      </Flex>
      <Divider unsetMargin={false} />

      <Box
        hasRadius={true}
        shadow="filterShadow"
        style={{ marginTop: '10px' }}
        padding={4}
      >
        <Grid>
          {Object.entries(_.omit(userData, 'user')).map(([key, val]) => {
            return (
              <React.Fragment key={key}>
                <GridItem padding={1} col={6}>
                  <Typography variant="omega" fontWeight="bold">
                    {key}
                  </Typography>
                </GridItem>
                <GridItem padding={1} col={6}>
                  <Typography>{val}</Typography>
                </GridItem>
              </React.Fragment>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
}
