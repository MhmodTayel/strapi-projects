//@ts-nocheck
import React from 'react';
import {
  Box,
  Grid,
  GridItem,
  Flex,
  Icon,
  Typography,
  Divider,
  Tabs,
  Tab,
  TabGroup,
  TabPanels,
  TabPanel,
  EmptyStateLayout,
} from '@strapi/design-system';
import { Information, List } from '@strapi/icons';
import { Illo } from '../Illo';
import DisplayField from '../DisplayField';
import HistoryItem from '../HistoryItem';
export default function RequestCard({ data, history }) {
  return (
    <Box padding={2} background="neutral0" marginBottom={4}>
      <TabGroup id="tabs" variant="simple" initialSelectedTabIndex={0}>
        <Tabs>
          <Tab>
            <Flex paddingLeft={10} marginRight={4}>
              <Icon
                marginLeft={2}
                width={`${25 / 16}rem`}
                height={`${25 / 16}rem`}
                as={Information}
              />
              <Typography variant="beta">تفاصيل الطلب</Typography>
            </Flex>
          </Tab>

          <Tab>
            <Flex paddingLeft={10} marginRight={4}>
              <Icon
                marginLeft={2}
                width={`${20 / 16}rem`}
                height={`${20 / 16}rem`}
                as={List}
              />
              <Typography variant="beta">تحديثات الطلب</Typography>
            </Flex>
          </Tab>
        </Tabs>

        <Box padding={6} background="neutral0" marginBottom={4}>
          <TabPanels>
            <Box hasRadius={true} shadow="filterShadow">
              <TabPanel>
                <Grid>
                  {data.map((fieldSchema: any, idx: any) => (
                    <GridItem key={`box-${idx}`} col={4}>
                      <DisplayField fieldData={fieldSchema} />
                    </GridItem>
                  ))}
                </Grid>
              </TabPanel>
            </Box>
            <Box hasRadius={true} padding={4} shadow="filterShadow">
              <TabPanel>
                {!history ? (
                  <EmptyStateLayout icon={<Illo />} content="لا يوجد تحديثات" />
                ) : (
                  <Flex direction="column" className="history-flex">
                    {history.map((item: any, idx: any) => (
                      <Box
                        hasRadius={true}
                        shadow="popupShadow"
                        padding={6}
                        background="neutral0"
                        className="history-box"
                        marginBottom={8}
                        key={`box-${item.updatedAt}`}
                        style={{ width: '100%' }}
                      >
                        <HistoryItem
                          item={item}
                          key={`histItem-${item.updatedAt}`}
                        />
                      </Box>
                    ))}
                  </Flex>
                )}
              </TabPanel>
            </Box>
          </TabPanels>
        </Box>
      </TabGroup>
    </Box>
  );
}
