import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Row, Col, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './security-token.reducer';
import { Info, OrdersChart, Header, Balance, OrderBook } from './components';
import WhiteList from './components/WhiteList';

export interface ISecurityTokenDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const SecurityTokenDetail = (props: ISecurityTokenDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  return (
    <div className="pb-3">
      <Row className="justify-content-between py-2 pr-3">
        <Header {...props.securityTokenEntity} />
      </Row>
      <Row>
        <OrdersChart securityTokenName={props.securityTokenEntity.name} />
        <Col>
          <Balance id={props.securityTokenEntity.id} />
          <OrderBook id={props.securityTokenEntity.id} />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col className="p-0">
          <WhiteList id={props.securityTokenEntity.id} />
        </Col>
        <Col md="8">
          <Info {...props.securityTokenEntity} />
        </Col>
      </Row>
      <Row className="mt-2">
        <Button tag={Link} to="/security-token" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
      </Row>
    </div>
  );
};

const mapStateToProps = ({ securityToken, authentication }: IRootState) => ({
  securityTokenEntity: securityToken.entity,
  account: authentication.account
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(SecurityTokenDetail);
