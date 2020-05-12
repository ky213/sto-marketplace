import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { AvCheckboxGroup, AvCheckbox } from 'availity-reactstrap-validation';
import { Row, Col, Card } from 'reactstrap';

import { AUTHORITIES } from 'app/config/constants';
import './style.scss';

const SelectRole = ({ roles, reportRoles }) => {
  const [newRoles, setNewRoles] = useState(new Set([...roles]));

  const setSelectedRole = (role: string) => {
    if (newRoles.has(role)) newRoles.delete(role);
    else newRoles.add(role);

    setNewRoles(new Set(newRoles));
    reportRoles([...newRoles]);
  };

  return (
    <AvCheckboxGroup name="authorities">
      <Row className="px-2">
        <Col md="4" className="px-1">
          <Card className="btn py-2 table-hover" onClick={() => setSelectedRole(AUTHORITIES.ADMIN)}>
            <Row className="px-2">
              <Col className="col-1 px-1">
                <AvCheckbox checked={newRoles.has(AUTHORITIES.ADMIN)} />
              </Col>
              <Col className="col-11 px-1 text-left">
                <p className="p-0 m-0">Admin</p>
                <small className="text-muted text-left">Admin with super privileges </small>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col className="px-1">
          <Card className="btn py-2" onClick={() => setSelectedRole(AUTHORITIES.BANK)}>
            <Row className="px-2">
              <Col className="col-1 px-1">
                <AvCheckbox checked={newRoles.has(AUTHORITIES.BANK)} />
              </Col>
              <Col className="col-11 px-1 text-left">
                <p className="p-0 m-0">Banker</p>
                <small className="text-muted">A banker to manage cutomers</small>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col className="px-1">
          <Card className="btn py-2" onClick={() => setSelectedRole(AUTHORITIES.USER)}>
            <Row className="px-2">
              <Col className="col-1 px-1">
                <AvCheckbox checked={newRoles.has(AUTHORITIES.USER)} />
              </Col>
              <Col className="col-11 px-1 text-left">
                <p className="p-0 m-0">User</p>
                <small className="text-muted">A new customer from a bank</small>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </AvCheckboxGroup>
  );
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps)(SelectRole);
