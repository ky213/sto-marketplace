import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Order from './order';
import OrderDetail from './order-detail';
import OrderUpdate from './order-update';
import OrderCancelDialog from './order-delete-dialog';
import PrivateRoute from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/cancel`} component={OrderCancelDialog} />
      <PrivateRoute exact path={`${match.url}/new`} component={OrderUpdate} hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.BANK]} />
      <PrivateRoute exact path={`${match.url}/new/:securityTokenId/:type`} component={OrderUpdate} hasAnyAuthorities={[AUTHORITIES.USER]} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={OrderDetail} />
      <ErrorBoundaryRoute path={match.url} component={Order} />
    </Switch>
  </>
);

export default Routes;
