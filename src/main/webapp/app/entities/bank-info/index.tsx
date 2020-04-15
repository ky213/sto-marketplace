import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import BankInfo from './bank-info';
import BankInfoDetail from './bank-info-detail';
import BankInfoUpdate from './bank-info-update';
import BankInfoDeleteDialog from './bank-info-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={BankInfoDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={BankInfoUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={BankInfoUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={BankInfoDetail} />
      <ErrorBoundaryRoute path={match.url} component={BankInfo} />
    </Switch>
  </>
);

export default Routes;
