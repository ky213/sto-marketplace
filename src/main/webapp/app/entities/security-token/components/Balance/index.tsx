import React from 'react';
import { Row, Col, Card, CardTitle, CardBody } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ISecurityToken } from 'app/shared/model/security-token.model';

const Balance = (props: ISecurityToken) => {
  return (
    <div className="mt-1" style={{ width: '55%' }}>
      <Card className="p-0">
        <CardBody className="py-2">
          <Row>
            <Col>
              <CardTitle tag="p" className="text-muted mb-1">
                Token Balance
              </CardTitle>
              <h5 className="font-weight-bold mb-0 ">{props.amountRaised?.toLocaleString()}</h5>
            </Col>
            <Col className="col-3 p-0">
              <div className="icon ml-auto mr-1 bg-danger  rounded-circle shadow">
                <FontAwesomeIcon icon="money-bill-wave" color="white" />
              </div>
            </Col>
          </Row>

          <p className="mt-3 mb-0 text-muted text-sm">
            <span className="text-danger mr-2">
              <FontAwesomeIcon icon="arrow-down" /> 12%
            </span>
            <span className="text-nowrap">Since last month</span>
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

export default Balance;
