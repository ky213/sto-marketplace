import React from 'react';
import { Row, Col, Card, CardHeader, CardBody, Button, CardFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FlexibleXYPlot, YAxis, XAxis, RadialChart, VerticalBarSeries, HorizontalGridLines } from 'react-vis';
import moment from 'moment';

const Chart = () => {
  return (
    <Row className="pl-1 pr-2 pt-2">
      <Col xs="9" className="px-0">
        <Card className="p-0" style={{ height: '400px' }}>
          <CardHeader>Latest Orders</CardHeader>
          <CardBody>
            <FlexibleXYPlot>
              <YAxis attr="y" attrAxis="x" orientation="left" />
              <XAxis
                attr="x"
                attrAxis="y"
                orientation="bottom"
                tickTotal={7}
                tickFormat={(t, i) =>
                  moment()
                    .subtract(7 - i, 'days')
                    .format('DD MMM')
                }
              />
              <HorizontalGridLines />
              <VerticalBarSeries
                data={[
                  {
                    x: 0,
                    y: 10
                  },
                  {
                    x: 1,
                    y: 8.893112747940398
                  },
                  {
                    x: 2,
                    y: 7.092587441028026
                  },
                  {
                    x: 3,
                    y: 7.5792070839981065
                  },
                  {
                    x: 4,
                    y: 9.104607720321058
                  },
                  {
                    x: 5,
                    y: 7.95043000658639
                  },
                  {
                    x: 6,
                    y: 7.238432016488505
                  }
                ]}
                style={{}}
              />
              <VerticalBarSeries
                data={[
                  {
                    x: 0,
                    y: 10
                  },
                  {
                    x: 1,
                    y: 7.895781270333349
                  },
                  {
                    x: 2,
                    y: 9.714836076947527
                  },
                  {
                    x: 3,
                    y: 9.102605793322875
                  },
                  {
                    x: 4,
                    y: 10.540978540898982
                  },
                  {
                    x: 5,
                    y: 10.97334005054668
                  },
                  {
                    x: 6,
                    y: 11.33834158969131
                  }
                ]}
                style={{}}
              />
            </FlexibleXYPlot>
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
          <CardBody className="pt-1">
            <Row>
              <RadialChart
                className="m-auto"
                data={[{ angle: 0.1 }, { angle: 0.5 }, { angle: 0.2 }, { angle: 0.3 }]}
                colorRange={['#0b2662', '#28a745', '#de4251', '#fb8c00']}
                showLabels={true}
                width={250}
                height={250}
              />
            </Row>
            <Row className=" ">
              <Col className="text-center text-muted p-0">
                <p className="py-0 my-0">
                  <FontAwesomeIcon icon="user-tag" />
                </p>
                <p className="py-0 my-0" style={{ fontSize: '12px' }}>
                  Equity
                </p>
                <b className="py-0 my-0 text-primary"> 33%</b>
              </Col>
              <Col className="text-center text-muted p-0">
                <p className="py-0 my-0">
                  <FontAwesomeIcon icon="university" />
                </p>
                <p className="py-0 my-0" style={{ fontSize: '12px' }}>
                  Funds
                </p>
                <b className="py-0 my-0 text-success"> 30%</b>
              </Col>
              <Col className="text-center text-muted p-0">
                <p className="py-0 my-0">
                  <FontAwesomeIcon icon="building" />
                </p>
                <p className="py-0 my-0" style={{ fontSize: '12px' }}>
                  Real Estate
                </p>
                <b className="py-0 my-0 text-danger"> 15%</b>
              </Col>
              <Col className="text-center text-muted p-0">
                <p className="py-0 my-0">
                  <FontAwesomeIcon icon="cubes" />
                </p>
                <p className="py-0 my-0" style={{ fontSize: '12px' }}>
                  Derivative
                </p>
                <b className="py-0 my-0" style={{ color: '#fb8c00' }}>
                  23%
                </b>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default Chart;
