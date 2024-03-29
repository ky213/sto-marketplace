import React from 'react';
import { Bar } from 'react-chartjs-2';
const BarChart = () => {
  const data = {
    datasets: [
      {
        label: 'This year',
        backgroundColor: '#1a237e',
        data: [18, 16, 5, 8, 3, 14, 14]
      },
      {
        label: 'Last year',
        backgroundColor: 'lightgray',
        data: [12, 11, 4, 6, 2, 9, 9]
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
          barThickness: 12,
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

  return (
    <>
      <Bar data={data} options={options} />
    </>
  );
};

export default BarChart;
