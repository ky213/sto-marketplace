import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IUser } from 'app/shared/model/user.model';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { getEntity, updateEntity, createEntity, reset } from './home-bank.reducer';
import { IHomeBank } from 'app/shared/model/home-bank.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IHomeBankUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const HomeBankUpdate = (props: IHomeBankUpdateProps) => {
  const [userId, setUserId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { homeBankEntity, users, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/home-bank' + props.location.search);
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
    values.dateEvent = convertDateTimeToServer(values.dateEvent);

    if (errors.length === 0) {
      const entity = {
        ...homeBankEntity,
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
          <h2 id="exchangeApp.homeBank.home.createOrEditLabel">Create or edit a HomeBank</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : homeBankEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="home-bank-id">ID</Label>
                  <AvInput id="home-bank-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="dateEventLabel" for="home-bank-dateEvent">
                  Date Event
                </Label>
                <AvInput
                  id="home-bank-dateEvent"
                  type="datetime-local"
                  className="form-control"
                  name="dateEvent"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.homeBankEntity.dateEvent)}
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="custodyBalanceLabel" for="home-bank-custodyBalance">
                  Custody Balance
                </Label>
                <AvField
                  id="home-bank-custodyBalance"
                  type="string"
                  className="form-control"
                  name="custodyBalance"
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                    number: { value: true, errorMessage: 'This field should be a number.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="totalUserLabel" for="home-bank-totalUser">
                  Total User
                </Label>
                <AvField
                  id="home-bank-totalUser"
                  type="string"
                  className="form-control"
                  name="totalUser"
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                    number: { value: true, errorMessage: 'This field should be a number.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="volumeOrderLabel" for="home-bank-volumeOrder">
                  Volume Order
                </Label>
                <AvField id="home-bank-volumeOrder" type="string" className="form-control" name="volumeOrder" />
              </AvGroup>
              <AvGroup>
                <Label id="totalRevenuLabel" for="home-bank-totalRevenu">
                  Total Revenu
                </Label>
                <AvField id="home-bank-totalRevenu" type="string" className="form-control" name="totalRevenu" />
              </AvGroup>
              <AvGroup>
                <Label id="equityAllocationLabel" for="home-bank-equityAllocation">
                  Equity Allocation
                </Label>
                <AvField id="home-bank-equityAllocation" type="string" className="form-control" name="equityAllocation" />
              </AvGroup>
              <AvGroup>
                <Label id="fundsAllocationLabel" for="home-bank-fundsAllocation">
                  Funds Allocation
                </Label>
                <AvField id="home-bank-fundsAllocation" type="string" className="form-control" name="fundsAllocation" />
              </AvGroup>
              <AvGroup>
                <Label id="realEstateAllocationLabel" for="home-bank-realEstateAllocation">
                  Real Estate Allocation
                </Label>
                <AvField id="home-bank-realEstateAllocation" type="string" className="form-control" name="realEstateAllocation" />
              </AvGroup>
              <AvGroup>
                <Label id="derivativeAllocationLabel" for="home-bank-derivativeAllocation">
                  Derivative Allocation
                </Label>
                <AvField id="home-bank-derivativeAllocation" type="string" className="form-control" name="derivativeAllocation" />
              </AvGroup>
              <AvGroup>
                <Label for="home-bank-user">User</Label>
                <AvInput id="home-bank-user" type="select" className="form-control" name="user">
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
              <Button tag={Link} id="cancel-save" to="/home-bank" replace color="info">
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
  homeBankEntity: storeState.homeBank.entity,
  loading: storeState.homeBank.loading,
  updating: storeState.homeBank.updating,
  updateSuccess: storeState.homeBank.updateSuccess
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeBankUpdate);
