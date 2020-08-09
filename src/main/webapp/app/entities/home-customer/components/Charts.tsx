import React, { useEffect } from 'react';
import { Row, Col, Card, CardHeader, CardBody, Button, CardFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FlexibleXYPlot, YAxis, XAxis, RadialChart, VerticalBarSeries, HorizontalGridLines } from 'react-vis';
import { connect } from 'react-redux';
import moment from 'moment';

import { IRootState } from 'app/shared/reducers';
import { getAssetAllocation, getLatestOrders } from '../home-customer.reducer';
import { CATEGORY } from 'app/shared/model/enumerations/category.model';
import { Link } from 'react-router-dom';

export interface UserChartProps extends StateProps, DispatchProps {}

const Charts = (props: UserChartProps) => {
  const { user, latestOrders } = props;
  const colors = {
    EQUITY: '#0b2662',
    FUNDS: '#28a745',
    REAL_ESTATE: '#de4251',
    DERIVATIVE: '#fb8c00'
  };

  const buyOrders = Object.keys(latestOrders)
    .map(key => ({ x: key || 0, y: latestOrders[key].BUY || 0 }))
    .reverse();
  const sellOrders = Object.keys(latestOrders)
    .map(key => ({ x: key || 0, y: latestOrders[key].SELL || 0 }))
    .reverse();
  const assetAllocation = props.assetAllocation.map(el => ({
    angle: el.percentage,
    label: el.category,
    style: { fill: colors[el.category], stroke: colors[el.category] }
  }));

  useEffect(() => {
    props.getAssetAllocation();
    props.getLatestOrders(user.id);
  }, []);

  return (
    <Row className="pl-1 pr-2 pt-2">
      <Col xs="9" className="px-0">
        <Card className="p-0" style={{ height: '400px' }}>
          <CardHeader>Latest Orders</CardHeader>
          <CardBody>
            <FlexibleXYPlot xType="ordinal">
              <YAxis />
              <XAxis tickFormat={t => moment(t).format('DD MMM')} tickTotal={14} />
              <HorizontalGridLines />
              <VerticalBarSeries data={buyOrders.length ? buyOrders : [{ x: new Date(), y: 0 }]} barWidth={0.1} color={'#28a745'} />
              <VerticalBarSeries data={sellOrders.length ? sellOrders : [{ x: new Date(), y: 0 }]} barWidth={0.1} color={'#dc3545'} />
            </FlexibleXYPlot>
          </CardBody>
          <CardFooter className="d-flex py-0">
            <Button className="ml-auto" color="none ">
              <Link to="/order" className=" mr-2" style={{ fontSize: '14px' }}>
                <span className="text-primary">
                  view all <FontAwesomeIcon icon="caret-right" />
                </span>
              </Link>
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
                data={assetAllocation}
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
                <b className="py-0 my-0 text-primary">
                  {' '}
                  {props.assetAllocation?.find(({ category }) => category === CATEGORY.EQUITY)?.percentage?.toFixed(2) || 0}%
                </b>
              </Col>
              <Col className="text-center text-muted p-0">
                <p className="py-0 my-0">
                  <FontAwesomeIcon icon="university" />
                </p>
                <p className="py-0 my-0" style={{ fontSize: '12px' }}>
                  Funds
                </p>
                <b className="py-0 my-0 text-success">
                  {' '}
                  {props.assetAllocation?.find(({ category }) => category === CATEGORY.FUNDS)?.percentage?.toFixed(2) || 0}%
                </b>
              </Col>
              <Col className="text-center text-muted p-0">
                <p className="py-0 my-0">
                  <FontAwesomeIcon icon="building" />
                </p>
                <p className="py-0 my-0" style={{ fontSize: '12px' }}>
                  Real Estate
                </p>
                <b className="py-0 my-0 text-danger">
                  {' '}
                  {props.assetAllocation?.find(({ category }) => category === CATEGORY.REAL_ESTATE)?.percentage?.toFixed(2) || 0}%
                </b>
              </Col>
              <Col className="text-center text-muted p-0">
                <p className="py-0 my-0">
                  <FontAwesomeIcon icon="cubes" />
                </p>
                <p className="py-0 my-0" style={{ fontSize: '12px' }}>
                  Derivative
                </p>
                <b className="py-0 my-0" style={{ color: colors.DERIVATIVE }}>
                  {props.assetAllocation?.find(({ category }) => category === CATEGORY.DERIVATIVE)?.percentage?.toFixed(2) || 0}%
                </b>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ authentication, homeCustomer }: IRootState) => ({
  user: authentication.account,
  assetAllocation: homeCustomer.assetDistribution,
  latestOrders: homeCustomer.latestOrders
});

const mapDispatchToProps = {
  getAssetAllocation,
  getLatestOrders
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Charts);
