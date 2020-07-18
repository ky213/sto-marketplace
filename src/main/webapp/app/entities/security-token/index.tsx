import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import SecurityToken from './security-token';
import SecurityTokenDetail from './security-token-detail';
import SecurityTokenDetailUser from './security-token-detail-user';
import SecurityTokenUpdate from './security-token-update';
import SecurityTokenDeleteDialog from './security-token-delete-dialog';
import PrivateRoute from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';

const Routes = ({ match }) => (
  <>
    <Switch>
      <PrivateRoute exact path={`${match.url}/:id/delete`} component={SecurityTokenDeleteDialog} hasAnyAuthorities={[AUTHORITIES.ADMIN]} />
      <PrivateRoute exact path={`${match.url}/new`} component={SecurityTokenUpdate} hasAnyAuthorities={[AUTHORITIES.ADMIN]} />
      <PrivateRoute
        exact
        path={`${match.url}/:id/edit`}
        component={SecurityTokenUpdate}
        hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.BANK]}
      />
      <PrivateRoute
        exact
        path={`${match.url}/:id`}
        component={SecurityTokenDetail}
        hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.BANK]}
      />
      <PrivateRoute exact path={`${match.url}/:id/user`} component={SecurityTokenDetailUser} hasAnyAuthorities={[AUTHORITIES.USER]} />
      <ErrorBoundaryRoute path={match.url} component={SecurityToken} />
    </Switch>
  </>
);

export default Routes;
