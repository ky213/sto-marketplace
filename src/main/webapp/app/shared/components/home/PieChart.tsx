import React from 'react';
import { Row, Col } from 'reactstrap';
import { Doughnut } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const PieChart = () => {
  const data = {
    datasets: [
      {
        data: [33, 30, 15, 23],
        backgroundColor: ['#1a237e', '#43a047', '#e53935', '#fb8c00'],
        borderWidth: 1,
        borderColor: 'white',
        hoverBorderColor: 'white'
      }
    ],
    labels: ['Equity', 'Funds', 'Real Estate', 'Derivative']
  };

  const options = {
    cutoutPercentage: 80,
    legend: {
      display: false
    }
  };

  return (
    <div className="h-100 d-flex flex-column">
      <div className=" flex-grow-1">
        <Doughnut data={data} options={options} height={90} width={100} />
      </div>
      <Row className="mt-4 ">
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
            {' '}
            Funds
          </p>
          <b className="py-0 my-0 text-success"> 30%</b>
        </Col>
        <Col className="text-center text-muted p-0">
          <p className="py-0 my-0">
            <FontAwesomeIcon icon="building" />
          </p>
          <p className="py-0 my-0" style={{ fontSize: '12px' }}>
            {' '}
            Real Estate
          </p>
          <b className="py-0 my-0 text-danger"> 15%</b>
        </Col>
        <Col className="text-center text-muted p-0">
          <p className="py-0 my-0">
            <FontAwesomeIcon icon="cubes" />
          </p>
          <p className="py-0 my-0" style={{ fontSize: '12px' }}>
            {' '}
            Derivative
          </p>
          <b className="py-0 my-0" style={{ color: '#fb8c00' }}>
            {' '}
            23%
          </b>
        </Col>
      </Row>
    </div>
  );
};

export default PieChart;
