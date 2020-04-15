import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { ICrudGetAction, openFile, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './security-token.reducer';
import { ISecurityToken } from 'app/shared/model/security-token.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ISecurityTokenDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const SecurityTokenDetail = (props: ISecurityTokenDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { securityTokenEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          SecurityToken [<b>{securityTokenEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="idRed">Id Red</span>
          </dt>
          <dd>{securityTokenEntity.idRed}</dd>
          <dt>
            <span id="name">Name</span>
          </dt>
          <dd>{securityTokenEntity.name}</dd>
          <dt>
            <span id="laucheDate">Lauche Date</span>
          </dt>
          <dd>
            <TextFormat value={securityTokenEntity.laucheDate} type="date" format={APP_DATE_FORMAT} />
          </dd>
          <dt>
            <span id="logo">Logo</span>
          </dt>
          <dd>
            {securityTokenEntity.logo ? (
              <div>
                <a onClick={openFile(securityTokenEntity.logoContentType, securityTokenEntity.logo)}>
                  <img
                    src={`data:${securityTokenEntity.logoContentType};base64,${securityTokenEntity.logo}`}
                    style={{ maxHeight: '30px' }}
                  />
                </a>
                <span>
                  {securityTokenEntity.logoContentType}, {byteSize(securityTokenEntity.logo)}
                </span>
              </div>
            ) : null}
          </dd>
          <dt>
            <span id="symbol">Symbol</span>
          </dt>
          <dd>{securityTokenEntity.symbol}</dd>
          <dt>
            <span id="juridiction">Juridiction</span>
          </dt>
          <dd>{securityTokenEntity.juridiction}</dd>
          <dt>
            <span id="issuerName">Issuer Name</span>
          </dt>
          <dd>{securityTokenEntity.issuerName}</dd>
          <dt>
            <span id="issuerCounty">Issuer County</span>
          </dt>
          <dd>{securityTokenEntity.issuerCounty}</dd>
          <dt>
            <span id="tokenizationFirmName">Tokenization Firm Name</span>
          </dt>
          <dd>{securityTokenEntity.tokenizationFirmName}</dd>
          <dt>
            <span id="tokenizationFirmCountry">Tokenization Firm Country</span>
          </dt>
          <dd>{securityTokenEntity.tokenizationFirmCountry}</dd>
          <dt>
            <span id="kycProviderName">Kyc Provider Name</span>
          </dt>
          <dd>{securityTokenEntity.kycProviderName}</dd>
          <dt>
            <span id="kycProviderCountry">Kyc Provider Country</span>
          </dt>
          <dd>{securityTokenEntity.kycProviderCountry}</dd>
          <dt>
            <span id="stoPrice">Sto Price</span>
          </dt>
          <dd>{securityTokenEntity.stoPrice}</dd>
          <dt>
            <span id="amountRaised">Amount Raised</span>
          </dt>
          <dd>{securityTokenEntity.amountRaised}</dd>
          <dt>
            <span id="category">Category</span>
          </dt>
          <dd>{securityTokenEntity.category}</dd>
          <dt>
            <span id="summary">Summary</span>
          </dt>
          <dd>{securityTokenEntity.summary}</dd>
          <dt>
            <span id="description">Description</span>
          </dt>
          <dd>{securityTokenEntity.description}</dd>
          <dt>
            <span id="restrictionCounty">Restriction County</span>
          </dt>
          <dd>{securityTokenEntity.restrictionCounty}</dd>
          <dt>
            <span id="restrictionNationality">Restriction Nationality</span>
          </dt>
          <dd>{securityTokenEntity.restrictionNationality}</dd>
          <dt>
            <span id="prospectus">Prospectus</span>
          </dt>
          <dd>
            {securityTokenEntity.prospectus ? (
              <div>
                <a onClick={openFile(securityTokenEntity.prospectusContentType, securityTokenEntity.prospectus)}>Open&nbsp;</a>
                <span>
                  {securityTokenEntity.prospectusContentType}, {byteSize(securityTokenEntity.prospectus)}
                </span>
              </div>
            ) : null}
          </dd>
          <dt>
            <span id="status">Status</span>
          </dt>
          <dd>{securityTokenEntity.status}</dd>
          <dt>
            <span id="registrationDate">Registration Date</span>
          </dt>
          <dd>
            <TextFormat value={securityTokenEntity.registrationDate} type="date" format={APP_DATE_FORMAT} />
          </dd>
          <dt>
            <span id="updateDate">Update Date</span>
          </dt>
          <dd>
            <TextFormat value={securityTokenEntity.updateDate} type="date" format={APP_DATE_FORMAT} />
          </dd>
          <dt>
            <span id="dueDiligenceDate">Due Diligence Date</span>
          </dt>
          <dd>
            <TextFormat value={securityTokenEntity.dueDiligenceDate} type="date" format={APP_DATE_FORMAT} />
          </dd>
          <dt>
            <span id="lastSellingprice">Last Sellingprice</span>
          </dt>
          <dd>{securityTokenEntity.lastSellingprice}</dd>
          <dt>
            <span id="lastBuyingPrice">Last Buying Price</span>
          </dt>
          <dd>{securityTokenEntity.lastBuyingPrice}</dd>
          <dt>
            <span id="smartcontractAddress">Smartcontract Address</span>
          </dt>
          <dd>{securityTokenEntity.smartcontractAddress}</dd>
          <dt>
            <span id="kycAddress">Kyc Address</span>
          </dt>
          <dd>{securityTokenEntity.kycAddress}</dd>
          <dt>
            <span id="website">Website</span>
          </dt>
          <dd>{securityTokenEntity.website}</dd>
        </dl>
        <Button tag={Link} to="/security-token" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/security-token/${securityTokenEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ securityToken }: IRootState) => ({
  securityTokenEntity: securityToken.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(SecurityTokenDetail);
