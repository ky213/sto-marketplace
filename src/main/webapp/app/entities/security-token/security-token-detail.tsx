import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Row } from 'reactstrap';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './security-token.reducer';
import { Info } from './components';

export interface ISecurityTokenDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const SecurityTokenDetail = (props: ISecurityTokenDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  return (
    <Row className="mx-auto">
      <Info {...props.securityTokenEntity} />
    </Row>
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
