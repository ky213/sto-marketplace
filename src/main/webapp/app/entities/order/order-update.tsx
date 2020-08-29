import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label, Card } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { getEntities as getTransactions } from 'app/entities/transaction/transaction.reducer';
import { getEntity, updateEntity, createEntity, reset } from './order.reducer';
import { getEntity as getSecurityToken } from '../security-token/security-token.reducer';
import { AUTHORITIES } from 'app/config/constants';

export interface IOrderUpdateProps
  extends StateProps,
    DispatchProps,
    RouteComponentProps<{ id: string; securityTokenId: string; type: string }> {}

export const OrderUpdate = (props: IOrderUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);
  const [price, setPrice] = useState(0);
  const [volume, setVolume] = useState(0);

  const { orderEntity, loading, updating, account, securityToken, match } = props;

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
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  useEffect(() => {
    const defaultPrice = match.params.type === 'BUY' ? securityToken.lastBuyingPrice : securityToken.lastSellingprice;
    setPrice(defaultPrice);
  }, [securityToken]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...orderEntity,
        ...values,
        totalAmount: price * volume,
        user: { id: account.id },
        securityToken: { id: securityToken.id }
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
      <Col>
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
              <Row>
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
                  <AvInput id="order-limitOrMarket" type="select" className="form-control" name="limitOrMarket" value="MARKET">
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
                    value={price}
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
              <Button tag={Link} id="cancel-save" to="/security-token" replace color="info">
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
