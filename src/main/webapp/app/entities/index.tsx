import React from 'react';
import { Switch } from 'react-router-dom';
import { Container, Row, Col, Card, DropdownItem } from 'reactstrap';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import Menu from 'app/shared/layout/menus/dashborad';
import Footer from 'app/shared/layout/footer/footer';

import HomeBank from './home-bank';
import HomeCustomer from './home-customer';
import SecurityToken from './security-token';
import UserSetting from './user-setting';
import BankInfo from './bank-info';
import Order from './order';
import Transaction from './transaction';
import WhiteListing from './white-listing';
import { connect } from 'react-redux';
import PrivateRoute from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';
import Admin from 'app/modules/administration';
import Account from 'app/modules/account';
/* jhipster-needle-add-route-import - JHipster will add routes here */

const Routes = ({ account, match }) => (
  <Container fluid className="h-100 bg-beige">
    <Row className="h-100 bg-beige pt-3" style={{}}>
      <Col xs="2" className="h-100 pl-0">
        <Card className="h-100 border-0 px-0">
          <Row className="text-center px-1" style={{ height: '80px' }}>
            <Col className="d-flex flex-column align-items-center">
              <b className=" mt-2 d-block">
                {account.firstName} {account.lastName}
              </b>
              <p>{account.login}</p>
            </Col>
          </Row>
          <DropdownItem divider className="w-100" />
          <Menu account={account} />
        </Card>
      </Col>
      <Col xs="10" className="mx-auto overflow-auto h-100">
        <Switch>
          {/* prettier-ignore */}
          <PrivateRoute path={`${match.url}home-bank`} component={HomeBank} hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.BANK]}/>
          <PrivateRoute
            path={`${match.url}home-customer`}
            component={HomeCustomer}
            hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.USER]}
          />
          <ErrorBoundaryRoute path={`${match.url}security-token`} component={SecurityToken} />
          <PrivateRoute
            path={`${match.url}user-setting`}
            component={UserSetting}
            hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.BANK]}
          />
          <ErrorBoundaryRoute path={`${match.url}bank-info`} component={BankInfo} />
          <ErrorBoundaryRoute path={`${match.url}order`} component={Order} />
          <ErrorBoundaryRoute path={`${match.url}transaction`} component={Transaction} />
          <ErrorBoundaryRoute path={`${match.url}white-listing`} component={WhiteListing} />
          <PrivateRoute path={`${match.url}admin`} component={Admin} hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.BANK]} />
          <PrivateRoute
            path={`${match.url}account`}
            component={Account}
            hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.USER, AUTHORITIES.BANK]}
          />

          {/* jhipster-needle-add-route-path - JHipster will add routes here */}
        </Switch>
      </Col>
    </Row>
    <Footer />
  </Container>
);

const mapStateToProps = storeState => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated
});

export default connect(mapStateToProps)(Routes);
