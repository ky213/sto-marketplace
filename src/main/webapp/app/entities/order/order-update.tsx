import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label, Card } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IUser } from 'app/shared/model/user.model';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { ITransaction } from 'app/shared/model/transaction.model';
import { getEntities as getTransactions } from 'app/entities/transaction/transaction.reducer';
import { getEntity, updateEntity, createEntity, reset } from './order.reducer';
import { getEntity as getSecurityToken } from '../security-token/security-token.reducer';
import { IOrder } from 'app/shared/model/order.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { AUTHORITIES } from 'app/config/constants';

export interface IOrderUpdateProps
  extends StateProps,
    DispatchProps,
    RouteComponentProps<{ id: string; securityTokenId: string; type: string }> {}

export const OrderUpdate = (props: IOrderUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);
  const [price, setPrice] = useState(0);
  const [volume, setVolume] = useState(0);

  const { orderEntity, loading, updating, account } = props;

  const isAdmin = account.authorities.includes(AUTHORITIES.ADMIN);
  const isBank = account.authorities.includes(AUTHORITIES.BANK);
  const userId = !(isAdmin || isBank) ? account.id : null;

  const handleClose = () => {
    props.history.push('/order');
  };

  useEffect(() => {
    if (!isNew) {
      props.getEntity(props.match.params.id, userId);
    }

    if (props.match.params?.securityTokenId) {
      props.getSecurityToken(props.match.params?.securityTokenId);
    }

    // props.getUsers();
    // props.getTransactions();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    // values.createDate = convertDateTimeToServer(values.createDate);
    // values.updateDate = convertDateTimeToServer(values.updateDate);
    // values.closeDate = convertDateTimeToServer(values.closeDate);

    if (errors.length === 0) {
      const entity = {
        ...orderEntity,
        ...values,
        totalAmount: price * volume,
        user: { id: account.id },
        securityToken: { id: props.securityToken.id }
      };

      if (isNew) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  return (
    <Row className="justify-content-center mb-2">
      <Col md="8">
        <Card>
          <h4 id="exchangeApp.order.home.createOrEditLabel">Create order</h4>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : orderEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="order-id">ID</Label>
                  <AvInput id="order-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              {/* <Row>
                <AvGroup className="col-md-6">
                  <Label id="idOrderLabel" for="order-idOrder">
                    Id Order
                  </Label>
                  <AvField
                    id="order-idOrder"
                    type="text"
                    name="idOrder"
                    validate={{
                      required: { value: true, errorMessage: 'This field is required.' }
                    }}
                  />
                </AvGroup>
                <AvGroup className="col-md-6">
                  <Label id="refOrderLabel" for="order-refOrder">
                    Ref Order
                  </Label>
                  <AvField
                    id="order-refOrder"
                    type="string"
                    className="form-control"
                    name="refOrder"
                    validate={{
                      required: { value: true, errorMessage: 'This field is required.' },
                      number: { value: true, errorMessage: 'This field should be a number.' }
                    }}
                  />
                </AvGroup>
              </Row> */}
              {/* <Row>
                <AvGroup className="col-md-6">
                  <Label id="createDateLabel" for="order-createDate">
                    Create Date
                  </Label>
                  <AvInput
                    id="order-createDate"
                    type="datetime-local"
                    className="form-control"
                    name="createDate"
                    placeholder={'YYYY-MM-DD HH:mm'}
                    value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.orderEntity.createDate)}
                    validate={{
                      required: { value: true, errorMessage: 'This field is required.' }
                    }}
                  />
                </AvGroup>
                <AvGroup className="col-md-6">
                  <Label id="updateDateLabel" for="order-updateDate">
                    Update Date
                  </Label>
                  <AvInput
                    id="order-updateDate"
                    type="datetime-local"
                    className="form-control"
                    name="updateDate"
                    placeholder={'YYYY-MM-DD HH:mm'}
                    value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.orderEntity.updateDate)}
                  />
                </AvGroup>
              </Row> */}
              <Row>
                {/* <AvGroup className="col-md-6">
                  <Label id="closeDateLabel" for="order-closeDate">
                    Close Date
                  </Label>
                  <AvInput
                    id="order-closeDate"
                    type="datetime-local"
                    className="form-control"
                    name="closeDate"
                    placeholder={'YYYY-MM-DD HH:mm'}
                    value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.orderEntity.closeDate)}
                  />
                </AvGroup> */}
                <AvGroup className="col">
                  <Label id="securityTokenNameLabel" for="order-securityTokenName">
                    Security Token Name
                  </Label>
                  <AvField
                    id="order-securityTokenName"
                    type="text"
                    name="securityTokenName"
                    value={props.securityToken?.name}
                    validate={{
                      required: { value: true, errorMessage: 'This field is required.' }
                    }}
                    readOnly
                  />
                </AvGroup>
              </Row>
              <Row>
                <AvGroup className="col-md-6">
                  <Label id="symbolLabel" for="order-symbol">
                    Symbol
                  </Label>
                  <AvField
                    id="order-symbol"
                    type="text"
                    name="symbol"
                    value={props.securityToken?.symbol}
                    validate={{
                      required: { value: true, errorMessage: 'This field is required.' }
                    }}
                    readOnly
                  />
                </AvGroup>
                <AvGroup className="col-md-6">
                  <Label id="typeLabel" for="order-type">
                    Type
                  </Label>
                  <AvInput id="order-type" type="select" className="form-control" name="type" value={props.match.params?.type}>
                    <option value="BUY">BUY</option>
                    <option value="SELL">SELL</option>
                  </AvInput>
                </AvGroup>
              </Row>
              <Row>
                <AvGroup className="col-md-6">
                  <Label id="limitOrMarketLabel" for="order-limitOrMarket">
                    Limit Or Market
                  </Label>
                  <AvInput
                    id="order-limitOrMarket"
                    type="select"
                    className="form-control"
                    name="limitOrMarket"
                    value={(!isNew && orderEntity.limitOrMarket) || 'LIMIT'}
                  >
                    <option value="LIMIT">LIMIT</option>
                    <option value="MARKET">MARKET</option>
                  </AvInput>
                </AvGroup>
                <AvGroup className="col-md-6">
                  <Label id="volumeLabel" for="order-volume">
                    Volume
                  </Label>
                  <AvField
                    id="order-volume"
                    type="string"
                    className="form-control"
                    name="volume"
                    value={volume}
                    validate={{
                      required: { value: true, errorMessage: 'This field is required.' },
                      number: { value: true, errorMessage: 'This field should be a number.' }
                    }}
                    onChange={({ target }) => setVolume(Math.abs(target.value))}
                  />
                </AvGroup>
              </Row>
              <Row>
                <AvGroup className="col-md-6">
                  <Label id="priceLabel" for="order-price">
                    Price
                  </Label>
                  <AvField
                    id="order-price"
                    type="string"
                    className="form-control"
                    name="price"
                    validate={{
                      required: { value: true, errorMessage: 'This field is required.' },
                      number: { value: true, errorMessage: 'This field should be a number.' }
                    }}
                    onChange={({ target }) => setPrice(Math.abs(target.value))}
                  />
                </AvGroup>
                <AvGroup className="col-md-6">
                  <Label id="totalAmountLabel" for="order-totalAmount">
                    Total Amount
                  </Label>
                  <AvField
                    id="order-totalAmount"
                    type="string"
                    className="form-control"
                    name="totalAmount"
                    value={(price * volume).toLocaleString()}
                    readOnly
                  />
                </AvGroup>
              </Row>
              {/* 
              <Row>
                <AvGroup className="col-md-6">
                  <Label id="categoryTokenLabel" for="order-categoryToken">
                    Category Token
                  </Label>
                  <AvInput
                    id="order-categoryToken"
                    type="select"
                    className="form-control"
                    name="categoryToken"
                    value={(!isNew && orderEntity.categoryToken) || 'EQUITY'}
                  >
                    <option value="EQUITY">EQUITY</option>
                    <option value="FUNDS">FUNDS</option>
                    <option value="REAL_ESTATE">REAL_ESTATE</option>
                    <option value="DERIVATIVE">DERIVATIVE</option>
                  </AvInput>
                </AvGroup>
                <AvGroup className="col-md-6">
                  <Label id="statusLabel" for="order-status">
                    Status
                  </Label>
                  <AvInput
                    id="order-status"
                    type="select"
                    className="form-control"
                    name="status"
                    value={(!isNew && orderEntity.status) || 'NONE'}
                  >
                    <option value="NONE">NONE</option>
                    <option value="INIT">INIT</option>
                    <option value="PENDING">PENDING</option>
                    <option value="SUCCESS">SUCCESS</option>
                    <option value="FAIL">FAIL</option>
                    <option value="REMOVE">REMOVE</option>
                  </AvInput>
                </AvGroup>
              </Row>
          <Row>
                <AvGroup className="col-md-6">
                  <Label for="order-transaction">Transaction</Label>
                  <AvInput id="order-transaction" type="select" className="form-control" name="transaction.id">
                    <option value="" key="0" />
                    {transactions
                      ? transactions.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.id}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <AvGroup className="col-md-6">
                  <Label for="order-user">User</Label>
                  <AvInput id="order-user" type="select" className="form-control" name="user">
                    <option value="" key="0" />
                    {users
                      ? users.map((otherEntity, index) => (
                          <option value={index} key={otherEntity.id}>
                            {otherEntity.id}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
              </Row> 
              <AvGroup check>
                <Label id="activeLabel">
                  <AvInput id="order-active" type="checkbox" className="form-check-input" name="active" />
                  Active
                </Label>
              </AvGroup>
              */}
              <Button tag={Link} id="cancel-save" to="/order" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">Back</span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp; Save
              </Button>
            </AvForm>
          )}
        </Card>
      </Col>
    </Row>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  users: storeState.userManagement.users,
  transactions: storeState.transaction.entities,
  orderEntity: storeState.order.entity,
  loading: storeState.order.loading,
  updating: storeState.order.updating,
  updateSuccess: storeState.order.updateSuccess,
  account: storeState.authentication.account,
  securityToken: storeState.securityToken.entity
});

const mapDispatchToProps = {
  getUsers,
  getTransactions,
  getEntity,
  updateEntity,
  createEntity,
  reset,
  getSecurityToken
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(OrderUpdate);
