import './home.scss';

import React from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { Row, Col, Alert } from 'reactstrap';
import { Card } from 'reactstrap';
import Moment from 'moment';

import { IRootState } from 'app/shared/reducers';
import { AUTHORITIES } from 'app/config/constants';

export type IHomeProp = StateProps;

export const Home = (props: IHomeProp) => {
  const { account } = props;
  const isUser = account.authorities?.includes(AUTHORITIES.USER);

  return (
    <Card className="jh-card">
      <Row>
        <Col md="9">
          <h2>Welcome to Alpine Tech EXCHANGE</h2>
          <p className="lead">{Moment(new Date()).format(' dddd D MMMM YYYY')}</p>
          {account && account.login ? (
            <div>
              <Alert color="success">You are logged in as user {account.login}.</Alert>
              {isUser && (
                <Alert color="primary">
                  <strong>Your balance is: CHF {account.setting.balance?.toLocaleString()}</strong>
                </Alert>
              )}
            </div>
          ) : (
            <div>
              <Alert color="info">
                If you want to
                <Link to="/login" className="alert-link">
                  {' '}
                  sign in
                </Link>
                , you can try the default accounts:
                <br />- Administrator (login=&quot;admin&quot; and password=&quot;admin&quot;)
                <br />- User (login=&quot;user&quot; and password=&quot;user&quot;).
                <br />- Bank (login=&quot;bank&quot; and password=&quot;user&quot;).
              </Alert>

              <Alert color="info">
                You do not have an account yet?&nbsp;
                <Link to="/account/register" className="alert-link">
                  Register a new account
                </Link>
              </Alert>
            </div>
          )}
        </Col>
        <Col md="3" className="pad">
          <span className="hipster rounded" />
        </Col>
      </Row>
    </Card>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated
});

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(Home);
