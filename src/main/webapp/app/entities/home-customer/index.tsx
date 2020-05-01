import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import HomeCustomer from './home-customer';
import HomeCustomerDetail from './home-customer-detail';
import HomeCustomerUpdate from './home-customer-update';
import HomeCustomerDeleteDialog from './home-customer-delete-dialog';
import Home from './home';
const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={HomeCustomerDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={HomeCustomerUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={HomeCustomerUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={HomeCustomerDetail} />
      <ErrorBoundaryRoute path={match.url} component={Home} />
    </Switch>
  </>
);

export default Routes;
