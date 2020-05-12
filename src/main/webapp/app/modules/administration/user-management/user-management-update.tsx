import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Label, Row, Col } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvField, AvFeedback } from 'availity-reactstrap-validation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';

import { getUser, getRoles, updateUser, createUser, reset } from './user-management.reducer';
import { IRootState } from 'app/shared/reducers';
import { convertDateTimeToServer } from 'app/shared/util/date-utils';
import SelectRole from './components/SelectRole';
import { AUTHORITIES } from 'app/config/constants';
import DatePicker from './components/DatePicker';

export interface IUserManagementUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ login: string }> {}

export const UserManagementUpdate = (props: IUserManagementUpdateProps) => {
  const { user, loading, updating } = props;
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.login);
  const [newRoles, setNewroles] = useState([]);
  const isInvalid = false;
  const isBank = newRoles.includes(AUTHORITIES.BANK);
  const isUser = newRoles.includes(AUTHORITIES.USER);

  useEffect(() => {
    setNewroles(user.authorities || []);
  }, [props]);

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getUser(props.match.params.login);
    }
    props.getRoles();
    return () => props.reset();
  }, []);

  const handleClose = () => {
    props.history.push('/admin/user-management');
  };

  const saveUser = (event, values) => {
    if (!values.setting) values.setting = {};

    values.authorities = newRoles;

    values.setting.dateOfBirth = convertDateTimeToServer(values.setting.dateOfBirth || moment().toDate());

    if (!isUser) values.setting.iban = 'xxxxxxxxxxxxxx';

    if (isNew) {
      props.createUser(values);
    } else {
      props.updateUser(values);
    }
    handleClose();
  };
  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h4>Create or edit a User</h4>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm onValidSubmit={saveUser}>
              {user.id ? (
                <AvGroup>
                  <Label for="id">ID</Label>
                  <AvField type="text" className="form-control" name="id" required readOnly value={user.id} />
                </AvGroup>
              ) : null}
              <SelectRole roles={user.authorities || []} reportRoles={(nr: string[]) => setNewroles(nr)} />
              <AvGroup>
                <Label for="login">Username</Label>
                <AvField
                  type="text"
                  className="form-control"
                  name="login"
                  validate={{
                    required: {
                      value: true,
                      errorMessage: 'Your username is required.'
                    },
                    pattern: {
                      value: '^[_.@A-Za-z0-9-]*$',
                      errorMessage: 'Your username can only contain letters and digits.'
                    },
                    minLength: {
                      value: 1,
                      errorMessage: 'Your username is required to be at least 1 character.'
                    },
                    maxLength: {
                      value: 50,
                      errorMessage: 'Your username cannot be longer than 50 characters.'
                    }
                  }}
                  value={user.login}
                />
              </AvGroup>
              <div className="form-row">
                <AvGroup className="col-md-6">
                  <Label for="firstName">First Name</Label>
                  <AvField
                    type="text"
                    className="form-control"
                    name="firstName"
                    validate={{
                      maxLength: {
                        value: 50,
                        errorMessage: 'This field cannot be longer than 50 characters.'
                      }
                    }}
                    value={user.firstName}
                  />
                </AvGroup>
                <AvGroup className="col-md-6">
                  <Label for="lastName">Last Name</Label>
                  <AvField
                    type="text"
                    className="form-control"
                    name="lastName"
                    validate={{
                      maxLength: {
                        value: 50,
                        errorMessage: 'This field cannot be longer than 50 characters.'
                      }
                    }}
                    value={user.lastName}
                  />
                  <AvFeedback>This field cannot be longer than 50 characters.</AvFeedback>
                </AvGroup>
              </div>
              <div className="form-row">
                <AvGroup className="col">
                  <AvField
                    name="email"
                    label="Email"
                    placeholder={'Your email'}
                    type="email"
                    validate={{
                      required: {
                        value: true,
                        errorMessage: 'Your email is required.'
                      },
                      email: {
                        errorMessage: 'Your email is invalid.'
                      },
                      minLength: {
                        value: 5,
                        errorMessage: 'Your email is required to be at least 5 characters.'
                      },
                      maxLength: {
                        value: 254,
                        errorMessage: 'Your email cannot be longer than 50 characters.'
                      }
                    }}
                    value={user.email}
                  />
                </AvGroup>
                {(isBank || isUser) && (
                  <AvGroup className="col-md-6">
                    <Label id="phoneNumberLabel" for="user-setting-phoneNumber">
                      Phone Number
                    </Label>
                    <AvField
                      id="user-setting-phoneNumber"
                      type="text"
                      name="setting.phoneNumber"
                      value={user.setting?.phoneNumber}
                      validate={{
                        required: {
                          value: true,
                          errorMessage: 'This field is required.'
                        },
                        minLength: { value: 6, errorMessage: 'This field is required to be at least 6 characters.' },
                        maxLength: { value: 15, errorMessage: 'This field cannot be longer than 15 characters.' }
                      }}
                    />
                  </AvGroup>
                )}
              </div>
              <div className="form-row">
                {isUser && (
                  <>
                    <AvGroup className="col-md-6">
                      <Label id="dateOfBirthLabel" for="user-setting-dateOfBirth">
                        Date Of Birth
                      </Label>
                      <DatePicker value={isNew ? moment().format('YYYY-MM-DD') : moment(user.setting?.dateOfBirth).format('YYYY-MM-DD')} />
                    </AvGroup>
                    <AvGroup className="col-md-6">
                      <Label id="nationalityLabel" for="user-setting-nationality">
                        Nationality
                      </Label>
                      <AvInput
                        id="user-setting-nationality"
                        type="select"
                        className="form-control"
                        name="setting.nationality"
                        value={(!isNew && user.setting?.nationality) || 'FRANCE'}
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
                  </>
                )}
              </div>
              <div className="form-row">
                {isUser && (
                  <>
                    <AvGroup className="col-md-8">
                      <Label id="addressLabel" for="user-setting-address">
                        Address
                      </Label>
                      <AvField
                        id="user-setting-address"
                        type="text"
                        name="setting.address"
                        value={user.setting?.address}
                        validate={{
                          required: {
                            value: true,
                            errorMessage: 'This field is required.'
                          },
                          minLength: { value: 2, errorMessage: 'This field is required to be at least 2 characters.' },
                          maxLength: { value: 50, errorMessage: 'This field cannot be longer than 50 characters.' }
                        }}
                      />
                    </AvGroup>
                    <AvGroup className="col-md-4">
                      <Label id="codeLabel" for="user-setting-code">
                        Postal Code
                      </Label>
                      <AvField
                        id="user-setting-code"
                        type="text"
                        name="setting.code"
                        value={user.setting?.code}
                        validate={{
                          required: {
                            value: true,
                            errorMessage: 'This field is required.'
                          },
                          minLength: { value: 2, errorMessage: 'This field is required to be at least 2 characters.' },
                          maxLength: { value: 50, errorMessage: 'This field cannot be longer than 50 characters.' }
                        }}
                      />
                    </AvGroup>
                  </>
                )}
              </div>
              <div className="form-row">
                {(isBank || isUser) && (
                  <>
                    <AvGroup className="col-md-6">
                      <Label id="cityLabel" for="user-setting-city">
                        City
                      </Label>
                      <AvField
                        id="user-setting-city"
                        type="text"
                        name="setting.city"
                        value={user.setting?.city}
                        validate={{
                          required: {
                            value: true,
                            errorMessage: 'This field is required.'
                          },
                          minLength: { value: 2, errorMessage: 'This field is required to be at least 2 characters.' },
                          maxLength: { value: 50, errorMessage: 'This field cannot be longer than 50 characters.' }
                        }}
                      />
                    </AvGroup>
                    <AvGroup className="col-md-6">
                      <Label id="countryLabel" for="user-setting-country">
                        Country
                      </Label>
                      <AvInput
                        id="user-setting-country"
                        type="select"
                        className="form-control"
                        name="setting.country"
                        value={(!isNew && user.setting?.country) || 'FRANCE'}
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
                  </>
                )}
              </div>
              {isBank && (
                <AvGroup>
                  <Label id="cityLabel" for="user-setting-position">
                    Position
                  </Label>
                  <AvField
                    id="user-setting-position"
                    type="text"
                    name="setting.position"
                    value={user.setting?.position}
                    validate={{
                      required: {
                        value: true,
                        errorMessage: 'This field is required.'
                      },
                      minLength: { value: 2, errorMessage: 'This field is required to be at least 2 characters.' },
                      maxLength: { value: 50, errorMessage: 'This field cannot be longer than 50 characters.' }
                    }}
                  />
                </AvGroup>
              )}
              {isUser && (
                <>
                  <AvGroup>
                    <Label id="ibanLabel" for="user-setting-iban">
                      Bank Account
                    </Label>
                    <AvField
                      id="user-setting-iban"
                      type="text"
                      name="setting.iban"
                      value={user.setting?.iban}
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
                      name="setting.ethAddress"
                      value={user.setting?.ethAddress}
                      validate={{
                        required: {
                          value: true,
                          errorMessage: 'This field is required.'
                        },
                        minLength: { value: 40, errorMessage: 'This field is required to be at least 40 characters.' },
                        maxLength: { value: 42, errorMessage: 'This field cannot be longer than 42 characters.' }
                      }}
                    />
                  </AvGroup>
                  <AvGroup>
                    <AvField
                      id="user-setting-riskProfil"
                      type="select"
                      name="setting.riskProfil"
                      label="Risk Profile"
                      value={user.setting?.riskProfil || 0}
                      required
                      errorMessage="This field is required"
                    >
                      <option>0</option>
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                    </AvField>
                  </AvGroup>
                </>
              )}
              <AvGroup check>
                <Label>
                  <AvInput type="checkbox" name="activated" value={user.activated} checked={user.activated} disabled={!user.id} /> Activated
                </Label>
              </AvGroup>
              <Button tag={Link} to="/admin/user-management" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">Back</span>
              </Button>
              &nbsp;
              <Button color="primary" type="submit" disabled={isInvalid || updating}>
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
  user: storeState.userManagement.user,
  roles: storeState.userManagement.authorities,
  loading: storeState.userManagement.loading,
  updating: storeState.userManagement.updating
});

const mapDispatchToProps = { getUser, getRoles, updateUser, createUser, reset };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserManagementUpdate);
