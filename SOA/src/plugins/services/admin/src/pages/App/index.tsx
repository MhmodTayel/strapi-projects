import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { AnErrorOccurred } from '@strapi/helper-plugin';
import pluginId from '../../pluginId';
import HomePage from '../HomePage';
import './index.css';
import ServicePage from '../ServicePage';
import RequestPage from '../RequestPage';
import CreateRequestPage from '../CreateRequestPage';

const App = () => {
  return (
    <Switch>
      <Route path={`/plugins/${pluginId}`} component={HomePage} exact />
      <Route
        path={`/plugins/${pluginId}/:slug`}
        component={ServicePage}
        exact
      />
      <Route
        path={`/plugins/${pluginId}/:slug/createRequest`}
        component={CreateRequestPage}
        exact
      />
      <Route
        path={`/plugins/${pluginId}/:slug/:reqId`}
        component={RequestPage}
        exact
      />
      <Route component={AnErrorOccurred} />
    </Switch>
  );
};

export default App;
