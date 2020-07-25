import React, { useEffect } from 'react';
import { Row, Col, Card, CardTitle, CardBody } from 'reactstrap';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getTotalSTAmount, getBankAccountBalance } from '../home-customer.reducer';
import { IRootState } from 'app/shared/reducers';
import 'app/shared/components/home/card-header.scss';

export interface HeaderProps extends StateProps, DispatchProps {}

const Header = (props: HeaderProps) => {
  const { user, totalSTAmount, bankAccountBalance } = props;

  useEffect(() => {
    props.getTotalSTAmount(user.id);
    props.getBankAccountBalance(user.login);
  }, []);

  return (
    <Row className="row pr-1">
      <Col className="px-1">
        <Card className="px-0 py-2 mb-4 mb-xl-0">
          <CardBody className="py-2">
            <Row>
              <Col>
                <CardTitle tag="p" className="text-muted mb-1">
                  Total Tokens Value
                </CardTitle>
                <h6 className="font-weight-bold mb-0 text-primary">
                  CHF{' '}
                  {Object.values(totalSTAmount)
                    .reduce((t: number, v: number) => t + v, 0.0)
                    .toLocaleString()}
                </h6>
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
      {Object.keys(totalSTAmount)
        .slice(0, 1)
        .map((k, i) => (
          <Col className="px-1" key={i}>
            <Card className="px-0 py-2 mb-4 mb-xl-0">
              <CardBody className="py-2">
                <Row>
                  <Col>
                    <CardTitle tag="p" className="text-muted mb-1">
                      {k}
                    </CardTitle>
                    <h6 className="font-weight-bold mb-0 text-primary">CHF {totalSTAmount[k]?.toLocaleString()}</h6>
                  </Col>
                  <Col className="col-3 p-0">
                    <div className="icon ml-auto mr-1 bg-success  rounded-circle shadow">
                      <FontAwesomeIcon icon="chart-bar" color="white" />
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        ))}
      <Col className="px-1">
        <Card className="px-0 py-2 mb-4 mb-xl-0 bg-primary">
          <CardBody className="py-2 ">
            <Row>
              <Col>
                <CardTitle tag="p" className="text-white mb-1">
                  Bank Account Balance
                </CardTitle>
                {bankAccountBalance ? (
                  <h6 className="font-weight-bold mb-0 text-white">CHF {bankAccountBalance.toLocaleString()}</h6>
                ) : (
                  <h6 className="mb-0 text-white">loading...</h6>
                )}
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

const mapStateToProps = ({ homeCustomer, authentication }: IRootState) => ({
  user: authentication.account,
  totalSTAmount: homeCustomer.totalSTAmounts,
  bankAccountBalance: homeCustomer.bankAccountBalance
});

const mapDispatchToProps = {
  getTotalSTAmount,
  getBankAccountBalance
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Header);
