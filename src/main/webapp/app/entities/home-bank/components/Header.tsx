import React, { useEffect } from 'react';
import { Row, Col, Card, CardTitle, CardBody, Progress } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';

import { getNumberOfUsers, getTotalTransactions, getTotalRevenue } from 'app/entities/home-bank/home-bank.reducer';
import 'app/shared/components/home/card-header.scss';

export interface HeaderProps extends StateProps, DispatchProps {}

const Header = (props: HeaderProps) => {
  const { totalUsers, totalRevenue, totalTransactions } = props;

  useEffect(() => {
    props.getNumberOfUsers();
    props.getTotalRevenue();
    props.getTotalTransactions();
  }, []);

  return (
    <Row className="row pr-1">
      <Col className="px-1">
        <Card className="p-0 py-2 mb-4 mb-xl-0">
          <CardBody className="py-2">
            <Row>
              <Col>
                <CardTitle tag="p" className="text-muted mb-1">
                  Total Custody Value
                </CardTitle>
                <h6 className="font-weight-bold mb-0 text-primary">CHF {"250'782.90"}</h6>
              </Col>
              <Col className="col-3 p-0">
                <div className="icon ml-auto mr-1 bg-danger  rounded-circle shadow">
                  <FontAwesomeIcon icon="money-bill-wave" color="white" />
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
      <Col className="px-1">
        <Card className="p-0 py-2 mb-4 mb-xl-0">
          <CardBody className="py-2">
            <Row>
              <Col>
                <CardTitle tag="p" className="text-muted mb-1">
                  Total Users
                </CardTitle>
                <h6 className="font-weight-bold mb-0 text-primary">{totalUsers}</h6>
              </Col>
              <Col className="col-3 p-0">
                <div className="icon ml-auto mr-1 bg-success  rounded-circle shadow">
                  <FontAwesomeIcon icon="users" color="white" />
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
      <Col className="px-1">
        <Card className="p-0 py-2 mb-4 mb-xl-0">
          <CardBody className="py-2">
            <Row>
              <Col>
                <CardTitle tag="p" className="text-muted mb-1">
                  Total Transactions
                </CardTitle>
                <h6 className="font-weight-bold mb-0 text-primary">{totalTransactions}</h6>
              </Col>
              <Col className="col-3 p-0">
                <div className="icon ml-auto mr-1 bg-primary  rounded-circle shadow">
                  <FontAwesomeIcon icon="chart-bar" color="white" />
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
      <Col className="px-1 ">
        <Card className="p-0 py-2 mb-4 mb-xl-0 bg-primary">
          <CardBody className="py-2 ">
            <Row>
              <Col>
                <CardTitle tag="p" className="text-white mb-1">
                  Total Revenue{' '}
                </CardTitle>
                <h6 className="font-weight-bold mb-0 text-white">CHF {totalRevenue?.toLocaleString()}</h6>
              </Col>
              <Col className="col-3 p-0">
                <div className="icon ml-auto mr-1 bg-white  rounded-circle shadow">
                  <FontAwesomeIcon icon="wallet" color="#0b2662" />
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ homeBank }: IRootState) => ({
  totalUsers: homeBank.numberOfUsers,
  totalTransactions: homeBank.totalTransactions,
  totalRevenue: homeBank.totalRevenue
});

const mapDispatchToProps = {
  getNumberOfUsers,
  getTotalTransactions,
  getTotalRevenue
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Header);
