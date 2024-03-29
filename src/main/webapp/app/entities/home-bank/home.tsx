import React from 'react';
import { Container } from 'reactstrap';
import { Header, Charts, Tables } from './components';

const Home = () => {
  return (
    <Container id="home-bank" className="h-100 m-0 p-0 " fluid>
      <Header />
      <Charts />
      <Tables />
    </Container>
  );
};

export default Home;
