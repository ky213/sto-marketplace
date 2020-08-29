import React from 'react';

import { Button, ModalHeader, ModalBody, ModalFooter, Alert, Row, Col } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Link } from 'react-router-dom';

export interface ILoginModalProps {
  showModal: boolean;
  loginError: boolean;
  handleLogin: Function;
  handleClose: Function;
}

class LoginModal extends React.Component<ILoginModalProps> {
  handleSubmit = (event, errors, { username, password, rememberMe }) => {
    const { handleLogin } = this.props;
    handleLogin(username, password, rememberMe);
  };

  render() {
    const { loginError } = this.props;

    return (
      <AvForm onSubmit={this.handleSubmit} className="w-100">
        <ModalHeader id="login-title">Sign in</ModalHeader>
        <ModalBody>
          <Row>
            <Col md="12">
              {loginError ? (
                <Alert color="danger">
                  <strong>Failed to sign in!</strong> Please check your credentials and try again.
                </Alert>
              ) : null}
            </Col>
            <Col md="12">
              <AvField
                name="username"
                label="Username"
                placeholder="Your username"
                required
                errorMessage="Username cannot be empty!"
                autoFocus
              />
              <AvField
                name="password"
                type="password"
                label="Password"
                placeholder="Your password"
                required
                errorMessage="Password cannot be empty!"
              />
            </Col>
          </Row>
          <div className="mt-1">&nbsp;</div>
          <Link className="text-primary" to="/account/reset/request">
            Did you forget your password?
          </Link>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" type="submit">
            Sign in
          </Button>
        </ModalFooter>
      </AvForm>
    );
  }
}

export default LoginModal;
