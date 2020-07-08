import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Card, CardHeader, CardBody, Button, CardFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Line } from 'react-chartjs-2';

const data = {
  datasets: [
    {
      label: 'This year',
      borderColor: '#1a237e',
      data: [18, 16, 5, 8, 3, 14, 14]
    }
  ],
  labels: ['1 Aug', ' 2Aug', '3Aug', '4 Aug', '5 Aug', '6 Aug', '7 Aug']
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
const index = () => {
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

export default index;
