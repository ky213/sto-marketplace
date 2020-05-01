import React from 'react';
import { Switch } from 'react-router-dom';
import { Container, Row, Col, Card, DropdownItem } from 'reactstrap';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import Menu from 'app/shared/layout/menus/dashborad';

import HomeBank from './home-bank';
import HomeCustomer from './home-customer';
import SecurityToken from './security-token';
import UserSetting from './user-setting';
import BankInfo from './bank-info';
import Order from './order';
import Transaction from './transaction';
import WhiteListing from './white-listing';
import { connect } from 'react-redux';
/* jhipster-needle-add-route-import - JHipster will add routes here */

const Routes = ({ account, match }) => (
  <Container fluid className="h-100 bg-beige ">
    <Row className="h-100 bg-beige pt-3" style={{}}>
      <Col xs="2" className="h-100 pl-0">
        <Card className="h-75 border-0">
          <Row className="text-center" style={{ height: '80px' }}>
            <Col classeName="d-flex align-items-center">
              <b className=" mt-2 d-block">
                {account.firstName} {account.lastName}
              </b>
              <p>{account.login}</p>
            </Col>
          </Row>
          <DropdownItem divider className="w-100" />
          <Menu account={account} location={location} />
        </Card>
      </Col>
      <Col xs="10" className="mx-auto overflow-auto" style={{ height: '710px' }}>
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
      </Col>
    </Row>
  </Container>
);

const mapStateToProps = storeState => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated
});

export default connect(mapStateToProps)(Routes);
