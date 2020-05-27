import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import WhiteListing from './white-listing';
import WhiteListingDetail from './white-listing-detail';
import WhiteListingUpdate from './white-listing-update';
import WhiteListingDeleteDialog from './white-listing-delete-dialog';
import PrivateRoute from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';

const Routes = ({ match }) => (
  <>
    <Switch>
      <PrivateRoute
        exact
        path={`${match.url}/:id/delete`}
        component={WhiteListingDeleteDialog}
        hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.BANK]}
      />
      <PrivateRoute
        exact
        path={`${match.url}/new`}
        component={WhiteListingUpdate}
        hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.BANK]}
      />
      <PrivateRoute
        exact
        path={`${match.url}/:id/edit`}
        component={WhiteListingUpdate}
        hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.BANK]}
      />
      <PrivateRoute
        exact
        path={`${match.url}/:id`}
        component={WhiteListingDetail}
        hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.BANK]}
      />
      <ErrorBoundaryRoute path={match.url} component={WhiteListing} />
    </Switch>
  </>
);

export default Routes;
