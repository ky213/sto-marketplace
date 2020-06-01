import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Row, Col, Card, CardHeader, CardBody } from 'reactstrap';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './bank-info.reducer';
import moment from 'moment';

export interface IBankInfoDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const BankInfoDetail = ({ getBank, bankInfoEntity, loading, match }: IBankInfoDetailProps) => {
  useEffect(() => {
    getBank(match.params.id);
  }, []);

  return (
    <div>
      <Row className="mx-auto">
        <Col className="p-0 mx-auto">
          <Card className="p-0">
            <CardBody>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <>
                  <Row>
                    <Col xs="6">
                      <h6>{bankInfoEntity.bankName}</h6>
                      <small className="text-muted">
                        {bankInfoEntity.country} <br />
                        {moment().format('LLL')}
                      </small>
                    </Col>
                    <Col>
                      <img
                        className="bg-secondary d-block"
                        src={`data:image/png;base64,${bankInfoEntity.logo}`}
                        alt="bank_logo"
                        style={{ height: '80px', width: '80px' }}
                      />
                    </Col>
                  </Row>
                  <Row className="mt-5">
                    <Col>
                      <small className="text-muted ">BIC Number</small>
                      <p>{bankInfoEntity.bicNumber}</p>
                    </Col>
                    <Col>
                      <small className="text-muted ">Omnibus Account</small>
                      <p>{bankInfoEntity.omnibusAccount}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <small className="text-muted ">Fixed fee</small>
                      <p>{bankInfoEntity.fixedFee}</p>
                    </Col>
                    <Col>
                      <small className="text-muted ">Percent Fee</small>
                      <p>{bankInfoEntity.percentFee}</p>
                    </Col>
                  </Row>
                </>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = ({ bankInfo }: IRootState) => ({
  bankInfoEntity: bankInfo.entity,
  loading: bankInfo.loading
});

const mapDispatchToProps = { getBank: getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(BankInfoDetail);
