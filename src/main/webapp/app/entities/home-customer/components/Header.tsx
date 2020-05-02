import React from 'react';
import { Row, Col, Card, CardTitle, CardBody } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import 'app/shared/components/home/card-header.scss';

const Header = () => {
  return (
    <Row className="row pr-1">
      <Col className="px-1">
        <Card className="p-0 mb-4 mb-xl-0">
          <CardBody className="py-2">
            <Row>
              <Col>
                <CardTitle tag="p" className="text-muted mb-1">
                  Total Tokens Value
                </CardTitle>
                <h6 className="font-weight-bold mb-0 text-primary">CHF {"250'782.90"}</h6>
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
              </span>{' '}
              <span className="text-nowrap">Since last month</span>
            </p>
          </CardBody>
        </Card>
      </Col>
      <Col className="px-1">
        <Card className="p-0 mb-4 mb-xl-0">
          <CardBody className="py-2">
            <Row>
              <Col>
                <CardTitle tag="p" className="text-muted mb-1">
                  Mont Pelerin
                </CardTitle>
                <h6 className="font-weight-bold mb-0 text-primary">CHF {"250'782.90"}</h6>
              </Col>
              <Col className="col-3 p-0">
                <div className="icon ml-auto mr-1 bg-success  rounded-circle shadow">
                  <FontAwesomeIcon icon="chart-bar" color="white" />
                </div>
              </Col>
            </Row>

            <p className="mt-3 mb-0 text-muted text-sm">
              <span className="text-success mr-2">
                <FontAwesomeIcon icon="arrow-up" /> 10%
              </span>{' '}
              <span className="text-nowrap">Since last month</span>
            </p>
          </CardBody>
        </Card>
      </Col>
      <Col className="px-1">
        <Card className="p-0 mb-4 mb-xl-0">
          <CardBody className="py-2">
            <Row>
              <Col>
                <CardTitle tag="p" className="text-muted mb-1">
                  Constantin Lapiere
                </CardTitle>
                <h6 className="font-weight-bold mb-0 text-primary">CHF {"250'782.90"}</h6>
              </Col>
              <Col className="col-3 p-0">
                <div className="icon ml-auto mr-1 bg-success  rounded-circle shadow">
                  <FontAwesomeIcon icon="chart-bar" color="white" />
                </div>
              </Col>
            </Row>

            <p className="mt-3 mb-0 text-muted text-sm">
              <span className="text-success mr-2">
                <FontAwesomeIcon icon="arrow-up" /> 5%
              </span>{' '}
              <span className="text-nowrap">Since last month</span>
            </p>
          </CardBody>
        </Card>
      </Col>
      <Col className="px-1">
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

            <p className="mt-3 mb-0 text-muted text-sm">
              <span className="text-danger mr-2">{/* <FontAwesomeIcon icon="arrow-up" /> 12% */}</span>{' '}
              {/* <span className="text-nowrap">Since last month</span> */}
            </p>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default Header;
