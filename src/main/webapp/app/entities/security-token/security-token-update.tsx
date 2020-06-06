import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label, Card } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvField, AvRadioGroup, AvRadio } from 'availity-reactstrap-validation';
import { ICrudGetAction, ICrudGetAllAction, setFileData, openFile, byteSize, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, setBlob, reset } from './security-token.reducer';
import { ISecurityToken } from 'app/shared/model/security-token.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import './style.scss';

export interface ISecurityTokenUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const SecurityTokenUpdate = (props: ISecurityTokenUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { securityTokenEntity, loading, updating } = props;

  const { logo, logoContentType, prospectus, prospectusContentType } = securityTokenEntity;

  const handleClose = () => {
    props.history.push('/security-token' + props.location.search);
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
    values.laucheDate = convertDateTimeToServer(values.laucheDate);
    values.registrationDate = convertDateTimeToServer(values.registrationDate);
    values.updateDate = convertDateTimeToServer(values.updateDate);
    values.dueDiligenceDate = convertDateTimeToServer(values.dueDiligenceDate);

    if (errors.length === 0) {
      const entity = {
        ...securityTokenEntity,
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
    <Card className="p-3">
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="exchangeApp.securityToken.home.createOrEditLabel">Create or edit a SecurityToken</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : securityTokenEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="security-token-id">ID</Label>
                  <AvInput id="security-token-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="categoryLabel" for="security-token-category">
                  Category
                </Label>
                <AvRadioGroup
                  name="category"
                  required
                  errorMessage="This field is required!"
                  value={(!isNew && securityTokenEntity.category) || 'EQUITY'}
                >
                  <Row className="mb-2 px-3">
                    <AvRadio label="EQUITY" value="EQUITY" />
                    <AvRadio label="FUNDS" value="FUNDS" />
                  </Row>
                  <Row className="px-3">
                    <AvRadio label="REAL ESTATE" value="REAL_ESTATE" />
                    <AvRadio label="DERIVATIVE" value="DERIVATIVE" />
                  </Row>
                </AvRadioGroup>
              </AvGroup>
              <Row>
                <AvGroup className="col-md-6">
                  <Label id="nameLabel" for="security-token-name">
                    Name
                  </Label>
                  <AvField
                    id="security-token-name"
                    type="text"
                    name="name"
                    validate={{
                      required: { value: true, errorMessage: 'This field is required.' },
                      minLength: { value: 2, errorMessage: 'This field is required to be at least 2 characters.' },
                      maxLength: { value: 50, errorMessage: 'This field cannot be longer than 50 characters.' }
                    }}
                  />
                </AvGroup>
                <AvGroup className="col-md-6">
                  <Label id="idRedLabel" for="security-token-idRed">
                    Id Red
                  </Label>
                  <AvField
                    id="security-token-idRed"
                    type="text"
                    name="idRed"
                    validate={{
                      minLength: { value: 2, errorMessage: 'This field is required to be at least 2 characters.' },
                      maxLength: { value: 15, errorMessage: 'This field cannot be longer than 15 characters.' }
                    }}
                  />
                </AvGroup>
              </Row>
              <Row>
                <AvGroup className="col-md-6">
                  <Label id="symbolLabel" for="security-token-symbol">
                    Symbol
                  </Label>
                  <AvField
                    id="security-token-symbol"
                    type="text"
                    name="symbol"
                    validate={{
                      required: { value: true, errorMessage: 'This field is required.' }
                    }}
                  />
                </AvGroup>
                <AvGroup className="col-md-6">
                  <Label id="juridictionLabel" for="security-token-juridiction">
                    Juridiction
                  </Label>
                  <AvInput
                    id="security-token-juridiction"
                    type="select"
                    className="form-control"
                    name="juridiction"
                    value={(!isNew && securityTokenEntity.juridiction) || 'FRANCE'}
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
              </Row>
              <Row>
                <AvGroup className="col-md-6">
                  <Label id="issuerNameLabel" for="security-token-issuerName">
                    Issuer Name
                  </Label>
                  <AvField id="security-token-issuerName" type="text" name="issuerName" />
                </AvGroup>
                <AvGroup className="col-md-6">
                  <Label id="issuerCountyLabel" for="security-token-issuerCounty">
                    Issuer County
                  </Label>
                  <AvInput
                    id="security-token-issuerCounty"
                    type="select"
                    className="form-control"
                    name="issuerCounty"
                    value={(!isNew && securityTokenEntity.issuerCounty) || 'FRANCE'}
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
              </Row>
              <Row>
                <AvGroup className="col-md-6">
                  <Label id="tokenizationFirmNameLabel" for="security-token-tokenizationFirmName">
                    Tokenization Firm Name
                  </Label>
                  <AvField id="security-token-tokenizationFirmName" type="text" name="tokenizationFirmName" />
                </AvGroup>
                <AvGroup className="col-md-6">
                  <Label id="tokenizationFirmCountryLabel" for="security-token-tokenizationFirmCountry">
                    Tokenization Firm Country
                  </Label>
                  <AvInput
                    id="security-token-tokenizationFirmCountry"
                    type="select"
                    className="form-control"
                    name="tokenizationFirmCountry"
                    value={(!isNew && securityTokenEntity.tokenizationFirmCountry) || 'FRANCE'}
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
              </Row>
              <Row>
                <AvGroup className="col-md-6">
                  <Label id="kycProviderNameLabel" for="security-token-kycProviderName">
                    Kyc Provider Name
                  </Label>
                  <AvField id="security-token-kycProviderName" type="text" name="kycProviderName" />
                </AvGroup>
                <AvGroup className="col-md-6">
                  <Label id="kycProviderCountryLabel" for="security-token-kycProviderCountry">
                    Kyc Provider Country
                  </Label>
                  <AvInput
                    id="security-token-kycProviderCountry"
                    type="select"
                    className="form-control"
                    name="kycProviderCountry"
                    value={(!isNew && securityTokenEntity.kycProviderCountry) || 'FRANCE'}
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
              </Row>
              <AvGroup>
                <Label id="laucheDateLabel" for="security-token-laucheDate">
                  Lauche Date
                </Label>
                <AvInput
                  id="security-token-laucheDate"
                  type="datetime-local"
                  className="form-control"
                  name="laucheDate"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.securityTokenEntity.laucheDate)}
                />
              </AvGroup>
              <Row>
                <AvGroup className="col-md-6">
                  <Label id="stoPriceLabel" for="security-token-stoPrice">
                    Sto Price
                  </Label>
                  <AvField
                    id="security-token-stoPrice"
                    type="string"
                    className="form-control"
                    name="stoPrice"
                    validate={{
                      min: { value: 0, errorMessage: 'This field should be at least 0.' },
                      number: { value: true, errorMessage: 'This field should be a number.' }
                    }}
                  />
                </AvGroup>
                <AvGroup className="col-md-6">
                  <Label id="amountRaisedLabel" for="security-token-amountRaised">
                    Amount Raised
                  </Label>
                  <AvField
                    id="security-token-amountRaised"
                    type="string"
                    className="form-control"
                    name="amountRaised"
                    validate={{
                      min: { value: 0, errorMessage: 'This field should be at least 0.' },
                      number: { value: true, errorMessage: 'This field should be a number.' }
                    }}
                  />
                </AvGroup>
              </Row>
              <Row>
                <AvGroup className="col-md-6">
                  <Label id="restrictionCountyLabel" for="security-token-restrictionCounty">
                    Restriction County
                  </Label>
                  <AvField id="security-token-restrictionCounty" type="text" name="restrictionCounty" />
                </AvGroup>
                <AvGroup className="col-md-6">
                  <Label id="restrictionNationalityLabel" for="security-token-restrictionNationality">
                    Restriction Nationality
                  </Label>
                  <AvField id="security-token-restrictionNationality" type="text" name="restrictionNationality" />
                </AvGroup>
              </Row>
              <AvGroup>
                <Label id="statusLabel" for="security-token-status">
                  Status
                </Label>
                <AvInput
                  id="security-token-status"
                  type="select"
                  className="form-control"
                  name="status"
                  value={(!isNew && securityTokenEntity.status) || 'DRAFT'}
                >
                  <option value="DRAFT">DRAFT</option>
                  <option value="DISABLED">DISABLED</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="REMOVE">REMOVE</option>
                </AvInput>
              </AvGroup>
              <Row>
                <AvGroup className="col-md-6">
                  <Label id="registrationDateLabel" for="security-token-registrationDate">
                    Registration Date
                  </Label>
                  <AvInput
                    id="security-token-registrationDate"
                    type="datetime-local"
                    className="form-control"
                    name="registrationDate"
                    placeholder={'YYYY-MM-DD HH:mm'}
                    value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.securityTokenEntity.registrationDate)}
                  />
                </AvGroup>
                <AvGroup className="col-md-6">
                  <Label id="updateDateLabel" for="security-token-updateDate">
                    Update Date
                  </Label>
                  <AvInput
                    id="security-token-updateDate"
                    type="datetime-local"
                    className="form-control"
                    name="updateDate"
                    placeholder={'YYYY-MM-DD HH:mm'}
                    value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.securityTokenEntity.updateDate)}
                  />
                </AvGroup>
              </Row>
              <AvGroup>
                <Label id="dueDiligenceDateLabel" for="security-token-dueDiligenceDate">
                  Due Diligence Date
                </Label>
                <AvInput
                  id="security-token-dueDiligenceDate"
                  type="datetime-local"
                  className="form-control"
                  name="dueDiligenceDate"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.securityTokenEntity.dueDiligenceDate)}
                />
              </AvGroup>
              <Row>
                <AvGroup className="col-md-6">
                  <Label id="lastSellingpriceLabel" for="security-token-lastSellingprice">
                    Last Sellingprice
                  </Label>
                  <AvField
                    id="security-token-lastSellingprice"
                    type="string"
                    className="form-control"
                    name="lastSellingprice"
                    validate={{
                      min: { value: 0, errorMessage: 'This field should be at least 0.' },
                      number: { value: true, errorMessage: 'This field should be a number.' }
                    }}
                  />
                </AvGroup>
                <AvGroup className="col-md-6">
                  <Label id="lastBuyingPriceLabel" for="security-token-lastBuyingPrice">
                    Last Buying Price
                  </Label>
                  <AvField
                    id="security-token-lastBuyingPrice"
                    type="string"
                    className="form-control"
                    name="lastBuyingPrice"
                    validate={{
                      min: { value: 0, errorMessage: 'This field should be at least 0.' },
                      number: { value: true, errorMessage: 'This field should be a number.' }
                    }}
                  />
                </AvGroup>
              </Row>
              <Row>
                <AvGroup className="col-md-6">
                  <Label id="smartcontractAddressLabel" for="security-token-smartcontractAddress">
                    Smartcontract Address
                  </Label>
                  <AvField id="security-token-smartcontractAddress" type="text" name="smartcontractAddress" />
                </AvGroup>
                <AvGroup className="col-md-6">
                  <Label id="kycAddressLabel" for="security-token-kycAddress">
                    Kyc Address
                  </Label>
                  <AvField id="security-token-kycAddress" type="text" name="kycAddress" />
                </AvGroup>
              </Row>
              <AvGroup>
                <Label id="websiteLabel" for="security-token-website">
                  Website
                </Label>
                <AvField id="security-token-website" type="text" name="website" />
              </AvGroup>
              <Row>
                <AvGroup className="col-md-6">
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
                          <Col>
                            <span>
                              {logoContentType}, {byteSize(logo)}
                            </span>
                          </Col>
                          <Col>
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
                <AvGroup className="col-md-6">
                  <AvGroup>
                    <Label id="prospectusLabel" for="prospectus">
                      Prospectus
                    </Label>
                    <br />
                    {prospectus ? (
                      <div>
                        <a onClick={openFile(prospectusContentType, prospectus)}>
                          <img src={`data:${prospectusContentType};base64,${prospectus}`} style={{ maxHeight: '100px' }} />
                        </a>
                        <br />
                        <Row>
                          <Col>
                            <span>
                              {prospectusContentType}, {byteSize(prospectus)}
                            </span>
                          </Col>
                          <Col>
                            <Button color="danger" onClick={clearBlob('prospectus')}>
                              <FontAwesomeIcon icon="times-circle" />
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    ) : null}
                    <input id="file_prospectus" type="file" onChange={onBlobChange(false, 'prospectus')} />
                    <AvInput type="hidden" name="prospectus" value={prospectus} />
                  </AvGroup>
                </AvGroup>
              </Row>
              <Row>
                <AvGroup className="col">
                  <Label id="summaryLabel" for="security-token-summary">
                    Summary
                  </Label>
                  <AvField
                    id="security-token-summary"
                    type="textarea"
                    rows="10"
                    name="summary"
                    validate={{
                      required: { value: true, errorMessage: 'This field is required.' },
                      maxLength: { value: 1024, errorMessage: 'This field cannot be longer than 1024 characters.' }
                    }}
                  />
                </AvGroup>
              </Row>
              <Row>
                <AvGroup className="col">
                  <Label id="descriptionLabel" for="security-token-description">
                    Description
                  </Label>
                  <AvField
                    id="security-token-description"
                    type="textarea"
                    rows="10"
                    name="description"
                    validate={{
                      maxLength: { value: 4096, errorMessage: 'This field cannot be longer than 4096 characters.' }
                    }}
                  />
                </AvGroup>
              </Row>
              <Button tag={Link} id="cancel-save" to="/security-token" replace color="info">
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
  securityTokenEntity: storeState.securityToken.entity,
  loading: storeState.securityToken.loading,
  updating: storeState.securityToken.updating,
  updateSuccess: storeState.securityToken.updateSuccess
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

export default connect(mapStateToProps, mapDispatchToProps)(SecurityTokenUpdate);
