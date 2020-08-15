import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { Row, Col } from 'reactstrap';

import { IRootState } from 'app/shared/reducers';
import { login } from 'app/shared/reducers/authentication';
import LoginModal from './login-modal';
import { AUTHORITIES } from 'app/config/constants';

export interface ILoginProps extends StateProps, DispatchProps, RouteComponentProps<{}> {}

export const Login = (props: ILoginProps) => {
  const [showModal, setShowModal] = useState(props.showModal);

  useEffect(() => {
    setShowModal(true);
  }, []);

  const handleLogin = (username, password, rememberMe = false) => props.login(username, password, rememberMe);

  const handleClose = () => {
    setShowModal(false);
    // props.history.push('/');
  };

  const { location, isAuthenticated, account } = props;
  if (isAuthenticated) {
    const isAdmin = account.authorities?.includes(AUTHORITIES.ADMIN);
    const isBank = account.authorities?.includes(AUTHORITIES.BANK);
    const homeLink = isAdmin || isBank ? '/home-bank' : 'home-customer';

    const { from } = (location.state as any) || { from: { pathname: homeLink, search: location.search } };

    return <Redirect to={from} />;
  }
  return (
    <Row id="login-page" className="h-100">
      <Col className="auth-image"></Col>
      <Col className="w-100 d-flex align-items-center justify-content-center">
        <LoginModal showModal={showModal} handleLogin={handleLogin} handleClose={handleClose} loginError={props.loginError} />
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ authentication }: IRootState) => ({
  account: authentication.account,
  isAuthenticated: authentication.isAuthenticated,
  loginError: authentication.loginError,
  showModal: authentication.showModalLogin
});

const mapDispatchToProps = { login };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Login);
