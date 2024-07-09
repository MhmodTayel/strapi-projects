import React from 'react';
import {
  Box,
  Grid,
  GridItem,
  Typography,
  Divider,
} from '@strapi/design-system';
import DisplayField from '../DisplayField';

export default function HistoryItem({ item }: { item: any }) {
  const {
    editingDate,
    editingTime,
    statusFrom,
    status,
    user,
    data,
    updatedAt,
  } = item;
  return (
    <Grid>
      <GridItem col={9}>
        <Box marginBottom={2}>
          <Typography variant="omega" fontWeight="bold">
            تحديث حالة الطلب
          </Typography>
          <Box padding={2}>
            <Typography variant="omega">
              من {<span className="history-status">{statusFrom}</span>} الي{' '}
              {<span className="history-status">{status}</span>}
            </Typography>
          </Box>
        </Box>
      </GridItem>
      <GridItem col={3}>
        <Box marginBottom={2}>
          <Typography variant="omega" fontWeight="bold">
            التاريخ:
          </Typography>
          <Typography variant="omega"> {editingDate}</Typography>
        </Box>
        <Box>
          <Typography variant="omega" fontWeight="bold">
            الوقت:
          </Typography>
          <Typography variant="omega"> {editingTime}</Typography>
        </Box>
      </GridItem>

      {(data || user) && (
        <GridItem col={12}>
          <Divider unsetMargin={false} />
        </GridItem>
      )}
      {data && (
        <>
          {data.map((item: any, idx: any) => (
            <GridItem col={4} key={`data-${updatedAt}`}>
              <DisplayField fieldData={item} />
            </GridItem>
          ))}
        </>
      )}
      {user && (
        <GridItem col={12} className="owner">
          <Typography variant="pi"> {user} :</Typography>
          <Typography variant="pi" textColor="danger700" fontWeight="bold">
            {' '}
            تم التعديل بواسطة
          </Typography>
        </GridItem>
      )}
    </Grid>
  );
}
