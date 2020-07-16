import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { getEntity, updateEntity, createEntity, reset } from './user-setting.reducer';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';

export interface IUserSettingUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const UserSettingUpdate = (props: IUserSettingUpdateProps) => {
  const [userId, setUserId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { userSettingEntity, users, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/user-setting' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getUsers();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    values.dateOfBirth = convertDateTimeToServer(values.dateOfBirth);

    if (errors.length === 0) {
      const entity = {
        ...userSettingEntity,
        ...values
      };
      entity.user = users[values.user];

      if (isNew) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="exchangeApp.userSetting.home.createOrEditLabel">Create or edit a UserSetting</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : userSettingEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="user-setting-id">ID</Label>
                  <AvInput id="user-setting-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="dateOfBirthLabel" for="user-setting-dateOfBirth">
                  Date Of Birth
                </Label>
                <AvInput
                  id="user-setting-dateOfBirth"
                  type="datetime-local"
                  className="form-control"
                  name="dateOfBirth"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.userSettingEntity.dateOfBirth)}
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="nationalityLabel" for="user-setting-nationality">
                  Nationality
                </Label>
                <AvInput
                  id="user-setting-nationality"
                  type="select"
                  className="form-control"
                  name="nationality"
                  value={(!isNew && userSettingEntity.nationality) || 'FRANCE'}
                >
                  <option value="FRANCE">FRANCE</option>
                  <option value="USA">USA</option>
                  <option value="SWITZERLAND">SWITZERLAND</option>
                  <option value="GERMANY">GERMANY</option>
                  <option value="ITALY">ITALY</option>
                  <option value="IRAN">IRAN</option>
                  <option value="CHINA">CHINA</option>
                  <option value="NORTH_KOREA">NORTH_KOREA</option>
                  <option value="CANADA">CANADA</option>
                  <option value="SENEGAL">SENEGAL</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label id="phoneNumberLabel" for="user-setting-phoneNumber">
                  Phone Number
                </Label>
                <AvField
                  id="user-setting-phoneNumber"
                  type="text"
                  name="phoneNumber"
                  validate={{
                    minLength: { value: 6, errorMessage: 'This field is required to be at least 6 characters.' },
                    maxLength: { value: 15, errorMessage: 'This field cannot be longer than 15 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="positionLabel" for="user-setting-position">
                  Position
                </Label>
                <AvField
                  id="user-setting-position"
                  type="text"
                  name="position"
                  validate={{
                    minLength: { value: 2, errorMessage: 'This field is required to be at least 2 characters.' },
                    maxLength: { value: 50, errorMessage: 'This field cannot be longer than 50 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="addressLabel" for="user-setting-address">
                  Address
                </Label>
                <AvField id="user-setting-address" type="text" name="address" />
              </AvGroup>
              <AvGroup>
                <Label id="codeLabel" for="user-setting-code">
                  Code
                </Label>
                <AvField
                  id="user-setting-code"
                  type="text"
                  name="code"
                  validate={{
                    minLength: { value: 2, errorMessage: 'This field is required to be at least 2 characters.' },
                    maxLength: { value: 8, errorMessage: 'This field cannot be longer than 8 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="cityLabel" for="user-setting-city">
                  City
                </Label>
                <AvField
                  id="user-setting-city"
                  type="text"
                  name="city"
                  validate={{
                    minLength: { value: 2, errorMessage: 'This field is required to be at least 2 characters.' },
                    maxLength: { value: 50, errorMessage: 'This field cannot be longer than 50 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="countryLabel" for="user-setting-country">
                  Country
                </Label>
                <AvInput
                  id="user-setting-country"
                  type="select"
                  className="form-control"
                  name="country"
                  value={(!isNew && userSettingEntity.country) || 'FRANCE'}
                >
                  <option value="FRANCE">FRANCE</option>
                  <option value="USA">USA</option>
                  <option value="SWITZERLAND">SWITZERLAND</option>
                  <option value="GERMANY">GERMANY</option>
                  <option value="ITALY">ITALY</option>
                  <option value="IRAN">IRAN</option>
                  <option value="CHINA">CHINA</option>
                  <option value="NORTH_KOREA">NORTH_KOREA</option>
                  <option value="CANADA">CANADA</option>
                  <option value="SENEGAL">SENEGAL</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label id="ibanLabel" for="user-setting-iban">
                  Iban
                </Label>
                <AvField
                  id="user-setting-iban"
                  type="text"
                  name="iban"
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                    minLength: { value: 14, errorMessage: 'This field is required to be at least 14 characters.' },
                    maxLength: { value: 35, errorMessage: 'This field cannot be longer than 35 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="ethAddressLabel" for="user-setting-ethAddress">
                  Eth Address
                </Label>
                <AvField
                  id="user-setting-ethAddress"
                  type="text"
                  name="ethAddress"
                  validate={{
                    minLength: { value: 40, errorMessage: 'This field is required to be at least 40 characters.' },
                    maxLength: { value: 42, errorMessage: 'This field cannot be longer than 42 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="riskProfilLabel" for="user-setting-riskProfil">
                  Risk Profil
                </Label>
                <AvField
                  id="user-setting-riskProfil"
                  type="string"
                  className="form-control"
                  name="riskProfil"
                  validate={{
                    min: { value: 0, errorMessage: 'This field should be at least 0.' },
                    max: { value: 5, errorMessage: 'This field cannot be more than 5.' },
                    number: { value: true, errorMessage: 'This field should be a number.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="balanceLabel" for="user-setting-balance">
                  Balance
                </Label>
                <AvField id="user-setting-balance" type="string" className="form-control" name="balance" />
              </AvGroup>
              <AvGroup>
                <Label for="user-setting-user">User</Label>
                <AvInput id="user-setting-user" type="select" className="form-control" name="user">
                  <option value="" key="0" />
                  {users
                    ? users.map((otherEntity, index) => (
                        <option value={index} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/user-setting" replace color="info">
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
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  users: storeState.userManagement.users,
  userSettingEntity: storeState.userSetting.entity,
  loading: storeState.userSetting.loading,
  updating: storeState.userSetting.updating,
  updateSuccess: storeState.userSetting.updateSuccess
});

const mapDispatchToProps = {
  getUsers,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserSettingUpdate);
