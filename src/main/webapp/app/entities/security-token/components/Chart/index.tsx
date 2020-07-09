import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Col, Card, CardHeader, CardBody, Button, CardFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Line } from 'react-chartjs-2';
import { connect } from 'react-redux';

import { getChartData } from '../../security-token.reducer';
import { IRootState } from 'app/shared/reducers';
import moment from 'moment';
import { APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ChartProps extends StateProps, DispatchProps {
  securityTokenName: string;
}

const Chart = (props: ChartProps) => {
  const startDate = moment()
    .subtract(7, 'days')
    .toISOString();
  const endDate = moment().toISOString();
  const labels = new Array(7)
    .fill('')
    .map((e, i) => {
      return moment()
        .subtract(i + 1, 'days')
        .format('DD MMM');
    })
    .reverse();

  const data = {
    datasets: [
      {
        borderColor: '#1a237e',
        data: props.chartData
      }
    ],
    labels
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    cornerRadius: 20,
    legend: {
      display: false
    },
    layout: {
      padding: 0
    },
    scales: {
      xAxes: [
        {
          barThickness: 14,
          maxBarThickness: 10,
          barPercentage: 0.5,
          categoryPercentage: 0.5,
          gridLines: {
            display: false,
            drawBorder: false
          },
          ticks: {
            padding: 20,
            fontColor: 'gray'
          }
        }
      ],
      yAxes: [
        {
          gridLines: {
            borderDash: [2],
            borderDashOffset: [2],
            color: 'gray',
            drawBorder: false,
            zeroLineBorderDash: [2],
            zeroLineBorderDashOffset: [2],
            zeroLineColor: 'gray'
          },
          ticks: {
            padding: 20,
            fontColor: 'gray',
            beginAtZero: true,
            min: 0,
            maxTicksLimit: 5,
            callback(value) {
              return value > 0 ? value + 'K' : value;
            }
          }
        }
      ]
    },
    tooltips: {
      enabled: true,
      mode: 'index',
      intersect: false,
      caretSize: 10,
      yPadding: 20,
      xPadding: 20,
      borderWidth: 1,
      borderColor: 'gray',
      backgroundColor: 'white',
      titleFontColor: 'blue',
      bodyFontColor: 'gray',
      footerFontColor: 'gray'
    }
  };

  useEffect(() => {
    if (props.securityTokenName) props.getChartData(props.securityTokenName, startDate, endDate);
  }, [props.securityTokenName]);

  return (
    <Col md="6" className="px-0">
      <Card className="p-0" style={{ height: '400px' }}>
        <CardHeader>Latest Orders</CardHeader>
        <CardBody>
          <Line data={data} options={options} />
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
  );
};

const mapStateToProps = ({ securityToken }: IRootState) => ({
  chartData: securityToken.chartData
});
const mapDispatchToProps = {
  getChartData
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Chart);
