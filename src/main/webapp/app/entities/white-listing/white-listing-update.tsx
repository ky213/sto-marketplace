import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label, Card } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IUser } from 'app/shared/model/user.model';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { ISecurityToken } from 'app/shared/model/security-token.model';
import { getEntities as getSecurityTokens } from 'app/entities/security-token/security-token.reducer';
import { getEntity, updateEntity, createEntity, reset } from './white-listing.reducer';
import { IWhiteListing } from 'app/shared/model/white-listing.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IWhiteListingUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const WhiteListingUpdate = (props: IWhiteListingUpdateProps) => {
  const [userId, setUserId] = useState('0');
  const [securitytokenId, setSecuritytokenId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { whiteListingEntity, users, securityTokens, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/white-listing' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getUsers();
    props.getSecurityTokens();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    values.dateEvent = convertDateTimeToServer(values.dateEvent);
    values.dateSynchBlk = convertDateTimeToServer(values.dateSynchBlk);

    if (errors.length === 0) {
      const entity = {
        ...whiteListingEntity,
        user: { id: +values.user.id },
        securitytoken: { ...securityTokens.find(st => st.id === +values.securityToken.id) },
        active: values.active
      };

      if (isNew) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  return (
    <Card>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="exchangeApp.whiteListing.home.createOrEditLabel">Create or edit a WhiteListing</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : whiteListingEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="white-listing-id">ID</Label>
                  <AvInput id="white-listing-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              {/* <Row>
                <AvGroup className="col-md-6">
                  <Label id="statusLabel" for="white-listing-status">
                    Status
                  </Label>
                  <AvInput
                    id="white-listing-status"
                    type="select"
                    className="form-control"
                    name="status"
                    value={(!isNew && whiteListingEntity.status) || 'NONE'}
                  >
                    <option value="NONE">NONE</option>
                    <option value="INIT">INIT</option>
                    <option value="PENDING">PENDING</option>
                    <option value="SUCCESS">SUCCESS</option>
                    <option value="FAIL">FAIL</option>
                    <option value="REMOVE">REMOVE</option>
                  </AvInput>
                </AvGroup>
              </Row>
              <Row>
                <AvGroup className="col-md-6">
                  <Label id="dateEventLabel" for="white-listing-dateEvent">
                    Date Event
                  </Label>
                  <AvInput
                    id="white-listing-dateEvent"
                    type="datetime-local"
                    className="form-control"
                    name="dateEvent"
                    placeholder={'YYYY-MM-DD HH:mm'}
                    value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.whiteListingEntity.dateEvent)}
                    validate={{
                      required: { value: true, errorMessage: 'This field is required.' }
                    }}
                  />
                </AvGroup>
                <AvGroup className="col-md-6">
                  <Label id="dateSynchBlkLabel" for="white-listing-dateSynchBlk">
                    Date Synch Blk
                  </Label>
                  <AvInput
                    id="white-listing-dateSynchBlk"
                    type="datetime-local"
                    className="form-control"
                    name="dateSynchBlk"
                    placeholder={'YYYY-MM-DD HH:mm'}
                    value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.whiteListingEntity.dateSynchBlk)}
                  />
                </AvGroup>
              </Row>
              <Row>
                <AvGroup className="col-md-6">
                  <Label id="stNameLabel" for="white-listing-stName">
                    St Name
                  </Label>
                  <AvField
                    id="white-listing-stName"
                    type="text"
                    name="stName"
                    validate={{
                      required: { value: true, errorMessage: 'This field is required.' }
                    }}
                  />
                </AvGroup>
                <AvGroup className="col-md-6">
                  <Label id="ethAddressLabel" for="white-listing-ethAddress">
                    Eth Address
                  </Label>
                  <AvField id="white-listing-ethAddress" type="text" name="ethAddress" />
                </AvGroup>
              </Row>
              <Row>
                <AvGroup className="col-md-6">
                  <Label id="customerNameLabel" for="white-listing-customerName">
                    Customer Name
                  </Label>
                  <AvField
                    id="white-listing-customerName"
                    type="text"
                    name="customerName"
                    validate={{
                      required: { value: true, errorMessage: 'This field is required.' }
                    }}
                  />
                </AvGroup>
                <AvGroup className="col-md-6">
                  <Label id="balanceLabel" for="white-listing-balance">
                    Balance
                  </Label>
                  <AvField id="white-listing-balance" type="string" className="form-control" name="balance" />
                </AvGroup>
              </Row> */}
              <Row>
                <AvGroup className="col-md-6">
                  <Label for="white-listing-user">User</Label>
                  <AvInput
                    value={whiteListingEntity?.user?.id}
                    id="white-listing-user"
                    type="select"
                    className="form-control"
                    name="user.id"
                    validate={{
                      required: { value: true, errorMessage: 'This field is required.' }
                    }}
                  >
                    {users
                      ? users.map((otherEntity, index) => (
                          <option key={index} value={otherEntity.id}>
                            {otherEntity.id}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <AvGroup className="col-md-6">
                  <Label for="white-listing-securitytoken">Security token</Label>
                  <AvInput
                    value={whiteListingEntity?.securitytoken?.id}
                    id="white-listing-securitytoken"
                    type="select"
                    className="form-control"
                    name="securityToken.id"
                    validate={{
                      required: { value: true, errorMessage: 'This field is required.' }
                    }}
                  >
                    {securityTokens
                      ? securityTokens.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.id}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
              </Row>
              <Row>
                <AvGroup className="col-md-6  d-flex align-items-center mb-3" check>
                  <Label id="activeLabel" className="ml-4" for="white-listing-active" style={{ marginTop: '12px' }}>
                    Active
                  </Label>
                  <AvInput
                    id="white-listing-active"
                    type="checkbox"
                    className="form-check-input ml-1"
                    name="active"
                    value={whiteListingEntity.active}
                  />
                </AvGroup>
              </Row>
              <Button tag={Link} id="cancel-save" to="/white-listing" replace color="info">
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
    </Card>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  users: storeState.userManagement.users,
  securityTokens: storeState.securityToken.entities,
  whiteListingEntity: storeState.whiteListing.entity,
  loading: storeState.whiteListing.loading,
  updating: storeState.whiteListing.updating,
  updateSuccess: storeState.whiteListing.updateSuccess
});

const mapDispatchToProps = {
  getUsers,
  getSecurityTokens,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(WhiteListingUpdate);
