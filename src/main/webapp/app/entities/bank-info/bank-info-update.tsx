import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label, Card, CardHeader, CardBody, CardFooter, NavLink } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { ICrudGetAction, ICrudGetAllAction, setFileData, openFile, byteSize, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, setBlob, reset } from './bank-info.reducer';
import { IBankInfo } from 'app/shared/model/bank-info.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import moment from 'moment';

export interface IBankInfoUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const BankInfoUpdate = (props: IBankInfoUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { bankInfoEntity, loading, updating } = props;

  const { logo, logoContentType } = bankInfoEntity;

  const handleClose = () => {
    props.history.push('/bank-info' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }
  }, []);

  const onBlobChange = (isAnImage, name) => event => {
    setFileData(event, (contentType, data) => props.setBlob(name, data, contentType), isAnImage);
  };

  const clearBlob = name => () => {
    props.setBlob(name, undefined, undefined);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...bankInfoEntity,
        ...values
      };

      if (isNew) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  return (
    <div>
      <Row className="mx-auto">
        <Col md="4" className=" ml-3 p-0">
          <Card className="p-0">
            <CardBody className="p-3">
              <h4>{bankInfoEntity.bankName}</h4>
              <Row>
                <Col xs="6">
                  <p className="text-muted">
                    {bankInfoEntity.country} <br />
                    {moment().format('LLL')}
                  </p>
                </Col>
                <Col>
                  <img
                    className="bg-secondary d-block ml-auto"
                    src={`data:image/png;base64,${bankInfoEntity.logo}`}
                    alt="bank_logo"
                    style={{ height: '80px', width: '80px' }}
                  />
                </Col>
              </Row>
            </CardBody>
            <CardFooter>
              <NavLink to="#" className="p-1">
                Upload Picture
              </NavLink>
            </CardFooter>
          </Card>
        </Col>
        <Col className="p-0 ml-3">
          <Card className="p-0">
            <CardHeader></CardHeader>
            <CardBody>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <AvForm model={isNew ? {} : bankInfoEntity} onSubmit={saveEntity}>
                  {!isNew ? (
                    <AvGroup>
                      <Label for="bank-info-id">ID</Label>
                      <AvInput id="bank-info-id" type="text" className="form-control" name="id" required readOnly />
                    </AvGroup>
                  ) : null}
                  <AvGroup>
                    <Label id="bankNameLabel" for="bank-info-bankName">
                      Bank Name
                    </Label>
                    <AvField
                      id="bank-info-bankName"
                      type="text"
                      name="bankName"
                      validate={{
                        required: { value: true, errorMessage: 'This field is required.' }
                      }}
                    />
                  </AvGroup>
                  <AvGroup>
                    <AvGroup>
                      <Label id="logoLabel" for="logo">
                        Logo
                      </Label>
                      <br />
                      {logo ? (
                        <div>
                          <a onClick={openFile(logoContentType, logo)}>
                            <img src={`data:${logoContentType};base64,${logo}`} style={{ maxHeight: '100px' }} />
                          </a>
                          <br />
                          <Row>
                            <Col md="11">
                              <span>
                                {logoContentType}, {byteSize(logo)}
                              </span>
                            </Col>
                            <Col md="1">
                              <Button color="danger" onClick={clearBlob('logo')}>
                                <FontAwesomeIcon icon="times-circle" />
                              </Button>
                            </Col>
                          </Row>
                        </div>
                      ) : null}
                      <input id="file_logo" type="file" onChange={onBlobChange(true, 'logo')} accept="image/*" />
                      <AvInput type="hidden" name="logo" value={logo} />
                    </AvGroup>
                  </AvGroup>
                  <AvGroup>
                    <Label id="countryLabel" for="bank-info-country">
                      Country
                    </Label>
                    <AvInput
                      id="bank-info-country"
                      type="select"
                      className="form-control"
                      name="country"
                      value={(!isNew && bankInfoEntity.country) || 'FRANCE'}
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
                    <Label id="bicNumberLabel" for="bank-info-bicNumber">
                      Bic Number
                    </Label>
                    <AvField
                      id="bank-info-bicNumber"
                      type="text"
                      name="bicNumber"
                      validate={{
                        minLength: { value: 10, errorMessage: 'This field is required to be at least 10 characters.' },
                        maxLength: { value: 12, errorMessage: 'This field cannot be longer than 12 characters.' }
                      }}
                    />
                  </AvGroup>
                  <AvGroup>
                    <Label id="omnibusAccountLabel" for="bank-info-omnibusAccount">
                      Omnibus Account
                    </Label>
                    <AvField
                      id="bank-info-omnibusAccount"
                      type="text"
                      name="omnibusAccount"
                      validate={{
                        minLength: { value: 14, errorMessage: 'This field is required to be at least 14 characters.' },
                        maxLength: { value: 35, errorMessage: 'This field cannot be longer than 35 characters.' }
                      }}
                    />
                  </AvGroup>
                  <AvGroup>
                    <Label id="fixedFeeLabel" for="bank-info-fixedFee">
                      Fixed Fee
                    </Label>
                    <AvField
                      id="bank-info-fixedFee"
                      type="string"
                      className="form-control"
                      name="fixedFee"
                      validate={{
                        required: { value: true, errorMessage: 'This field is required.' },
                        min: { value: 0, errorMessage: 'This field should be at least 0.' },
                        number: { value: true, errorMessage: 'This field should be a number.' }
                      }}
                    />
                  </AvGroup>
                  <AvGroup>
                    <Label id="percentFeeLabel" for="bank-info-percentFee">
                      Percent Fee
                    </Label>
                    <AvField
                      id="bank-info-percentFee"
                      type="string"
                      className="form-control"
                      name="percentFee"
                      validate={{
                        required: { value: true, errorMessage: 'This field is required.' },
                        min: { value: 0, errorMessage: 'This field should be at least 0.' },
                        max: { value: 100, errorMessage: 'This field cannot be more than 100.' },
                        number: { value: true, errorMessage: 'This field should be a number.' }
                      }}
                    />
                  </AvGroup>
                  <Button tag={Link} id="cancel-save" to="/bank-info" replace color="info">
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
            </CardBody>
            <CardFooter></CardFooter>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  bankInfoEntity: storeState.bankInfo.entity,
  loading: storeState.bankInfo.loading,
  updating: storeState.bankInfo.updating,
  updateSuccess: storeState.bankInfo.updateSuccess
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  setBlob,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(BankInfoUpdate);
