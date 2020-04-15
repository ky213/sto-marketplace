import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './order.reducer';
import { IOrder } from 'app/shared/model/order.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IOrderDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const OrderDetail = (props: IOrderDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { orderEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          Order [<b>{orderEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="idOrder">Id Order</span>
          </dt>
          <dd>{orderEntity.idOrder}</dd>
          <dt>
            <span id="refOrder">Ref Order</span>
          </dt>
          <dd>{orderEntity.refOrder}</dd>
          <dt>
            <span id="createDate">Create Date</span>
          </dt>
          <dd>
            <TextFormat value={orderEntity.createDate} type="date" format={APP_DATE_FORMAT} />
          </dd>
          <dt>
            <span id="updateDate">Update Date</span>
          </dt>
          <dd>
            <TextFormat value={orderEntity.updateDate} type="date" format={APP_DATE_FORMAT} />
          </dd>
          <dt>
            <span id="closeDate">Close Date</span>
          </dt>
          <dd>
            <TextFormat value={orderEntity.closeDate} type="date" format={APP_DATE_FORMAT} />
          </dd>
          <dt>
            <span id="securityTokenName">Security Token Name</span>
          </dt>
          <dd>{orderEntity.securityTokenName}</dd>
          <dt>
            <span id="symbol">Symbol</span>
          </dt>
          <dd>{orderEntity.symbol}</dd>
          <dt>
            <span id="type">Type</span>
          </dt>
          <dd>{orderEntity.type}</dd>
          <dt>
            <span id="limitOrMarket">Limit Or Market</span>
          </dt>
          <dd>{orderEntity.limitOrMarket}</dd>
          <dt>
            <span id="volume">Volume</span>
          </dt>
          <dd>{orderEntity.volume}</dd>
          <dt>
            <span id="price">Price</span>
          </dt>
          <dd>{orderEntity.price}</dd>
          <dt>
            <span id="totalAmount">Total Amount</span>
          </dt>
          <dd>{orderEntity.totalAmount}</dd>
          <dt>
            <span id="categoryToken">Category Token</span>
          </dt>
          <dd>{orderEntity.categoryToken}</dd>
          <dt>
            <span id="status">Status</span>
          </dt>
          <dd>{orderEntity.status}</dd>
          <dt>
            <span id="active">Active</span>
          </dt>
          <dd>{orderEntity.active ? 'true' : 'false'}</dd>
          <dt>User</dt>
          <dd>{orderEntity.user ? orderEntity.user.id : ''}</dd>
          <dt>Transaction</dt>
          <dd>{orderEntity.transaction ? orderEntity.transaction.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/order" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/order/${orderEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ order }: IRootState) => ({
  orderEntity: order.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetail);
