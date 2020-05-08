import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { AvRadioGroup, AvRadio } from 'availity-reactstrap-validation';
import { Row, Col, Card, Button } from 'reactstrap';

import { AUTHORITIES } from 'app/config/constants';

const SelectRole = ({ changeRole, role }) => {
  return (
    <AvRadioGroup name="authorities">
      <Row className="px-2">
        <Col md="4" className="px-1">
          <Card className="btn py-2" onClick={() => changeRole(AUTHORITIES.ADMIN)}>
            <Row className="px-2">
              <Col className="col-1 px-1">
                <input className="" type="radio" id="authorities-admin" value={AUTHORITIES.ADMIN} checked={role === AUTHORITIES.ADMIN} />
              </Col>
              <Col className="col-11 px-1 text-left">
                <p className="p-0 m-0">Admin</p>
                <small className="text-muted text-left">Admin with super privileges </small>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col className="px-1">
          <Card className="btn py-2" onClick={() => changeRole(AUTHORITIES.BANK)}>
            <Row className="px-2">
              <Col className="col-1 px-1">
                <input className="" type="radio" id="authorities-admin" value={AUTHORITIES.BANK} checked={role === AUTHORITIES.BANK} />
              </Col>
              <Col className="col-11 px-1 text-left">
                <p className="p-0 m-0">Banker</p>
                <small className="text-muted">A banker to manage cutomers</small>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col className="px-1">
          <Card className="btn py-2" onClick={() => changeRole(AUTHORITIES.USER)}>
            <Row className="px-2">
              <Col className="col-1 px-1">
                <input className="" type="radio" id="authorities-admin" value={AUTHORITIES.USER} checked={role === AUTHORITIES.USER} />
              </Col>
              <Col className="col-11 px-1 text-left">
                <p className="p-0 m-0">User</p>
                <small className="text-muted">A new customer from a bank</small>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </AvRadioGroup>
  );
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps)(SelectRole);
