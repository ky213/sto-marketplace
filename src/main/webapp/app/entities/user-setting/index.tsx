import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import UserSetting from './user-setting';
import UserSettingDetail from './user-setting-detail';
import UserSettingUpdate from './user-setting-update';
import UserSettingDeleteDialog from './user-setting-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={UserSettingDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={UserSettingUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={UserSettingUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={UserSettingDetail} />
      <ErrorBoundaryRoute path={match.url} component={UserSetting} />
    </Switch>
  </>
);

export default Routes;
