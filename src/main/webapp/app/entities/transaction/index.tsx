import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Transaction from './transaction';
import TransactionDetail from './transaction-detail';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TransactionDetail} />
      <ErrorBoundaryRoute path={match.url} component={Transaction} />
    </Switch>
  </>
);

export default Routes;
