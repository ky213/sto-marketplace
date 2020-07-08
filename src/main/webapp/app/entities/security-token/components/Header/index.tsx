import React from 'react';
import { ISecurityToken } from 'app/shared/model/security-token.model';
import { Row, Col } from 'reactstrap';
import Switch from 'react-switch';
import { STATUS } from 'app/shared/model/enumerations/status.model';
import { STSTATUS } from 'app/shared/model/enumerations/ststatus.model';
const Header = ({ name, status, logo, logoContentType }: ISecurityToken) => {
  return (
    <>
      <Col>
        <Row>
          <Col className="col-1">
            <img src={`data:${logoContentType};base64,${logo}`} style={{ maxHeight: '50px' }} />
          </Col>
          <Col className="pl-4">
            <small className="text-muted">Details</small>
            <p>{name}</p>
          </Col>
        </Row>
      </Col>
      <Col className="text-right">
        <Row className="justify-content-center align-items-center">
          <Col className="pr-0 mr-0">
            <h3>Active </h3>
          </Col>
          <Col className="col-2 text-left">
            <Switch onChange={() => {}} checked={status === STSTATUS.ACTIVE} />
          </Col>
        </Row>
      </Col>
    </>
  );
};
export default Header;
