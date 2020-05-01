import React from 'react';
import { Container } from 'reactstrap';
import Header from './components/Header';
import Chart from './components/Charts';

const Home = () => {
  return (
    <Container className="h-100 m-0 p-0" fluid>
      <Header />
      <Chart />
    </Container>
  );
};

export default Home;
