import React from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { openFile, TextFormat } from 'react-jhipster';

import { ISecurityToken } from 'app/shared/model/security-token.model';
import { APP_DATE_FORMAT } from 'app/config/constants';

function Info(props: ISecurityToken) {
  return (
    <Card className="p-0 h-100">
      <CardBody>
        <Row>
          <Col md="8">
            <Row>
              <Col>
                <small className="text-muted ">Name: </small>
                <small>{props.name}</small>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-muted ">Launch Date: </small>
                <small>
                  <TextFormat value={props.laucheDate} type="date" format={APP_DATE_FORMAT} />
                </small>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-muted ">Symbol: </small>
                <small>{props.symbol}</small>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-muted ">Jurisdiction: </small>
                <small>{props.juridiction}</small>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-muted ">Issuer Name: </small>
                <small>{props.issuerName}</small>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-muted ">Issuer County: </small>
                <small>{props.issuerCounty}</small>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-muted ">Tokenization Firm Name: </small>
                <small>{props.tokenizationFirmName}</small>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-muted ">Tokenization Firm Country: </small>
                <small>{props.tokenizationFirmCountry}</small>
              </Col>
            </Row>
          </Col>
          <Col>
            <Row>
              <Col>
                <small className="text-muted ">KYC Provider Name: </small>
                <small>{props.kycProviderName}</small>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-muted ">KYC Provider Country: </small>
                <small>{props.kycProviderCountry}</small>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-muted ">STO Price: </small>
                <small>{props.stoPrice?.toLocaleString()} CHF</small>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-muted ">Amount Raised: </small>
                <small>{props.amountRaised}</small>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-muted ">STO Type: </small>
                <small>{props.category}</small>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <small className="text-muted ">Restriction County: </small>
            <small>{props.restrictionCounty?.replace(/\s/g, ', ')}</small>
          </Col>
        </Row>
        <Row>
          <Col>
            <small className="text-muted ">Restriction Nationality: </small>
            <small>{props.restrictionNationality?.replace(/\s/g, ' , ')}</small>
          </Col>
        </Row>
        <Row>
          <Col>
            <small className="text-muted ">Summary: </small>
            <small>{props.summary}</small>
          </Col>
        </Row>
        <Row>
          <Col>
            <small className="text-muted ">Description: </small>
            <small>{props.description}</small>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <small className="text-muted ">Prospectus: </small>
            {props.prospectus ? (
              <a onClick={openFile(props.prospectusContentType, props.prospectus)}>
                <small>Available Here</small>
              </a>
            ) : null}
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
}

export default Info;
