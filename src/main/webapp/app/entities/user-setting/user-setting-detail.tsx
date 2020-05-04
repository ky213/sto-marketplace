import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './user-setting.reducer';
import { IUserSetting } from 'app/shared/model/user-setting.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IUserSettingDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const UserSettingDetail = (props: IUserSettingDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { userSettingEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          UserSetting [<b>{userSettingEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="dateOfBirth">Date Of Birth</span>
          </dt>
          <dd>
            <TextFormat value={userSettingEntity.dateOfBirth} type="date" format={APP_DATE_FORMAT} />
          </dd>
          <dt>
            <span id="nationality">Nationality</span>
          </dt>
          <dd>{userSettingEntity.nationality}</dd>
          <dt>
            <span id="phoneNumber">Phone Number</span>
          </dt>
          <dd>{userSettingEntity.phoneNumber}</dd>
          <dt>
            <span id="position">Position</span>
          </dt>
          <dd>{userSettingEntity.position}</dd>
          <dt>
            <span id="address">Address</span>
          </dt>
          <dd>{userSettingEntity.address}</dd>
          <dt>
            <span id="code">Code</span>
          </dt>
          <dd>{userSettingEntity.code}</dd>
          <dt>
            <span id="city">City</span>
          </dt>
          <dd>{userSettingEntity.city}</dd>
          <dt>
            <span id="country">Country</span>
          </dt>
          <dd>{userSettingEntity.country}</dd>
          <dt>
            <span id="iban">Iban</span>
          </dt>
          <dd>{userSettingEntity.iban}</dd>
          <dt>
            <span id="ethAddress">Eth Address</span>
          </dt>
          <dd>{userSettingEntity.ethAddress}</dd>
          <dt>
            <span id="riskProfil">Risk Profil</span>
          </dt>
          <dd>{userSettingEntity.riskProfil}</dd>
          <dt>
            <span id="balance">Balance</span>
          </dt>
          <dd>{userSettingEntity.balance}</dd>
          <dt>User</dt>
          <dd>{userSettingEntity.id}</dd>
        </dl>
        <Button tag={Link} to="/user-setting" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/user-setting/${userSettingEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ userSetting }: IRootState) => ({
  userSettingEntity: userSetting.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserSettingDetail);
