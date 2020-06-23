import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label, Card } from 'reactstrap';
import { AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { getEntities as getSecurityTokens } from 'app/entities/security-token/security-token.reducer';
import { getEntity, updateEntity, createEntity, suggestUsers, suggestSecurityTokens, reset } from './white-listing.reducer';
import { AutoComplete } from 'app/shared/components/AutoComplete';
import { IUser } from 'app/shared/model/user.model';
import { ISecurityToken } from 'app/shared/model/security-token.model';
import { A11yStatusMessageOptions } from 'downshift';

export interface IWhiteListingUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const WhiteListingUpdate = (props: IWhiteListingUpdateProps) => {
  const { whiteListingEntity, loading, suggestedUsers, suggestedSecurityTokens } = props;
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);
  const [user, setUser] = useState<IUser>({});
  const [securityToken, setSecurityToken] = useState<ISecurityToken>({});

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }
  }, []);

  useEffect(() => {
    if (!isNew) {
      setUser(whiteListingEntity.user);
      setSecurityToken(whiteListingEntity.securitytoken);
    }
  }, [whiteListingEntity]);

  const handleClose = () => {
    props.history.push('/white-listing' + props.location.search);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const handleSelectUser = (login: { [value: string]: string }) => {
    const selectedUser = suggestedUsers.find((suggestedUser: IUser) => suggestedUser.login === login.value);

    setUser(selectedUser);
  };

  const handleSelectSecurityToken = (idRed: { [value: string]: string }) => {
    const selectedSecurityToken = suggestedSecurityTokens.find((st: ISecurityToken) => st.idRed === idRed.value);

    setSecurityToken(selectedSecurityToken);
  };

  const handleStatusChange = ({ selectedItem, inputValue }) => {};

  const saveEntity = (event, errors, values) => {
    if (user.id && securityToken.id) {
      const entity = {
        ...whiteListingEntity,
        user: { id: +user.id },
        securitytoken: securityToken,
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
          {loading && !isNew ? (
            <p>Loading...</p>
          ) : (
            <AvForm onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="white-listing-id">ID</Label>
                  <AvInput
                    id="white-listing-id"
                    type="text"
                    className="form-control"
                    name="id"
                    value={whiteListingEntity.id}
                    required
                    readOnly
                  />
                </AvGroup>
              ) : null}
              <Row>
                <AvGroup className="col-md-6">
                  <Label for="white-listing-user">User</Label>
                  <AutoComplete
                    initialValue={whiteListingEntity?.user?.login}
                    initialItem={{ value: user?.login }}
                    items={suggestedUsers.map((usr: IUser) => ({ value: usr.login }))}
                    selectItem={handleSelectUser}
                    suggestItems={value => props.suggestUsers(value, securityToken.id)}
                    status={handleStatusChange}
                  />
                </AvGroup>
                <AvGroup className="col-md-6">
                  <Label for="white-listing-securitytoken">Security token</Label>
                  <AutoComplete
                    initialItem={{ value: securityToken?.idRed }}
                    initialValue={whiteListingEntity?.securitytoken?.idRed}
                    items={suggestedSecurityTokens.map((st: ISecurityToken) => ({ value: st.idRed }))}
                    selectItem={handleSelectSecurityToken}
                    suggestItems={value => props.suggestSecurityTokens(value, user.id)}
                    status={handleStatusChange}
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
              <Button color="primary" id="save-entity" type="submit">
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
  updateSuccess: storeState.whiteListing.updateSuccess,
  suggestedUsers: storeState.whiteListing.suggestedUsers,
  suggestedSecurityTokens: storeState.whiteListing.suggestedSecurityTokens
});

const mapDispatchToProps = {
  getUsers,
  getSecurityTokens,
  getEntity,
  updateEntity,
  createEntity,
  suggestUsers,
  suggestSecurityTokens,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(WhiteListingUpdate);
