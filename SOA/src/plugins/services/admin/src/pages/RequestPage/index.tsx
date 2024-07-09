import React, { useState, useEffect, createContext } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, GridItem, Loader } from '@strapi/design-system';

import RequestPageHeader from '../../components/RequestPageHeader';
import RequestCard from '../../components/RequestCard';
import UserDataCard from '../../components/UserDataCard';
import ControllersCard from '../../components/ControllersCard';
import api from '../../api';
import {
  prepareUserData,
  checkEditingAllowance,
  prepareDataForPreview,
  prepareControllers,
  prepareReqHistory,
} from '../../helpers';

export const RequestContext = createContext({});

const RequestPage = () => {
  const { slug: serviceSlug, reqId } = useParams<{
    slug: string;
    reqId: string;
  }>();

  const [serviceSchema, setServiceSchema] = useState<any>({});
  const [requestData, setRequestData] = useState<any>([]);
  const [userData, setUserData] = useState<any>({});
  const [requestControllers, setRequestControllers] = useState({});
  const [employeeStatus, setEmployeeStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requestHistory, setRequestHistory] = useState<any>([]);
  const [request, setRequest] = useState({});

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const schema: any = await api
        .getServiceBySlug(serviceSlug)
        .then(({ data }: any) => data[0].attributes);

      const request: any = await api.getRequestByServiceSlugAndId(
        serviceSlug,
        reqId
      );
      setRequest(request);
      const user: any = !request.userId
        ? null
        : await api.getUserById(request.userId);

      const displayUserData = user || {
        ...request,
        arabicName: request.talent_name,
      };
      const selectedUserDataToPreview = prepareUserData(
        schema,
        displayUserData
      );
      const allowedForEmployeeEdit = checkEditingAllowance(schema, request);
      const requestDateForPreview = prepareDataForPreview(
        JSON.parse(JSON.stringify(schema)),
        request
      );
      setRequestControllers(
        prepareControllers(JSON.parse(JSON.stringify(schema)), request)
      );
      setServiceSchema(schema);
      setRequestData(requestDateForPreview);
      setUserData({ ...selectedUserDataToPreview, user: user?.id });
      setEmployeeStatus(allowedForEmployeeEdit);
      setRequestHistory(
        prepareReqHistory(JSON.parse(JSON.stringify(schema)), request)
      );
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initFetchData = async () => {
      await fetchData();
    };
    initFetchData();
  }, [serviceSlug, reqId]);

  return isLoading ? (
    <Loader className="loader">في انتظار البيانات</Loader>
  ) : (
    <RequestContext.Provider value={{ serviceSlug, reqId }}>
      <div className="services">
        <RequestPageHeader serviceTitle={serviceSchema.label} />
        <Grid>
          <GridItem col={8} padding={4}>
            <RequestCard data={requestData} history={requestHistory} />
          </GridItem>
          <GridItem col={4} padding={4}>
            <UserDataCard userData={userData} />

            {employeeStatus && (
              <ControllersCard
                controllers={requestControllers}
                schema={serviceSchema}
                requestData={request}
              />
            )}
          </GridItem>
        </Grid>
      </div>
    </RequestContext.Provider>
  );
};

export default RequestPage;
