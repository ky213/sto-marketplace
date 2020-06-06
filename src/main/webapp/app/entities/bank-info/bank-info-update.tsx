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
  const { bank, loading, updating, match } = props;

  const handleClose = () => {
    if (bank && bank.id) props.history.replace(`/bank-info/${bank.id}/edit`);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(match.params.id);
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
        ...bank,
        ...values
      };

      if (bank && bank.id) {
        props.updateEntity(entity);
      } else {
        props.createEntity(entity);
      }
    }
  };

  return (
    <div>
      <Row className="mx-auto">
        <Col className="p-0 ml-2">
          <Card className="p-0">
            <CardHeader>
              <h6 className="p-0 m-0">Profile</h6>
              <small className="text-muted p-0 m-0">The information can be edited</small>
            </CardHeader>
            <CardBody>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <AvForm model={bank} onSubmit={saveEntity}>
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
                  <div className="form-row">
                    <AvGroup className="col-md-6">
                      <Label id="bicNumberLabel" for="bank-info-bicNumber">
                        Bic Number
                      </Label>
                      <AvField
                        id="bank-info-bicNumber"
                        type="text"
                        name="bicNumber"
                        validate={{
                          required: { value: true, errorMessage: 'This field is required.' },
                          minLength: { value: 10, errorMessage: 'This field is required to be at least 10 characters.' },
                          maxLength: { value: 12, errorMessage: 'This field cannot be longer than 12 characters.' }
                        }}
                      />
                    </AvGroup>
                    <AvGroup className="col-md-6">
                      <Label id="countryLabel" for="bank-info-country">
                        Country
                      </Label>
                      <AvInput
                        id="bank-info-country"
                        type="select"
                        className="form-control"
                        name="country"
                        value={(!isNew && bank.country) || 'FRANCE'}
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
                  </div>
                  <AvGroup>
                    <Label id="omnibusAccountLabel" for="bank-info-omnibusAccount">
                      Omnibus Account
                    </Label>
                    <AvField
                      id="bank-info-omnibusAccount"
                      type="text"
                      name="omnibusAccount"
                      validate={{
                        required: { value: true, errorMessage: 'This field is required.' },
                        minLength: { value: 14, errorMessage: 'This field is required to be at least 14 characters.' },
                        maxLength: { value: 35, errorMessage: 'This field cannot be longer than 35 characters.' }
                      }}
                    />
                  </AvGroup>
                  <div className="form-row">
                    <AvGroup className="col-md-6">
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
                    <AvGroup className="col-md-6">
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
                  </div>
                  <AvGroup>
                    <AvGroup>
                      <Label id="logoLabel" for="logo">
                        Logo
                      </Label>
                      <br />
                      {bank?.logo ? (
                        <div>
                          <a onClick={openFile(bank?.logoContentType, bank?.logo)}>
                            <img src={`data:${bank?.logoContentType};base64,${bank?.logo}`} style={{ maxHeight: '100px' }} />
                          </a>

                          <br />
                          <Row>
                            <Col>
                              <span>
                                {bank?.logoContentType}, {byteSize(bank?.logo)}
                              </span>
                              <span className="ml-4">
                                <Button color="danger" onClick={clearBlob('logo')}>
                                  <FontAwesomeIcon icon="times-circle" />
                                </Button>
                              </span>
                            </Col>
                          </Row>
                        </div>
                      ) : null}
                      <input id="file_logo" type="file" onChange={onBlobChange(true, 'logo')} accept="image/*" />
                      <AvInput type="hidden" name="logo" value={bank?.logo} />
                    </AvGroup>
                  </AvGroup>
                  &nbsp;
                  <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                    <FontAwesomeIcon icon="save" />
                    &nbsp; Save Details
                  </Button>
                </AvForm>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  bank: storeState.bankInfo.entity,
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
