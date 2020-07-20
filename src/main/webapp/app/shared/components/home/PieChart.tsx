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
    </div>
  );
};

export default PieChart;
