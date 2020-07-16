import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { getEntity, updateEntity, createEntity, reset } from './home-customer.reducer';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';

export interface IHomeCustomerUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const HomeCustomerUpdate = (props: IHomeCustomerUpdateProps) => {
  const [userId, setUserId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { homeCustomerEntity, users, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/home-customer' + props.location.search);
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
        ...homeCustomerEntity,
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
          <h2 id="exchangeApp.homeCustomer.home.createOrEditLabel">Create or edit a HomeCustomer</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : homeCustomerEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="home-customer-id">ID</Label>
                  <AvInput id="home-customer-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="dateEventLabel" for="home-customer-dateEvent">
                  Date Event
                </Label>
                <AvInput
                  id="home-customer-dateEvent"
                  type="datetime-local"
                  className="form-control"
                  name="dateEvent"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.homeCustomerEntity.dateEvent)}
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="tokenBalanceLabel" for="home-customer-tokenBalance">
                  Token Balance
                </Label>
                <AvField
                  id="home-customer-tokenBalance"
                  type="string"
                  className="form-control"
                  name="tokenBalance"
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                    number: { value: true, errorMessage: 'This field should be a number.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="bigestTokenNameLabel" for="home-customer-bigestTokenName">
                  Bigest Token Name
                </Label>
                <AvField id="home-customer-bigestTokenName" type="text" name="bigestTokenName" />
              </AvGroup>
              <AvGroup>
                <Label id="bigestTokenValueLabel" for="home-customer-bigestTokenValue">
                  Bigest Token Value
                </Label>
                <AvField id="home-customer-bigestTokenValue" type="string" className="form-control" name="bigestTokenValue" />
              </AvGroup>
              <AvGroup>
                <Label id="secondTokenNameLabel" for="home-customer-secondTokenName">
                  Second Token Name
                </Label>
                <AvField id="home-customer-secondTokenName" type="text" name="secondTokenName" />
              </AvGroup>
              <AvGroup>
                <Label id="secondTokenValueLabel" for="home-customer-secondTokenValue">
                  Second Token Value
                </Label>
                <AvField id="home-customer-secondTokenValue" type="string" className="form-control" name="secondTokenValue" />
              </AvGroup>
              <AvGroup>
                <Label id="bankBalanceLabel" for="home-customer-bankBalance">
                  Bank Balance
                </Label>
                <AvField
                  id="home-customer-bankBalance"
                  type="string"
                  className="form-control"
                  name="bankBalance"
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                    number: { value: true, errorMessage: 'This field should be a number.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="equityAllocationLabel" for="home-customer-equityAllocation">
                  Equity Allocation
                </Label>
                <AvField id="home-customer-equityAllocation" type="string" className="form-control" name="equityAllocation" />
              </AvGroup>
              <AvGroup>
                <Label id="fundsAllocationLabel" for="home-customer-fundsAllocation">
                  Funds Allocation
                </Label>
                <AvField id="home-customer-fundsAllocation" type="string" className="form-control" name="fundsAllocation" />
              </AvGroup>
              <AvGroup>
                <Label id="realEstateAllocationLabel" for="home-customer-realEstateAllocation">
                  Real Estate Allocation
                </Label>
                <AvField id="home-customer-realEstateAllocation" type="string" className="form-control" name="realEstateAllocation" />
              </AvGroup>
              <AvGroup>
                <Label id="derivativeAllocationLabel" for="home-customer-derivativeAllocation">
                  Derivative Allocation
                </Label>
                <AvField id="home-customer-derivativeAllocation" type="string" className="form-control" name="derivativeAllocation" />
              </AvGroup>
              <AvGroup>
                <Label for="home-customer-user">User</Label>
                <AvInput id="home-customer-user" type="select" className="form-control" name="user">
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
              <Button tag={Link} id="cancel-save" to="/home-customer" replace color="info">
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
  homeCustomerEntity: storeState.homeCustomer.entity,
  loading: storeState.homeCustomer.loading,
  updating: storeState.homeCustomer.updating,
  updateSuccess: storeState.homeCustomer.updateSuccess
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeCustomerUpdate);
