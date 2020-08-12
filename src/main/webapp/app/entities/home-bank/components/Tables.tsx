import React, { useEffect } from 'react';
import { Row, Table, Card, CardHeader, CardBody, CardFooter, Button, Alert, Badge } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { connect } from 'react-redux';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { IRootState } from 'app/shared/reducers';
import { getLastSecurityTokens, reset } from 'app/entities/security-token/security-token.reducer';
import { getUsersBalance, getLastOrders } from 'app/entities/home-bank/home-bank.reducer';

export interface TablesProps extends StateProps, DispatchProps {}

const Tables = (props: TablesProps) => {
  const { securityTokens, usersBalance, lastOrders } = props;

  useEffect(() => {
    props.getLastSecurityTokens(true);
    props.getUsersBalance();
    props.getLastOrders();

    return () => {
      props.resetSecurityTokens();
    };
  }, []);

  const orderStatus = {
    INIT: 'primary',
    PENDING: 'warning',
    SUCCESS: 'success',
    REMOVE: 'danger',
    FAIL: 'danger',
    NONE: 'info'
  };

  return (
    <Row className="mt-3 pr-2 justify-content-between">
      <Card className="p-0 col-4">
        <CardHeader className="py-3">Latest Tokens Added</CardHeader>
        <CardBody className="p-0">
          <Table>
            <tbody>
              {securityTokens.map(st => (
                <tr className="border-top-0" key={st.id}>
                  <td className="d-flex border-top-0">
                    <div className="pr-3 d-flex align-items-center">
                      <img src={`data:${st.logoContentType};base64,${st.logo}`} style={{ maxHeight: '40px' }} />
                    </div>
                    <div>
                      <p className="m-0" style={{ fontSize: '16px' }}>
                        {st.name}
                      </p>
                      <p className="text-muted m-0" style={{ fontSize: '12px' }}>
                        {moment(st.dueDiligenceDate).format(APP_DATE_FORMAT)}
                      </p>
                    </div>
                  </td>
                  <td className="border-top-0 pt-3">
                    <Link to={`/security-token/${st.id}/user`} className="ml-auto text-primary p-2">
                      <FontAwesomeIcon icon="eye" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {securityTokens.length === 0 && (
            <Alert color="warning" className="text-center mx-2">
              no data
            </Alert>
          )}
        </CardBody>
        <CardFooter className="d-flex p-0">
          <Link to="/security-token" className="ml-auto">
            <Button color="none ">
              <span className=" mr-2" style={{ fontSize: '14px' }}>
                view all
              </span>
              <FontAwesomeIcon icon="caret-right" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
      <Card className="p-0  ml-3 col ">
        <CardHeader className="py-2 d-flex align-items-center">
          <span>Users balance</span>
        </CardHeader>
        <CardBody className="p-0">
          <Table>
            <thead>
              <tr className="border-0">
                <th>Customer</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {usersBalance.map((b, i) => (
                <tr key={i}>
                  <td>{b[0]}</td>
                  <td>CHF {b[1].toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          {usersBalance.length === 0 && (
            <Alert color="warning" className="text-center mx-3">
              no data
            </Alert>
          )}
        </CardBody>
        <CardFooter className="d-flex p-0">
          <Button className="ml-auto" color="none ">
            <span className=" mr-2" style={{ fontSize: '14px' }}>
              view all
            </span>
            <FontAwesomeIcon icon="caret-right" />
          </Button>
        </CardFooter>
      </Card>
      <Card className="p-0 my-3 mx-auto ml-3 col-12 ">
        <CardBody className="p-0">
          <Table>
            <thead>
              <tr className="border-0 bg-beige">
                <th>Order ref</th>
                <th>Token</th>
                <th>Symbol</th>
                <th>Category</th>
                <th>Type</th>
                <th>Volume</th>
                <th>Price</th>
                <th>Total</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {lastOrders.map(order => (
                <tr key={order.id}>
                  <td>
                    {order.refOrder} <br />
                    <Badge color="none" className={`ml-2 btn btn-outline-${orderStatus[order.status]}`}>
                      {order.status.toLocaleLowerCase()}
                    </Badge>
                  </td>
                  <td>{order.securityTokenName}</td>
                  <td>{order.securityToken.symbol}</td>
                  <td>{order.categoryToken}</td>
                  <td>{order.type}</td>
                  <td>{order.volume}</td>
                  <td>{order.price.toLocaleString()} CHF</td>
                  <td>{order.totalAmount.toLocaleString()} CHF</td>
                  <td>{moment(order.updateDate).format(APP_DATE_FORMAT)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          {lastOrders.length === 0 && (
            <Alert color="warning" className="text-center mx-5">
              no data
            </Alert>
          )}
        </CardBody>
        <CardFooter className="d-flex p-0">
          <Link to="/order" className="ml-auto">
            <Button color="none ">
              <span className=" mr-2" style={{ fontSize: '14px' }}>
                view all
              </span>
              <FontAwesomeIcon icon="caret-right" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </Row>
  );
};

const mapStateToProps = ({ homeBank, securityToken }: IRootState) => ({
  usersBalance: homeBank.usersBalance,
  lastOrders: homeBank.lastOrders,
  securityTokens: securityToken.entities
});

const mapDispatchToProps = {
  getLastSecurityTokens,
  getUsersBalance,
  getLastOrders,
  resetSecurityTokens: reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Tables);
