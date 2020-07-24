import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import Switch from 'react-switch';

import { updateEntity } from '../../security-token.reducer';
import { ISecurityToken } from 'app/shared/model/security-token.model';
import { STSTATUS } from 'app/shared/model/enumerations/ststatus.model';
import { IRootState } from 'app/shared/reducers';
import { AUTHORITIES } from 'app/config/constants';

export interface HeaderProps extends StateProps, DispatchProps, ISecurityToken {}

const Header = (props: HeaderProps) => {
  const { name, status, logo, logoContentType, account } = props;

  const isAdmin = account.authorities.includes(AUTHORITIES.ADMIN);
  const isBank = account.authorities.includes(AUTHORITIES.BANK);

  const handleChange = (checked: boolean) => {
    let newStatus: STSTATUS;

    if (checked) newStatus = STSTATUS.ACTIVE;
    else newStatus = STSTATUS.DISABLED;

    props.updateEntity({ ...props.securityTokenEntity, status: newStatus });
  };

  return (
    <>
      <Col>
        <Row>
          <Col className="col-1">
            <img src={`data:${logoContentType};base64,${logo}`} style={{ maxHeight: '50px' }} />
          </Col>
          <Col className="pl-4">
            <small className="text-muted">Details</small>
            <p>{name}</p>
          </Col>
        </Row>
      </Col>
      <Col className="text-right">
        {(isAdmin || isBank) && (
          <Row className="justify-content-center align-items-center">
            <Col className="pr-0 mr-0">
              <h3>Active </h3>
            </Col>
            <Col className="col-2 text-left">
              <Switch onChange={handleChange} checked={status === STSTATUS.ACTIVE} />
            </Col>
          </Row>
        )}
      </Col>
    </>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  securityTokenEntity: storeState.securityToken.entity,
  account: storeState.authentication.account
});

const mapDispatchToProps = {
  updateEntity
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Header);
