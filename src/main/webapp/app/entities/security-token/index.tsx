import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import SecurityToken from './security-token';
import SecurityTokenDetail from './security-token-detail';
import SecurityTokenUpdate from './security-token-update';
import SecurityTokenDeleteDialog from './security-token-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={SecurityTokenDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={SecurityTokenUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={SecurityTokenUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={SecurityTokenDetail} />
      <ErrorBoundaryRoute path={match.url} component={SecurityToken} />
    </Switch>
  </>
);

export default Routes;
