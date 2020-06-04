import React from 'react';

import { connect } from 'react-redux';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Button, Alert, Col, Row } from 'reactstrap';

import { IRootState } from 'app/shared/reducers';
import { handlePasswordResetInit, reset } from '../password-reset.reducer';

export type IPasswordResetInitProps = DispatchProps;

export class PasswordResetInit extends React.Component<IPasswordResetInitProps> {
  componentWillUnmount() {
    this.props.reset();
  }

  handleValidSubmit = (event, values) => {
    this.props.handlePasswordResetInit(values.email);
    event.preventDefault();
  };

  render() {
    return (
      <Row className="h-100">
        <Col className="auth-image"></Col>
        <Col className="w-100 d-flex align-items-center justify-content-center">
          <Row className="justify-content-center w-100">
            <Col>
              <h3>Reset your password</h3>
              <Alert color="warning">
                <p>Enter the email address you used to register</p>
              </Alert>
              <AvForm onValidSubmit={this.handleValidSubmit}>
                <AvField
                  name="email"
                  label="Email"
                  placeholder={'Your email'}
                  type="email"
                  validate={{
                    required: { value: true, errorMessage: 'Your email is required.' },
                    minLength: { value: 5, errorMessage: 'Your email is required to be at least 5 characters.' },
                    maxLength: { value: 254, errorMessage: 'Your email cannot be longer than 50 characters.' }
                  }}
                />
                <Button color="primary" type="submit">
                  Reset password
                </Button>
              </AvForm>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

const mapDispatchToProps = { handlePasswordResetInit, reset };

type DispatchProps = typeof mapDispatchToProps;

export default connect(null, mapDispatchToProps)(PasswordResetInit);
