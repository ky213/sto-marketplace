import React from 'react';
import { Row, Col } from 'reactstrap';
import HeaderCard from 'app/shared/components/home/HeaderCard';

const mockData = [
  {
    title: { content: 'Total Tokens Value', color: 'muted' },
    amount: { value: "250'782.90", color: 'primary' },
    growth: { status: 'down', value: '12%', color: 'danger' },
    icon: { name: 'money-bill-wave', color: 'white', background: 'danger' }
  },
  {
    title: { content: 'Mont Pelerin', color: 'muted' },
    amount: { value: "250'782.90", color: 'primary' },
    growth: { status: 'up', value: '10%', color: 'success' },
    icon: { name: 'chart-bar', color: 'white', background: 'success' }
  },
  {
    title: { content: 'Constantin Lapiere', color: 'muted' },
    amount: { value: "250'782.90", color: 'primary' },
    growth: { status: 'up', value: '5%', color: 'success' },
    icon: { name: 'chart-bar', color: 'white', background: 'success' }
  },
  {
    title: { content: 'Bank Account Balance', color: 'white' },
    amount: { value: "250'782.90", color: 'white' },
    icon: { name: 'wallet', color: '#0b2662', background: 'white' },
    bg: 'primary'
  }
];

const Header = () => {
  return (
    <Row className="row mx-lg-n5">
      {mockData.map((props, index) => (
        <Col className="px-1" key={index}>
          <HeaderCard {...props} />
        </Col>
      ))}
    </Row>
  );
};

export default Header;
