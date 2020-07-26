import React, { useEffect } from 'react';
import { Row, Col, Card, CardHeader, CardBody, Button, CardFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FlexibleXYPlot, YAxis, XAxis, RadialChart, VerticalBarSeries, HorizontalGridLines } from 'react-vis';
import moment from 'moment';

import { IRootState } from 'app/shared/reducers';
import { getAssetDistribution, getLastOrders } from 'app/entities/home-bank/home-bank.reducer';
import { connect } from 'react-redux';
import { CATEGORY } from 'app/shared/model/enumerations/category.model';
import { Link } from 'react-router-dom';

export interface AdminChartsProps extends StateProps, DispatchProps {}

const Chart = (props: AdminChartsProps) => {
  const assets = [];
  const colors = {
    EQUITY: '#0b2662',
    FUNDS: '#28a745',
    REAL_ESTATE: '#de4251',
    DERIVATIVE: '#fb8c00'
  };

  useEffect(() => {
    props.getAssetDistribution();
    props.getLastOrders();
  }, []);

  for (const el of props.assetAllocation) {
    if (el)
      assets.push({
        angle: el.percentage,
        label: el.category,
        style: { fill: colors[el.category], stroke: colors[el.category] }
      });
  }

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
                    .subtract(14 - i, 'days')
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
            <Link to="/order" className="ml-auto">
              <Button color="none ">
                <span className=" mr-2" style={{ fontSize: '14px' }}>
                  view all
                </span>
                <FontAwesomeIcon icon="caret-right" />
              </Button>
            </Link>
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
                data={assets}
                showLabels={false}
                width={250}
                height={250}
                labelsRadiusMultiplier={0.6}
                labelsStyle={{
                  fontSize: 10
                }}
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
                <span className="py-0 my-0 text-primary">
                  {props.assetAllocation?.find(({ category }) => category === CATEGORY.EQUITY)?.percentage?.toPrecision(4) || 0}%
                </span>
              </Col>
              <Col className="text-center text-muted p-0">
                <p className="py-0 my-0">
                  <FontAwesomeIcon icon="university" />
                </p>
                <p className="py-0 my-0" style={{ fontSize: '12px' }}>
                  Funds
                </p>
                <span className="py-0 my-0 text-success">
                  {props.assetAllocation?.find(({ category }) => category === CATEGORY.FUNDS)?.percentage?.toPrecision(4) || 0}%
                </span>
              </Col>
              <Col className="text-center text-muted p-0">
                <p className="py-0 my-0">
                  <FontAwesomeIcon icon="building" />
                </p>
                <p className="py-0 my-0" style={{ fontSize: '12px' }}>
                  Real Estate
                </p>
                <span className="py-0 my-0 text-danger">
                  {props.assetAllocation?.find(({ category }) => category === CATEGORY.REAL_ESTATE)?.percentage?.toPrecision(4) || 0}%
                </span>
              </Col>
              <Col className="text-center text-muted p-0">
                <p className="py-0 my-0">
                  <FontAwesomeIcon icon="cubes" />
                </p>
                <p className="py-0 my-0" style={{ fontSize: '12px' }}>
                  Derivative
                </p>
                <span className="py-0 my-0" style={{ color: '#fb8c00' }}>
                  {props.assetAllocation?.find(({ category }) => category === CATEGORY.DERIVATIVE)?.percentage?.toPrecision(4) || 0}%
                </span>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ homeBank }: IRootState) => ({
  assetAllocation: homeBank.assetDistribution,
  latestOrders: homeBank.lastOrders
});

const mapDispatchToProps = {
  getAssetDistribution,
  getLastOrders
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Chart);
