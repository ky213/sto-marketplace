import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Card, CardHeader, CardBody } from 'reactstrap';
import { ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './order.reducer';
import { IOrder } from 'app/shared/model/order.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT, AUTHORITIES } from 'app/config/constants';
import moment from 'moment';

export interface IOrderDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const OrderDetail = (props: IOrderDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { orderEntity, account } = props;

  const isAdmin = props.account.authorities.includes(AUTHORITIES.ADMIN);
  const isBank = props.account.authorities.includes(AUTHORITIES.BANK);

  return (
    <Row className="mb-2">
      <Col md="4" className=" p-0">
        <Card className="p-0">
          <CardBody className="p-3">
            <h5>{orderEntity.idOrder}</h5>
            <Row>
              <Col>
                <small className="text-muted">
                  Token: {orderEntity.securityTokenName} <br />
                  {moment().format('LLL')}
                </small>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
      <Col md="8">
        <Card className="p-0">
          <CardHeader>
            <h5>
              ID: <b>{orderEntity.id}</b>
            </h5>
          </CardHeader>
          <CardBody>
            <Row>
              <Col>
                <small className="text-muted ">Id Order</small>
                <p>{orderEntity.idOrder}</p>
              </Col>
              <Col>
                <small className="text-muted ">Ref Order</small>
                <p>{orderEntity.refOrder}</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-muted ">Create Date</small>
                <p>
                  <TextFormat value={orderEntity.createDate} type="date" format={APP_DATE_FORMAT} />
                </p>
              </Col>
              <Col>
                <small className="text-muted ">Update Date</small>
                <p>
                  <TextFormat value={orderEntity.updateDate} type="date" format={APP_DATE_FORMAT} />
                </p>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-muted ">Close Date</small>
                <p>
                  <TextFormat value={orderEntity.closeDate} type="date" format={APP_DATE_FORMAT} />
                </p>
              </Col>
              <Col>
                <small className="text-muted ">Security Token Name</small>
                <p>{orderEntity.securityTokenName}</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-muted ">Symbol</small>
                <p>{orderEntity.symbol}</p>
              </Col>
              <Col>
                <small className="text-muted ">Type</small>
                <p>{orderEntity.type}</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-muted ">Limit Or Market</small>
                <p>{orderEntity.limitOrMarket}</p>
              </Col>
              <Col>
                <small className="text-muted ">Volume</small>
                <p>{orderEntity.volume}</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-muted ">Price</small>
                <p>{orderEntity.price?.toLocaleString()} CHF</p>
              </Col>
              <Col>
                <small className="text-muted ">Total Amount</small>
                <p>{orderEntity.totalAmount?.toLocaleString()} CHF</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-muted ">Category Token</small>
                <p>{orderEntity.categoryToken}</p>
              </Col>
              <Col>
                <small className="text-muted ">Status</small>
                <p>{orderEntity.status}</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-muted ">Active</small>
                <p>{orderEntity.active ? 'true' : 'false'}</p>
              </Col>
              <Col>
                <small className="text-muted ">User</small>
                <p>{orderEntity.user ? orderEntity.user.id : ''}</p>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col>
                <small className="text-muted ">Transaction</small>
                <p>{orderEntity.transaction ? orderEntity.transaction.id : ''}</p>
              </Col>
            </Row>
            <Button tag={Link} to="/order" replace color="info">
              <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
            </Button>
            &nbsp;
            {(isAdmin || isBank) && (
              <Button tag={Link} to={`/order/${orderEntity.id}/edit`} replace color="primary">
                <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
              </Button>
            )}
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ order, authentication }: IRootState) => ({
  orderEntity: order.entity,
  account: authentication.account
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetail);
