import React from 'react';
import { Card } from 'reactstrap';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Settings from './settings/settings';
import Password from './password/password';

const Routes = ({ match }) => (
  <Card className="jh-card">
  <div>
    <ErrorBoundaryRoute path={`${match.url}/settings`} component={Settings} />
    <ErrorBoundaryRoute path={`${match.url}/password`} component={Password} />
  </div>
    </Card>
);

export default Routes;
