import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Alert, Label, Input, FormGroup, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Switch from 'react-switch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { ORDERTYPE } from 'app/shared/model/enumerations/ordertype.model';
import { ACTIONTYPE } from 'app/shared/model/enumerations/actiontype.model';
import { createEntity, reset } from 'app/entities/order/order.reducer';
import { IOrder } from 'app/shared/model/order.model';

export interface TradingProps extends StateProps, DispatchProps {}

const Trading = (props: TradingProps) => {
  const [volume, setVolume] = useState(0);
  const [orderType, setOrderType] = useState(ORDERTYPE.LIMIT);
  const [isOpen, setIsOpen] = useState(false);
  const [actionType, setActionType] = useState(ACTIONTYPE.BUY);
  const [price, setPrice] = useState(0);

  const { securityToken, account } = props;

  const handleVolumeChange = (value: string) => {
    setVolume(parseFloat(value));
  };
  const handlePriceChange = (value: string) => {
    setPrice(parseFloat(value));
  };

  const handleChange = (checked: boolean) => {
    if (checked) setOrderType(ORDERTYPE.MARKET);
    else setOrderType(ORDERTYPE.LIMIT);
  };

  const confirmCreate = () => {
    const entity: IOrder = {
      volume,
      type: actionType,
      price,
      totalAmount: price * volume,
      active: false,
      securityTokenName: securityToken.name,
      symbol: securityToken.symbol,
      limitOrMarket: orderType,
      user: { id: account.id },
      securityToken: { id: securityToken.id }
    };

    props.createEntity(entity);

    setIsOpen(false);
  };

  const handleTrade = (type: ACTIONTYPE) => {
    if (isNaN(price * volume)) {
      alert('Please set correct value!');
      return;
    }

    const stPrice = type === ACTIONTYPE.BUY ? securityToken.lastBuyingPrice : securityToken.lastSellingprice;

    if (orderType === ORDERTYPE.MARKET) setPrice(stPrice);

    setActionType(type);
    setIsOpen(true);
  };

  return (
    <Row className="px-3">
      <Modal isOpen={isOpen}>
        <ModalHeader>Confirm order creation</ModalHeader>
        <ModalBody id="exchangeApp.securityToken.delete.question">
          <div className="px-5">
            <p>
              <strong>Security Token: </strong> {securityToken.name}
            </p>
            <p>
              <strong>Order Type: </strong> {orderType}
            </p>
            <p>
              <strong>Price: </strong> {price} CHF
            </p>
            <p>
              <strong>Volume: </strong> {volume}
            </p>
            <p className="border-top pt-2 d-flex justify-content-between">
              <strong>Total Amout : </strong>
              <strong>{(price * volume).toLocaleString()} CHF</strong>
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={() => setIsOpen(false)}>
            <FontAwesomeIcon icon="ban" />
            &nbsp; Cancel
          </Button>
          <Button id="jhi-confirm-delete-securityToken" color="primary" onClick={confirmCreate}>
            <FontAwesomeIcon icon="check" />
            &nbsp; Confirm
          </Button>
        </ModalFooter>
      </Modal>
      <Row className="w-100">
        <Col>
          <Alert color="success" className="py-2 px-4" style={{ cursor: 'pointer' }} onClick={() => handleTrade(ACTIONTYPE.BUY)}>
            <div className="d-flex ">
              <div className="col-3 d-flex flex-column justify-content-between pl-0">
                <small>
                  <strong>BUY</strong>
                </small>
                <small>CHF</small>
              </div>
              <h1 className="w-100 text-center pr-3">{securityToken.lastBuyingPrice?.toLocaleString()}</h1>
            </div>
          </Alert>
        </Col>
        <Col>
          <Alert color="danger" className="py-2 pl-4" style={{ cursor: 'pointer' }} onClick={() => handleTrade(ACTIONTYPE.SELL)}>
            <div className="d-flex">
              <h1 className="w-100 text-center">{securityToken.lastSellingprice?.toLocaleString()}</h1>
              <div className="col-3 d-flex flex-column justify-content-between pr-0">
                <small>
                  <b>SELL</b>
                </small>
                <small>CHF</small>
              </div>
            </div>
          </Alert>
        </Col>
      </Row>
      <Row className="w-100">
        <Col className="d-flex align-items-center justify-content-center mx-auto">
          <h3 className={`${orderType === ORDERTYPE.MARKET ? 'text-secondary' : ''}`}>Limit </h3>
          <Switch
            onChange={handleChange}
            checked={orderType === ORDERTYPE.MARKET}
            className="mx-2 mb-1"
            checkedIcon={false}
            uncheckedIcon={false}
            onColor="#4e98ed"
            offColor="#4e98ed"
          />
          <h3 className={`${orderType === ORDERTYPE.LIMIT ? 'text-secondary' : ''}`}> Market</h3>
        </Col>
      </Row>
      <Row className="w-100">
        <Col>
          <Row>
            <Col>
              <FormGroup>
                <Label>Volume</Label>
                <Input type="number" value={volume} onChange={({ target }) => handleVolumeChange(target.value)} />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label>Price</Label>
                <Input
                  type="number"
                  value={price}
                  onChange={({ target }) => handlePriceChange(target.value)}
                  disabled={orderType === ORDERTYPE.MARKET}
                />
              </FormGroup>
            </Col>
          </Row>
        </Col>
      </Row>
    </Row>
  );
};

const mapStateToProps = ({ securityToken, authentication, order }: IRootState) => ({
  securityToken: securityToken.entity,
  account: authentication.account,
  success: order.updateSuccess
});

const mapDispatchToProps = { createEntity, reset };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Trading);
