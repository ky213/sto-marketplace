import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Alert, Label, Input, FormGroup, Modal } from 'reactstrap';
import Switch from 'react-switch';

import { IRootState } from 'app/shared/reducers';
import { ORDERTYPE } from 'app/shared/model/enumerations/ordertype.model';
import { ACTIONTYPE } from 'app/shared/model/enumerations/actiontype.model';
import { createEntity } from 'app/entities/order/order.reducer';
import { IOrder } from 'app/shared/model/order.model';

export interface TradingProps extends StateProps, DispatchProps {}

const Trading = (props: TradingProps) => {
  const [volume, setVolume] = useState(1);
  const [orderType, setOrderType] = useState(ORDERTYPE.LIMIT);

  const { securityToken, account } = props;

  const handleVolumeChange = (value: string) => {
    setVolume(parseFloat(value));
  };

  const handleChange = (checked: boolean) => {
    if (checked) setOrderType(ORDERTYPE.MARKET);
    else setOrderType(ORDERTYPE.LIMIT);
  };

  const handleTrade = (type: ACTIONTYPE) => {
    const price = type === ACTIONTYPE.BUY ? securityToken.lastBuyingPrice : securityToken.lastSellingprice;
    const totalAmount = price * volume;

    if (isNaN(totalAmount)) {
      alert('Please set a correct volume value!');
      return;
    }

    const entity: IOrder = {
      type,
      volume,
      price,
      totalAmount,
      active: false,
      securityTokenName: securityToken.name,
      symbol: securityToken.symbol,
      limitOrMarket: orderType,
      user: { id: account.id },
      securityToken: { id: securityToken.id }
    };

    props.createEntity(entity);
  };

  return (
    <Row className="px-3">
      <Modal>
        <h1>Hello</h1>
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
        <Col>
          <FormGroup>
            <Label>Volume</Label>
            <Input type="number" value={volume} onChange={({ target }) => handleVolumeChange(target.value)} />
          </FormGroup>
        </Col>
        <Col className="d-flex align-items-center justify-content-center">
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
    </Row>
  );
};

const mapStateToProps = ({ securityToken, authentication }: IRootState) => ({
  securityToken: securityToken.entity,
  account: authentication.account
});

const mapDispatchToProps = { createEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Trading);
