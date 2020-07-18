import React from 'react';
import { Row, Col, Card, CardBody, CardTitle } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AccountBalance = () => {
  return (
    <div className="mt-2">
      <Card className="p-0 mb-4 mb-xl-0">
        <CardBody className="py-2 bg-primary">
          <Row>
            <Col>
              <CardTitle tag="p" className="text-white mb-1">
                Bank Account Balance
              </CardTitle>
              <h6 className="font-weight-bold mb-0 text-white">CHF {"250'782.90"}</h6>
            </Col>
            <Col className="col-3 p-0">
              <div className="icon ml-auto mr-1 bg-white  rounded-circle shadow">
                <FontAwesomeIcon icon="wallet" color="#0b2662" />
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
};

export default AccountBalance;
