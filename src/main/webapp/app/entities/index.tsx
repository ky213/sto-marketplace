import React from 'react';
import { Switch } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import HomeBank from './home-bank';
import HomeCustomer from './home-customer';
import SecurityToken from './security-token';
import UserSetting from './user-setting';
import BankInfo from './bank-info';
import Order from './order';
import Transaction from './transaction';
import WhiteListing from './white-listing';
/* jhipster-needle-add-route-import - JHipster will add routes here */

const Routes = ({ match }) => (
  <div>
    <Switch>
      {/* prettier-ignore */}
      <ErrorBoundaryRoute path={`${match.url}home-bank`} component={HomeBank} />
      <ErrorBoundaryRoute path={`${match.url}home-customer`} component={HomeCustomer} />
      <ErrorBoundaryRoute path={`${match.url}security-token`} component={SecurityToken} />
      <ErrorBoundaryRoute path={`${match.url}user-setting`} component={UserSetting} />
      <ErrorBoundaryRoute path={`${match.url}bank-info`} component={BankInfo} />
      <ErrorBoundaryRoute path={`${match.url}order`} component={Order} />
      <ErrorBoundaryRoute path={`${match.url}transaction`} component={Transaction} />
      <ErrorBoundaryRoute path={`${match.url}white-listing`} component={WhiteListing} />
      {/* jhipster-needle-add-route-path - JHipster will add routes here */}
    </Switch>
  </div>
);

export default Routes;
