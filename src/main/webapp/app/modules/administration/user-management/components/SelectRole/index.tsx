import React from 'react';
import { connect } from 'react-redux';
import { AvCheckboxGroup, AvCheckbox } from 'availity-reactstrap-validation';
import { Row, Col, Card, Label } from 'reactstrap';

import { AUTHORITIES } from 'app/config/constants';
import { IRootState } from 'app/shared/reducers';
import './style.scss';

const SelectRole = ({ roles, account, selectedRole }) => {
  return (
    <AvCheckboxGroup name="authorities">
      <Row className="px-2">
        {account.authorities.includes(AUTHORITIES.ADMIN) && (
          <Col md="4" className="px-1">
            <Card className="btn p-0">
              <Row className="align-items-center">
                <Col xs="1" className="pr-0 mr-0 ml-3">
                  <AvCheckbox
                    id="role-admin"
                    value={AUTHORITIES.ADMIN}
                    checked={roles.includes(AUTHORITIES.ADMIN)}
                    onChange={({ target }) => selectedRole(target.value, target.checked)}
                  />
                </Col>
                <Col className="p-0 m-0">
                  <Label for="role-admin" className="text-left pl-4 py-3 m-0 w-100">
                    <p className="p-0 m-0">Admin</p>
                    <small className="text-muted">Admin with super privileges </small>
                  </Label>
                </Col>
              </Row>
            </Card>
          </Col>
        )}
        <Col className="px-1">
          <Card className="btn p-0">
            <Row className="align-items-center">
              <Col xs="1" className="pr-0 mr-0 ml-3">
                <AvCheckbox
                  id="role-bank"
                  value={AUTHORITIES.BANK}
                  checked={roles.includes(AUTHORITIES.BANK)}
                  onChange={({ target }) => selectedRole(target.value, target.checked)}
                />
              </Col>
              <Col className="p-0 m-0">
                <Label for="role-bank" className="text-left pl-4 py-3 m-0 w-100">
                  <p className="p-0 m-0">Banker</p>
                  <small className="text-muted">A banker to manage cutomers</small>
                </Label>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col className="px-1">
          <Card className="btn p-0">
            <Row className="align-items-center">
              <Col xs="1" className="pr-0 mr-0 ml-3">
                <AvCheckbox
                  id="role-user"
                  value={AUTHORITIES.USER}
                  checked={roles.includes(AUTHORITIES.USER)}
                  onChange={({ target }) => selectedRole(target.value, target.checked)}
                />
              </Col>
              <Col className="p-0 m-0">
                <Label for="role-user" className="text-left pl-4 py-3 m-0 w-100">
                  <p className="p-0 m-0">User</p>
                  <small className="text-muted">A new customer from a bank</small>
                </Label>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </AvCheckboxGroup>
  );
};

const mapStateToProps = (storeState: IRootState) => ({ account: storeState.authentication.account });

export default connect(mapStateToProps)(SelectRole);
