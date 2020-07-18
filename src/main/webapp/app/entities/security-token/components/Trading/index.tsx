import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Alert, Label, Input, FormGroup } from 'reactstrap';
import { IRootState } from 'app/shared/reducers';
import Switch from 'react-switch';

export interface TradingProps extends StateProps, DispatchProps {}

const Trading = (props: TradingProps) => {
  const { securityToken } = props;

  const handleChange = () => {};

  return (
    <Row className="px-3">
      <Row className="w-100">
        <Col>
          <Alert color="success" className="py-2 px-4" style={{ cursor: 'pointer' }}>
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
          <Alert color="danger" className="py-2 pl-4" style={{ cursor: 'pointer' }}>
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
            <Input type="text" />
          </FormGroup>
        </Col>
        <Col className="d-flex align-items-center justify-content-center">
          <h3 className="text-secondary">Limit </h3>
          <Switch onChange={handleChange} checked={true} className="mx-2 mb-1" />
          <h3> Market</h3>
        </Col>
      </Row>
    </Row>
  );
};

const mapStateToProps = ({ securityToken }: IRootState) => ({
  securityToken: securityToken.entity
});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Trading);
