import React, { useEffect } from 'react';
import { Row, Table, Card, CardHeader, CardBody, CardFooter, Button, Badge } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import moment from 'moment';
import { Link } from 'react-router-dom';

import { getUserOrders } from 'app/entities/order/order.reducer';
import { getLastSecurityTokens, reset } from 'app/entities/security-token/security-token.reducer';
import { getTopTotalSTAmounts } from 'app/entities/home-customer/home-customer.reducer';
import { IRootState } from 'app/shared/reducers';
import { APP_DATE_FORMAT } from 'app/config/constants';

export interface TablesProps extends StateProps, DispatchProps {}

const Tables = (props: TablesProps) => {
  const { user, orders, securityTokens, topTotalSTAmounts } = props;

  useEffect(() => {
    props.getUserOrders(user.id);
    props.getLastSecurityTokens();
    props.getTopTotalSTAmounts(user.id);

    return () => {
      props.resetSecurityTokens();
    };
  }, []);

  return (
    <Row className="my-3 pr-2 justify-content-between">
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
                        {moment(st.registrationDate).format(APP_DATE_FORMAT)}
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
          <span>List of Assets Held</span>
          <Link to="/security-token" className=" btn btn-outline-primary ml-auto " style={{ fontSize: '14px' }}>
            Buy Token
          </Link>
        </CardHeader>
        <CardBody className="p-0">
          <Table>
            <thead>
              <tr className="border-0">
                <th>Symbol</th>
                <th>Volume</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {topTotalSTAmounts.map(st => (
                <tr key={st.symbol}>
                  <td>{st.symbol}</td>
                  <td>{st.balance.toLocaleString()}</td>
                  <td>CHF {st.lastBuyingPrice}</td>
                  <td>CHF {st.totalAmount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
        <CardFooter className="d-flex p-0">
          <Button className="ml-auto" color="none ">
            <Link to="/white-listing" className=" mr-2" style={{ fontSize: '14px' }}>
              <span className="text-primary">
                view all <FontAwesomeIcon icon="caret-right" />
              </span>
            </Link>
          </Button>
        </CardFooter>
      </Card>
      <Card className="p-0 mt-3 mx-auto ml-3 col-12 ">
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
              {orders.length !== 0 &&
                orders.map(order => (
                  <tr key={order.id}>
                    <td>
                      {order.refOrder}
                      <Badge color="none" className={`ml-2 btn btn-outline-${order.status === 'SUCCESS' ? 'success' : 'danger'}`}>
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

const mapStateToProps = ({ authentication, order, securityToken, homeCustomer }: IRootState) => ({
  user: authentication.account,
  orders: order.entities,
  securityTokens: securityToken.entities,
  topTotalSTAmounts: homeCustomer.topTotalSTAmounts
});

const mapDispatchToProps = {
  getUserOrders,
  getLastSecurityTokens,
  getTopTotalSTAmounts,
  resetSecurityTokens: reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Tables);
