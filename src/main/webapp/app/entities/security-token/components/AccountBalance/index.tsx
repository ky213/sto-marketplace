import React, { useEffect } from 'react';
import { Row, Col, Card, CardBody, CardTitle } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';

import { getBankAccountBalance } from 'app/entities/home-customer/home-customer.reducer';

export interface AccountBalanceProps extends StateProps, DispatchProps {}

const AccountBalance = (props: AccountBalanceProps) => {
  useEffect(() => {
    props.getBankAccountBalance(props.userLogin);
  }, []);

  return (
    <div className="mt-2">
      <Card className="p-0 mb-4 mb-xl-0">
        <CardBody className="py-2 bg-primary">
          <Row>
            <Col>
              <CardTitle tag="p" className="text-white mb-1">
                Bank Account Balance
              </CardTitle>
              {props.bankAccountBalance ? (
                <h6 className="font-weight-bold mb-0 text-white">CHF {props.bankAccountBalance.toLocaleString()}</h6>
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
    </div>
  );
};

const mapStateToProps = ({ authentication, homeCustomer }: IRootState) => ({
  userLogin: authentication.account.login,
  bankAccountBalance: homeCustomer.bankAccountBalance
});

const mapDispatchToProps = { getBankAccountBalance };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(AccountBalance);
