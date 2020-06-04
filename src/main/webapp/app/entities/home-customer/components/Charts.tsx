import React from 'react';
import { Row, Col, Card, CardHeader, CardBody, Button, CardFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PieChart, BarChart } from 'app/shared/components/home';

const Chart = props => {
  const { className, ...rest } = props;

  return (
    <Row className="pl-1 pr-2 pt-2">
      <Col xs="9" className="px-0">
        <Card className="p-0" style={{ height: '400px' }}>
          <CardHeader>Latest Orders</CardHeader>
          <CardBody>
            <BarChart />
          </CardBody>
          <CardFooter className="d-flex py-0">
            <Button className="ml-auto" color="none ">
              <span className=" mr-2" style={{ fontSize: '14px' }}>
                overview
              </span>
              <FontAwesomeIcon icon="caret-right" />
            </Button>
          </CardFooter>
        </Card>
      </Col>
      <Col xs="3" className="pl-2 pr-0">
        <Card className="p-0" style={{ height: '400px' }}>
          <CardHeader className="d-flex">
            <span>Asset Allocation</span>
            <Button className="ml-auto p-0" color="none ">
              <FontAwesomeIcon icon="redo" />
            </Button>
          </CardHeader>
          <CardBody>
            <PieChart />
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default Chart;
