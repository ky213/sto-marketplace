import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Row, Col, Card, CardHeader, CardBody } from 'reactstrap';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './bank-info.reducer';
import moment from 'moment';

export interface IBankInfoDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const BankInfoDetail = ({ getBanks, bankInfoEntities, loading, match }: IBankInfoDetailProps) => {
  const bank = bankInfoEntities[0];

  useEffect(() => {
    getBanks();
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
                      <h6>{bank?.bankName}</h6>
                      <small className="text-muted">
                        {bank?.country} <br />
                        {moment().format('LLL')}
                      </small>
                    </Col>
                    <Col>
                      <img
                        className="bg-secondary d-block"
                        src={`data:image/png;base64,${bank?.logo}`}
                        alt="bank_logo"
                        style={{ height: '80px', width: '80px' }}
                      />
                    </Col>
                  </Row>
                  <Row className="mt-5">
                    <Col>
                      <small className="text-muted ">BIC Number</small>
                      <p>{bank?.bicNumber}</p>
                    </Col>
                    <Col>
                      <small className="text-muted ">Omnibus Account</small>
                      <p>{bank?.omnibusAccount}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <small className="text-muted ">Fixed fee</small>
                      <p>{bank?.fixedFee}</p>
                    </Col>
                    <Col>
                      <small className="text-muted ">Percent Fee</small>
                      <p>{bank?.percentFee}</p>
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
  bankInfoEntities: bankInfo.entities,
  loading: bankInfo.loading
});

const mapDispatchToProps = { getBanks: getEntities };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(BankInfoDetail);
