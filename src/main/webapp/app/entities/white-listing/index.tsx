import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import WhiteListing from './white-listing';
import WhiteListingDetail from './white-listing-detail';
import WhiteListingUpdate from './white-listing-update';
import WhiteListingDeleteDialog from './white-listing-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={WhiteListingDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={WhiteListingUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={WhiteListingUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={WhiteListingDetail} />
      <ErrorBoundaryRoute path={match.url} component={WhiteListing} />
    </Switch>
  </>
);

export default Routes;
