import React, { useEffect } from 'react';
import { Row, Table, Card, CardHeader, CardBody, CardFooter, Button, Badge } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getUserOrders } from 'app/entities/order/order.reducer';
import { connect } from 'react-redux';
import moment from 'moment';
import { Alert } from 'reactstrap';
import { Link } from 'react-router-dom';

import { IRootState } from 'app/shared/reducers';
import { APP_DATE_FORMAT } from 'app/config/constants';

export interface TablesProps extends StateProps, DispatchProps {}

const Tables = (props: TablesProps) => {
  const { user, orders } = props;

  useEffect(() => {
    props.getUserOrders(user.id);
  }, []);

  return (
    <Row className="my-3 pr-2 justify-content-between">
      <Card className="p-0 col-4">
        <CardHeader className="py-3">Latest Token Added</CardHeader>
        <CardBody className="p-0">
          <Table>
            <tbody>
              <tr className="border-top-0">
                <td className="d-flex border-top-0">
                  <div className="pr-3 d-flex align-items-center" style={{ fontSize: '35px' }}>
                    <FontAwesomeIcon icon="file-contract" />
                  </div>
                  <div>
                    <p className="m-0" style={{ fontSize: '16px' }}>
                      Token 1
                    </p>
                    <p className="text-muted m-0" style={{ fontSize: '12px' }}>
                      Updated 2 days ago
                    </p>
                  </div>
                </td>
                <td className="text-right  border-top-0">
                  <Button color="none">
                    <FontAwesomeIcon icon="eye" />
                  </Button>
                </td>
              </tr>
              <tr>
                <td className="d-flex">
                  <div className="pr-3 d-flex align-items-center" style={{ fontSize: '35px' }}>
                    <FontAwesomeIcon icon="file-contract" />
                  </div>
                  <div>
                    <p className="m-0" style={{ fontSize: '16px' }}>
                      Token 2
                    </p>
                    <p className="text-muted m-0" style={{ fontSize: '12px' }}>
                      Updated 2 days ago
                    </p>
                  </div>
                </td>
                <td className="text-right">
                  <Button color="none">
                    <FontAwesomeIcon icon="eye" />
                  </Button>
                </td>
              </tr>
              <tr>
                <td className="d-flex">
                  <div className="pr-3 d-flex align-items-center" style={{ fontSize: '35px' }}>
                    <FontAwesomeIcon icon="file-contract" />
                  </div>
                  <div>
                    <p className="m-0" style={{ fontSize: '16px' }}>
                      Token 3
                    </p>
                    <p className="text-muted m-0" style={{ fontSize: '12px' }}>
                      Updated 2 days ago
                    </p>
                  </div>
                </td>
                <td className="text-right">
                  <Button color="none">
                    <FontAwesomeIcon icon="eye" />
                  </Button>
                </td>
              </tr>
              <tr>
                <td className="d-flex">
                  <div className="pr-3 d-flex align-items-center" style={{ fontSize: '35px' }}>
                    <FontAwesomeIcon icon="file-contract" />
                  </div>
                  <div>
                    <p className="m-0" style={{ fontSize: '16px' }}>
                      Token 4
                    </p>
                    <p className="text-muted m-0" style={{ fontSize: '12px' }}>
                      Updated 2 days ago
                    </p>
                  </div>
                </td>
                <td className="text-right">
                  <Button color="none">
                    <FontAwesomeIcon icon="eye" />
                  </Button>
                </td>
              </tr>
              <tr>
                <td className="d-flex">
                  <div className="pr-3 d-flex align-items-center" style={{ fontSize: '35px' }}>
                    <FontAwesomeIcon icon="file-contract" />
                  </div>
                  <div>
                    <p className="m-0" style={{ fontSize: '16px' }}>
                      Token 5
                    </p>
                    <p className="text-muted m-0" style={{ fontSize: '12px' }}>
                      Updated 2 days ago
                    </p>
                  </div>
                </td>
                <td className="text-right">
                  <Button color="none">
                    <FontAwesomeIcon icon="eye" />
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
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
      <Card className="p-0  ml-3 col ">
        <CardHeader className="py-2 d-flex align-items-center">
          <span>List of Assets Held</span>
          <button className="btn btn-outline-primary ml-auto  ">Buy Token</button>
        </CardHeader>
        <CardBody className="p-0">
          <Table>
            <thead>
              <tr className="border-0">
                <th>Symbol</th>
                <th>Amount</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>TK1</td>
                <td>153</td>
                <td>5.50 CHF</td>
                <td>841.50 CHF</td>
              </tr>
              <tr>
                <td>TK2</td>
                <td>1025</td>
                <td>105 CHF</td>
                <td>841.50 CHF</td>
              </tr>
              <tr>
                <td>ALK</td>
                <td>25</td>
                <td>122 CHF</td>
                <td>5643.50 CHF</td>
              </tr>
              <tr>
                <td>XGE</td>
                <td>200</td>
                <td>175 CHF</td>
                <td>7654.50 CHF</td>
              </tr>
              <tr>
                <td>TK3</td>
                <td>12</td>
                <td>355.80 CHF</td>
                <td>4269.96 CHF</td>
              </tr>
              <tr>
                <td>TK4</td>
                <td>7</td>
                <td>1250 CHF</td>
                <td>8750.50 CHF</td>
              </tr>
            </tbody>
          </Table>
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

const mapStateToProps = ({ order, authentication }: IRootState) => ({
  orders: order.entities,
  user: authentication.account
});

const mapDispatchToProps = {
  getUserOrders
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Tables);
