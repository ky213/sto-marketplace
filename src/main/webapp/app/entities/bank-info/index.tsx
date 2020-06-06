import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import BankInfo from './bank-info';
import BankInfoDetail from './bank-info-detail';
import BankInfoUpdate from './bank-info-update';
import BankInfoDeleteDialog from './bank-info-delete-dialog';
import PrivateRoute from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';

const Routes = ({ match }) => (
  <>
    <Switch>
      <PrivateRoute
        exact
        path={`${match.url}/:id/delete`}
        component={BankInfoDeleteDialog}
        hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.BANK]}
      />
      <PrivateRoute exact path={`${match.url}/new`} component={BankInfoUpdate} hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.BANK]} />
      <PrivateRoute
        exact
        path={`${match.url}/:id/edit`}
        component={BankInfoUpdate}
        hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.BANK]}
      />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={BankInfoDetail} />
      <ErrorBoundaryRoute path={match.url} component={BankInfo} />
    </Switch>
  </>
);

export default Routes;
