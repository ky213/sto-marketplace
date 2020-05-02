import React from 'react';
import { Container } from 'reactstrap';
import { Header, Charts } from './components';

const Home = () => {
  return (
    <Container className="h-100 m-0 p-0" fluid>
      <Header />
      <Charts />
    </Container>
  );
};

export default Home;
