import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardBody, Button, CardFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import moment from 'moment';
import { FlexibleXYPlot, YAxis, XAxis, VerticalGridLines, HorizontalGridLines, LineMarkSeries } from 'react-vis';

import { getChartData } from '../../security-token.reducer';
import { IRootState } from 'app/shared/reducers';

export interface ChartProps extends StateProps, DispatchProps {
  securityTokenName: string;
}

const Chart = (props: ChartProps) => {
  const startDate = moment()
    .subtract(7, 'days')
    .toISOString();
  const endDate = moment().toISOString();
  const data = props.chartData.map(({ price, createDate }) => ({ x: new Date(createDate).toDateString(), y: price }));
  const defaultData = [{ x: new Date().toDateString(), y: props.defaultPrice || 0 }];

  useEffect(() => {
    if (props.securityTokenName) props.getChartData(props.securityTokenName, startDate, endDate);
  }, [props.securityTokenName]);

  return (
    <Card className="p-0" style={{ height: '400px' }}>
      <CardHeader>Latest Orders</CardHeader>
      <CardBody className="p-0">
        <FlexibleXYPlot xType="ordinal">
          <YAxis />
          <XAxis tickFormat={t => moment(t).format('DD MMM')} />
          <VerticalGridLines />
          <HorizontalGridLines />
          <LineMarkSeries data={props.chartData.length ? data : defaultData} curve="curveBasis" />
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
  );
};

const mapStateToProps = ({ securityToken }: IRootState) => ({
  chartData: securityToken.chartData,
  defaultPrice: securityToken.entity.lastSellingprice
});

const mapDispatchToProps = {
  getChartData
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Chart);
