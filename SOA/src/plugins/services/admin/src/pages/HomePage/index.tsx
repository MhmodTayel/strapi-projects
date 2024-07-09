import React, { useState, useEffect } from 'react';
import {
  BaseHeaderLayout,
  Layout,
  ContentLayout,
  EmptyStateLayout,
  Loader,
} from '@strapi/design-system';
import { Illo } from '../../components/Illo';
import ServicesGrid from '../../components/ServicesGrid';

import api from '../../api';
const HomePage = () => {
  const [services, setServices] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // async function addService(data: any) {
  //   setServices([...services, { ...data, id: 1 }]);
  // }

  const fetchData = async () => {
    if (isLoading === false) setIsLoading(true);

    try {
      const services = (await api.getAllServices()) as any;
      setServices(services.data);
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
  }, []);
  return (
    <div className="services">
      <Layout>
        <BaseHeaderLayout
          title="الخدمات"
          subtitle="جميع خدمات نقابه المهن التمثيليه في مكان واحد"
          as="h2"
        />
        <ContentLayout>
          {isLoading ? (
            <Loader className="loader">في انتظار البيانات</Loader>
          ) : services.length === 0 ? (
            <EmptyStateLayout icon={<Illo />} content="لا توجد اي خدمات" />
          ) : (
            <ServicesGrid services={services} />
          )}
        </ContentLayout>
      </Layout>
    </div>
  );
};

export default HomePage;
