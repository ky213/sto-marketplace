import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label, Card } from 'reactstrap';
import { AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { getEntities as getSecurityTokens } from 'app/entities/security-token/security-token.reducer';
import { getEntity, updateEntity, createEntity, reset } from './white-listing.reducer';
import { convertDateTimeToServer } from 'app/shared/util/date-utils';
import { AutoComplete } from 'app/shared/components/AutoComplete';

export interface IWhiteListingUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const WhiteListingUpdate = (props: IWhiteListingUpdateProps) => {
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
              <Row>
                <AvGroup className="col-md-6">
                  <Label for="white-listing-user">User</Label>
                  <AutoComplete
                    name="user.id"
                    value={whiteListingEntity?.user?.id}
                    items={[]}
                    selectItem={() => ''}
                    suggestItems={() => ''}
                  />
                </AvGroup>
                <AvGroup className="col-md-6">
                  <Label for="white-listing-securitytoken">Security token</Label>
                  <AutoComplete
                    name="user.id"
                    value={whiteListingEntity?.securitytoken?.id}
                    items={[]}
                    selectItem={() => ''}
                    suggestItems={() => ''}
                  />
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
