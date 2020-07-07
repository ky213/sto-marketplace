import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Row, Col } from 'reactstrap';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './security-token.reducer';
import { Info, WhiteList } from './components';

export interface ISecurityTokenDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const SecurityTokenDetail = (props: ISecurityTokenDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  return (
    <div>
      <Row>
        <Col md="4">
          <WhiteList />
        </Col>
        <Col md="8">
          <Info {...props.securityTokenEntity} />
        </Col>
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
