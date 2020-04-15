import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './transaction.reducer';
import { ITransaction } from 'app/shared/model/transaction.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITransactionDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TransactionDetail = (props: ITransactionDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { transactionEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          Transaction [<b>{transactionEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="idTx">Id Tx</span>
          </dt>
          <dd>{transactionEntity.idTx}</dd>
          <dt>
            <span id="createDate">Create Date</span>
          </dt>
          <dd>
            <TextFormat value={transactionEntity.createDate} type="date" format={APP_DATE_FORMAT} />
          </dd>
          <dt>
            <span id="updateDate">Update Date</span>
          </dt>
          <dd>
            <TextFormat value={transactionEntity.updateDate} type="date" format={APP_DATE_FORMAT} />
          </dd>
          <dt>
            <span id="closeDate">Close Date</span>
          </dt>
          <dd>
            <TextFormat value={transactionEntity.closeDate} type="date" format={APP_DATE_FORMAT} />
          </dd>
          <dt>
            <span id="securityTokenName">Security Token Name</span>
          </dt>
          <dd>{transactionEntity.securityTokenName}</dd>
          <dt>
            <span id="symbol">Symbol</span>
          </dt>
          <dd>{transactionEntity.symbol}</dd>
          <dt>
            <span id="limitOrMarket">Limit Or Market</span>
          </dt>
          <dd>{transactionEntity.limitOrMarket}</dd>
          <dt>
            <span id="volume">Volume</span>
          </dt>
          <dd>{transactionEntity.volume}</dd>
          <dt>
            <span id="price">Price</span>
          </dt>
          <dd>{transactionEntity.price}</dd>
          <dt>
            <span id="totalAmount">Total Amount</span>
          </dt>
          <dd>{transactionEntity.totalAmount}</dd>
          <dt>
            <span id="categoryToken">Category Token</span>
          </dt>
          <dd>{transactionEntity.categoryToken}</dd>
          <dt>
            <span id="status">Status</span>
          </dt>
          <dd>{transactionEntity.status}</dd>
          <dt>
            <span id="active">Active</span>
          </dt>
          <dd>{transactionEntity.active ? 'true' : 'false'}</dd>
          <dt>
            <span id="feeTransaction">Fee Transaction</span>
          </dt>
          <dd>{transactionEntity.feeTransaction}</dd>
          <dt>
            <span id="numBlockchainTx">Num Blockchain Tx</span>
          </dt>
          <dd>{transactionEntity.numBlockchainTx}</dd>
          <dt>
            <span id="numBankTx">Num Bank Tx</span>
          </dt>
          <dd>{transactionEntity.numBankTx}</dd>
          <dt>
            <span id="confBlkDate">Conf Blk Date</span>
          </dt>
          <dd>
            <TextFormat value={transactionEntity.confBlkDate} type="date" format={APP_DATE_FORMAT} />
          </dd>
          <dt>
            <span id="confBankDate">Conf Bank Date</span>
          </dt>
          <dd>
            <TextFormat value={transactionEntity.confBankDate} type="date" format={APP_DATE_FORMAT} />
          </dd>
          <dt>
            <span id="sellerBlkAddress">Seller Blk Address</span>
          </dt>
          <dd>{transactionEntity.sellerBlkAddress}</dd>
          <dt>
            <span id="buyerBlkAddress">Buyer Blk Address</span>
          </dt>
          <dd>{transactionEntity.buyerBlkAddress}</dd>
          <dt>
            <span id="buyerIban">Buyer Iban</span>
          </dt>
          <dd>{transactionEntity.buyerIban}</dd>
          <dt>
            <span id="sellerIban">Seller Iban</span>
          </dt>
          <dd>{transactionEntity.sellerIban}</dd>
          <dt>
            <span id="buyerid">Buyerid</span>
          </dt>
          <dd>{transactionEntity.buyerid}</dd>
          <dt>
            <span id="sellerid">Sellerid</span>
          </dt>
          <dd>{transactionEntity.sellerid}</dd>
        </dl>
        <Button tag={Link} to="/transaction" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/transaction/${transactionEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ transaction }: IRootState) => ({
  transactionEntity: transaction.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TransactionDetail);
