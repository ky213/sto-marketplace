import React from 'react';
import { Card } from 'reactstrap';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import UserManagement from './user-management';
import Logs from './logs/logs';
import Health from './health/health';
import Metrics from './metrics/metrics';
import Configuration from './configuration/configuration';
import Audits from './audits/audits';
import Docs from './docs/DocsPage';
import Tracker from './tracker/tracker';

const Routes = ({ match }) => (
  <Card className="jh-card">
    <div>
      <ErrorBoundaryRoute path={`${match.url}/user-management`} component={UserManagement} />
      <ErrorBoundaryRoute exact path={`${match.url}/tracker`} component={Tracker} />
      <ErrorBoundaryRoute exact path={`${match.url}/health`} component={Health} />
      <ErrorBoundaryRoute exact path={`${match.url}/metrics`} component={Metrics} />
      <ErrorBoundaryRoute exact path={`${match.url}/docs`} component={Docs} />
      <ErrorBoundaryRoute exact path={`${match.url}/configuration`} component={Configuration} />
      <ErrorBoundaryRoute exact path={`${match.url}/audits`} component={Audits} />
      <ErrorBoundaryRoute exact path={`${match.url}/logs`} component={Logs} />
    </div>
  </Card>
);

export default Routes;
