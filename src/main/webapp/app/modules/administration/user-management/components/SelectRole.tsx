import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { AvRadioGroup, AvRadio } from 'availity-reactstrap-validation';
import { Row, Col, Card, Button } from 'reactstrap';

import { AUTHORITIES } from 'app/config/constants';

const SelectRole = () => {
  return (
    <AvRadioGroup name="authorities" required errorMessage="This field is required!">
      <Row>
        <Col xs="4 px-1">
          <Card className="btn py-2">
            <Row className="px-2">
              <Col className="col-1 px-1">
                <AvRadio value={AUTHORITIES.ADMIN} />
              </Col>
              <Col className="col-11 px-1 ">
                <p className="p-0 m-0 text-left">Admin</p>
                <small className="p-0 pr-5 text-nowrap text-muted">Add a new admin with super privileges</small>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs="4 px-1">
          <Card className="btn py-2">
            <Row className="px-2">
              <Col className="col-1 px-1">
                <AvRadio value={AUTHORITIES.BANK} />
              </Col>
              <Col className="col-11 px-1 ">
                <p className="p-0 m-0 text-left">Banker</p>
                <small className="p-0 pr-5 text-nowrap text-muted">Add a new banker to manage cutomers</small>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs="4 px-1">
          <Card className="btn py-2">
            <Row className="px-2">
              <Col className="col-1 px-1">
                <AvRadio value={AUTHORITIES.USER} />
              </Col>
              <Col className="col-11 px-1 ">
                <p className="p-0 m-0 text-left">User</p>
                <small className="p-0 pr-5 text-nowrap text-muted">Add a new customer from a bank</small>
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
