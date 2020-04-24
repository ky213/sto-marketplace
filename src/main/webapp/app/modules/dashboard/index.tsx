import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, DropdownItem, Card } from 'reactstrap';

import { AUTHORITIES } from 'app/config/constants';
import Menu from './components/menu';
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import { DashboardHome, SecurityToken, Orders, Reports, BankInfo, Users, Settings } from './pages';
import { Switch } from 'react-router-dom';
import PrivateRoute from 'app/shared/auth/private-route';
import PageNotFound from 'app/shared/error/page-not-found';

const Dashboard = props => {
  const { account, location, match } = props;
  return (
    <Container fluid className="h-100">
      <Row className="h-100 bg-beige" style={{}}>
        <Col xs="2" className="h-100 mr-1 pl-0">
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
        <Col xs="9" className="m-auto h-75">
          <Switch>
            //todo: User profile page
            <ErrorBoundaryRoute path={`${match.url}/home`} component={DashboardHome} />
            <ErrorBoundaryRoute exact path={`${match.url}/security-token`} component={SecurityToken} />
            <ErrorBoundaryRoute exact path={`${match.url}/orders`} component={Orders} />
            <ErrorBoundaryRoute exact path={`${match.url}/reporting`} component={Reports} />
            <PrivateRoute
              exact
              path={`${match.url}/bank-info`}
              component={BankInfo}
              hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.BANK]}
            />
            <PrivateRoute exact path={`${match.url}/users`} component={Users} hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.BANK]} />
            <ErrorBoundaryRoute exact path={`${match.url}/settings`} component={Settings} />
            <ErrorBoundaryRoute component={PageNotFound} />
          </Switch>
        </Col>
      </Row>
    </Container>
  );
};

const mapStateToProps = storeState => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated
});

export default connect(mapStateToProps)(Dashboard);
