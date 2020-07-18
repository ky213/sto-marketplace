import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card, CardTitle, CardBody } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

export interface TradingProps extends StateProps, DispatchProps {}

const Trading = (props: TradingProps) => {
  return <div className="mt-1">Trading</div>;
};

const mapStateToProps = ({ securityToken }: IRootState) => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Trading);
