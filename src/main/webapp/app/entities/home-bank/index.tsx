import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import HomeBankDetail from './home-bank-detail';
import HomeBankUpdate from './home-bank-update';
import HomeBankDeleteDialog from './home-bank-delete-dialog';
import Home from './home';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={HomeBankDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={HomeBankUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={HomeBankUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={HomeBankDetail} />
      <ErrorBoundaryRoute path={match.url} component={Home} />
    </Switch>
  </>
);

export default Routes;
