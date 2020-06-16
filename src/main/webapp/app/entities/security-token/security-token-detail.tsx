import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Card, CardHeader, CardBody } from 'reactstrap';
import { ICrudGetAction, openFile, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './security-token.reducer';
import { ISecurityToken } from 'app/shared/model/security-token.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT, AUTHORITIES } from 'app/config/constants';
import moment from 'moment';

export interface ISecurityTokenDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const SecurityTokenDetail = (props: ISecurityTokenDetailProps) => {
  const isAdmin = props.account.authorities.includes(AUTHORITIES.ADMIN);
  const isBank = props.account.authorities.includes(AUTHORITIES.BANK);

  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { securityTokenEntity } = props;
  return (
    <Row className="mx-auto">
      <Col className="p-0 ml-2">
        <Card className="p-0">
          <CardHeader>
            <h6 className="p-0 m-0"> ID: {securityTokenEntity.id}</h6>
            <small className="text-muted p-0 m-0">Information about securtiy token</small>
          </CardHeader>
          <CardBody>
            <Row>
              <Col>
                <small className="text-muted ">Id Red</small>
                <p>{securityTokenEntity.idRed}</p>
              </Col>
              <Col>
                <small className="text-muted ">Status</small>
                <p>{securityTokenEntity.status}</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-muted ">Name</small>
                <p>{securityTokenEntity.name}</p>
              </Col>

              <Col>
                <small className="text-muted ">Symbol</small>
                <p>{securityTokenEntity.symbol}</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-muted ">Jurisdiction</small>
                <p>{securityTokenEntity.juridiction}</p>
              </Col>
              <Col>
                <small className="text-muted ">Issuer Name</small>
                <p>{securityTokenEntity.issuerName}</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-muted ">Issuer County</small>
                <p>{securityTokenEntity.issuerCounty}</p>
              </Col>
              <Col>
                <small className="text-muted ">Tokenization Firm Name</small>
                <p>{securityTokenEntity.tokenizationFirmName}</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-muted ">Smartcontract Address</small>
                <p>{securityTokenEntity.smartcontractAddress}</p>
              </Col>
              <Col>
                <small className="text-muted ">KYC Address</small>
                <p>{securityTokenEntity.kycAddress}</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-muted ">Tokenization Firm Country</small>
                <p>{securityTokenEntity.tokenizationFirmCountry}</p>
              </Col>
              <Col>
                <small className="text-muted ">KYC Provider Name</small>
                <p>{securityTokenEntity.kycProviderName}</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-muted ">KYC Provider Country</small>
                <p>{securityTokenEntity.kycProviderCountry}</p>
              </Col>
              <Col>
                <small className="text-muted ">Sto Price</small>
                <p>{securityTokenEntity.stoPrice?.toLocaleString()} CHF</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-muted ">Amount Raised</small>
                <p>{securityTokenEntity.amountRaised}</p>
              </Col>
              <Col>
                <small className="text-muted ">Category</small>
                <p>{securityTokenEntity.category}</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-muted ">Restriction County</small>
                <p>{securityTokenEntity.restrictionCounty}</p>
              </Col>
              <Col>
                <small className="text-muted ">Restriction Nationality</small>
                <p>{securityTokenEntity.restrictionNationality}</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-muted ">Registration Date</small>
                <p>
                  <TextFormat value={securityTokenEntity.registrationDate} type="date" format={APP_DATE_FORMAT} />
                </p>
              </Col>
              <Col>
                <small className="text-muted ">Lauche Date</small>
                <p>
                  <TextFormat value={securityTokenEntity.laucheDate} type="date" format={APP_DATE_FORMAT} />
                </p>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-muted ">Update Date</small>
                <p>{securityTokenEntity.updateDate}</p>
              </Col>
              <Col>
                <small className="text-muted ">Due Diligence Date</small>
                <p>
                  <TextFormat value={securityTokenEntity.dueDiligenceDate} type="date" format={APP_DATE_FORMAT} />
                </p>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-muted ">Last Sellingprice</small>
                <p>{securityTokenEntity.lastSellingprice?.toLocaleString()} CHF</p>
              </Col>
              <Col>
                <small className="text-muted ">Last Buying Price</small>
                <p>{securityTokenEntity.lastBuyingPrice?.toLocaleString()} CHF</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-muted ">Website</small>
                <p>{securityTokenEntity.website}</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-muted ">Summary</small>
                <p>{securityTokenEntity.summary}</p>
              </Col>
              <Col>
                <small className="text-muted ">Description</small>
                <p>{securityTokenEntity.description}</p>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <small className="text-muted ">Prospectus</small>
                {securityTokenEntity.prospectus ? (
                  <div>
                    <a onClick={openFile(securityTokenEntity.prospectusContentType, securityTokenEntity.prospectus)}>
                      <img
                        className="bg-secondary d-block "
                        src={`data:image/png;base64,${securityTokenEntity.prospectus}`}
                        alt="security_token_prospectus"
                        style={{ maxHeight: '200px', maxWidth: '200px' }}
                      />
                    </a>
                  </div>
                ) : null}
              </Col>
            </Row>
            <Button tag={Link} to="/security-token" replace color="info">
              <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
            </Button>
            &nbsp;
            {(isAdmin || isBank) && (
              <Button tag={Link} to={`/security-token/${securityTokenEntity.id}/edit`} replace color="primary">
                <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
              </Button>
            )}
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ securityToken, authentication }: IRootState) => ({
  securityTokenEntity: securityToken.entity,
  account: authentication.account
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(SecurityTokenDetail);
