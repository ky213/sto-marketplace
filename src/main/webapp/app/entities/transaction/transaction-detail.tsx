import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Card, CardHeader, CardBody } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './transaction.reducer';
import { AUTHORITIES } from 'app/config/constants';
import moment from 'moment';

export interface ITransactionDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TransactionDetail = (props: ITransactionDetailProps) => {
  const { transactionEntity, account, match } = props;
  const isAdmin = account.authorities.includes(AUTHORITIES.ADMIN);
  const isBank = account.authorities.includes(AUTHORITIES.BANK);
  const isBuyer = account.id === transactionEntity.buyerid;
  const isSeller = account.id === transactionEntity.sellerid;

  useEffect(() => {
    props.getEntity(match.params.id);
  }, []);

  return (
    <Row className="mx-auto">
      <Col className="p-0 ml-2">
        <Card className="p-0">
          <CardHeader>
            <h6 className="p-0 m-0"> ID: {transactionEntity.id}</h6>
            <small className="text-muted p-0 m-0">Information about the transaction</small>
          </CardHeader>
          <CardBody>
            <Row>
              <Col>
                <small className="text-muted ">IdTx</small>
                <p>{transactionEntity.idTx}</p>
              </Col>
              <Col>
                <small className="text-muted ">Order Type</small>
                <p>{transactionEntity.limitOrMarket}</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-muted ">Create Date</small>
                <p>{moment(transactionEntity.createDate).format('LLL')}</p>
              </Col>

              <Col>
                <small className="text-muted ">Update Date</small>
                <p>{moment(transactionEntity.updateDate).format('LLL')}</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-muted ">Close Date</small>
                <p>{moment(transactionEntity.closeDate).format('LLL')}</p>
              </Col>
              <Col>
                <small className="text-muted ">Security Token Name</small>
                <p>{transactionEntity.securityTokenName}</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-muted ">Symbol</small>
                <p>{transactionEntity.symbol}</p>
              </Col>
              <Col>
                <small className="text-muted ">Volume</small>
                <p>{transactionEntity.volume}</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-muted ">Price</small>
                <p>CHF {transactionEntity.price?.toLocaleString()}</p>
              </Col>
              <Col>
                <small className="text-muted ">Total Ammount</small>
                <p>{transactionEntity.totalAmount}</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-muted ">Category Token</small>
                <p>{transactionEntity.categoryToken}</p>
              </Col>
              <Col>
                <small className="text-muted ">Status</small>
                <p>{transactionEntity.status}</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-muted ">Active</small>
                <p>{`${transactionEntity.active}`}</p>
              </Col>
              <Col>
                <small className="text-muted ">Transaction Fees</small>
                <p>{transactionEntity.feeTransaction}</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-muted ">numBanTX</small>
                <p>{transactionEntity.numBankTx}</p>
              </Col>
              <Col>
                <small className="text-muted ">confBlkDate</small>
                <p>{moment(transactionEntity.confBlkDate).format('LLL')}</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-muted ">confBankDate</small>
                <p>{moment(transactionEntity.confBankDate).format('LLL')}</p>
              </Col>
            </Row>
            {(isAdmin || isBank || isSeller) && (
              <>
                <Row>
                  <Col>
                    <small className="text-muted ">Seller ID</small>
                    <p>{transactionEntity.sellerid}</p>
                  </Col>
                  <Col>
                    <small className="text-muted ">Seller Name</small>
                    <p>{transactionEntity.sellerName}</p>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <small className="text-muted ">Seller Address</small>
                    <p>{transactionEntity.sellerBlkAddress}</p>
                  </Col>
                  <Col>
                    <small className="text-muted ">Seller IBAN</small>
                    <p>{transactionEntity.sellerIban}</p>
                  </Col>
                </Row>
              </>
            )}
            {(isAdmin || isBank || isBuyer) && (
              <>
                <Row>
                  <Col>
                    <small className="text-muted ">Buyer ID</small>
                    <p>{transactionEntity.buyerid}</p>
                  </Col>
                  <Col>
                    <small className="text-muted ">Buyer Name</small>
                    <p>{transactionEntity.buyerName}</p>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <small className="text-muted ">Buyer Address</small>
                    <p>{transactionEntity.buyerBlkAddress}</p>
                  </Col>
                  <Col>
                    <small className="text-muted ">Buyer IBAN</small>
                    <p>{transactionEntity.buyerIban}</p>
                  </Col>
                </Row>
              </>
            )}
            <Button tag={Link} to="/transaction" replace color="info">
              <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
            </Button>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ transaction, authentication }: IRootState) => ({
  transactionEntity: transaction.entity,
  account: authentication.account
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TransactionDetail);
