import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './transaction.reducer';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';

export interface ITransactionUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TransactionUpdate = (props: ITransactionUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { transactionEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/transaction');
  };

  useEffect(() => {
    if (!isNew) {
      props.getEntity(props.match.params.id);
    }
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    values.createDate = convertDateTimeToServer(values.createDate);
    values.updateDate = convertDateTimeToServer(values.updateDate);
    values.closeDate = convertDateTimeToServer(values.closeDate);
    values.confBlkDate = convertDateTimeToServer(values.confBlkDate);
    values.confBankDate = convertDateTimeToServer(values.confBankDate);

    if (errors.length === 0) {
      const entity = {
        ...transactionEntity,
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
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="exchangeApp.transaction.home.createOrEditLabel">Create or edit a Transaction</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : transactionEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="transaction-id">ID</Label>
                  <AvInput id="transaction-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="idTxLabel" for="transaction-idTx">
                  Id Tx
                </Label>
                <AvField
                  id="transaction-idTx"
                  type="text"
                  name="idTx"
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="createDateLabel" for="transaction-createDate">
                  Create Date
                </Label>
                <AvInput
                  id="transaction-createDate"
                  type="datetime-local"
                  className="form-control"
                  name="createDate"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.transactionEntity.createDate)}
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="updateDateLabel" for="transaction-updateDate">
                  Update Date
                </Label>
                <AvInput
                  id="transaction-updateDate"
                  type="datetime-local"
                  className="form-control"
                  name="updateDate"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.transactionEntity.updateDate)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="closeDateLabel" for="transaction-closeDate">
                  Close Date
                </Label>
                <AvInput
                  id="transaction-closeDate"
                  type="datetime-local"
                  className="form-control"
                  name="closeDate"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.transactionEntity.closeDate)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="securityTokenNameLabel" for="transaction-securityTokenName">
                  Security Token Name
                </Label>
                <AvField
                  id="transaction-securityTokenName"
                  type="text"
                  name="securityTokenName"
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="symbolLabel" for="transaction-symbol">
                  Symbol
                </Label>
                <AvField
                  id="transaction-symbol"
                  type="text"
                  name="symbol"
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="limitOrMarketLabel" for="transaction-limitOrMarket">
                  Limit Or Market
                </Label>
                <AvInput
                  id="transaction-limitOrMarket"
                  type="select"
                  className="form-control"
                  name="limitOrMarket"
                  value={(!isNew && transactionEntity.limitOrMarket) || 'LIMIT'}
                >
                  <option value="LIMIT">LIMIT</option>
                  <option value="MARKET">MARKET</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label id="volumeLabel" for="transaction-volume">
                  Volume
                </Label>
                <AvField
                  id="transaction-volume"
                  type="string"
                  className="form-control"
                  name="volume"
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                    min: { value: 0, errorMessage: 'This field should be at least 0.' },
                    number: { value: true, errorMessage: 'This field should be a number.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="priceLabel" for="transaction-price">
                  Price
                </Label>
                <AvField
                  id="transaction-price"
                  type="string"
                  className="form-control"
                  name="price"
                  validate={{
                    min: { value: 0, errorMessage: 'This field should be at least 0.' },
                    number: { value: true, errorMessage: 'This field should be a number.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="totalAmountLabel" for="transaction-totalAmount">
                  Total Amount
                </Label>
                <AvField
                  id="transaction-totalAmount"
                  type="string"
                  className="form-control"
                  name="totalAmount"
                  validate={{
                    min: { value: 0, errorMessage: 'This field should be at least 0.' },
                    number: { value: true, errorMessage: 'This field should be a number.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="categoryTokenLabel" for="transaction-categoryToken">
                  Category Token
                </Label>
                <AvInput
                  id="transaction-categoryToken"
                  type="select"
                  className="form-control"
                  name="categoryToken"
                  value={(!isNew && transactionEntity.categoryToken) || 'EQUITY'}
                >
                  <option value="EQUITY">EQUITY</option>
                  <option value="FUNDS">FUNDS</option>
                  <option value="REAL_ESTATE">REAL_ESTATE</option>
                  <option value="DERIVATIVE">DERIVATIVE</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label id="statusLabel" for="transaction-status">
                  Status
                </Label>
                <AvInput
                  id="transaction-status"
                  type="select"
                  className="form-control"
                  name="status"
                  value={(!isNew && transactionEntity.status) || 'NONE'}
                >
                  <option value="NONE">NONE</option>
                  <option value="INIT">INIT</option>
                  <option value="PENDING">PENDING</option>
                  <option value="SUCCESS">SUCCESS</option>
                  <option value="FAIL">FAIL</option>
                  <option value="REMOVE">REMOVE</option>
                </AvInput>
              </AvGroup>
              <AvGroup check>
                <Label id="activeLabel">
                  <AvInput id="transaction-active" type="checkbox" className="form-check-input" name="active" />
                  Active
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="feeTransactionLabel" for="transaction-feeTransaction">
                  Fee Transaction
                </Label>
                <AvField id="transaction-feeTransaction" type="string" className="form-control" name="feeTransaction" />
              </AvGroup>
              <AvGroup>
                <Label id="numBlockchainTxLabel" for="transaction-numBlockchainTx">
                  Num Blockchain Tx
                </Label>
                <AvField id="transaction-numBlockchainTx" type="text" name="numBlockchainTx" />
              </AvGroup>
              <AvGroup>
                <Label id="numBankTxLabel" for="transaction-numBankTx">
                  Num Bank Tx
                </Label>
                <AvField id="transaction-numBankTx" type="text" name="numBankTx" />
              </AvGroup>
              <AvGroup>
                <Label id="confBlkDateLabel" for="transaction-confBlkDate">
                  Conf Blk Date
                </Label>
                <AvInput
                  id="transaction-confBlkDate"
                  type="datetime-local"
                  className="form-control"
                  name="confBlkDate"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.transactionEntity.confBlkDate)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="confBankDateLabel" for="transaction-confBankDate">
                  Conf Bank Date
                </Label>
                <AvInput
                  id="transaction-confBankDate"
                  type="datetime-local"
                  className="form-control"
                  name="confBankDate"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.transactionEntity.confBankDate)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="sellerBlkAddressLabel" for="transaction-sellerBlkAddress">
                  Seller Blk Address
                </Label>
                <AvField id="transaction-sellerBlkAddress" type="text" name="sellerBlkAddress" />
              </AvGroup>
              <AvGroup>
                <Label id="buyerBlkAddressLabel" for="transaction-buyerBlkAddress">
                  Buyer Blk Address
                </Label>
                <AvField id="transaction-buyerBlkAddress" type="text" name="buyerBlkAddress" />
              </AvGroup>
              <AvGroup>
                <Label id="buyerIbanLabel" for="transaction-buyerIban">
                  Buyer Iban
                </Label>
                <AvField id="transaction-buyerIban" type="text" name="buyerIban" />
              </AvGroup>
              <AvGroup>
                <Label id="sellerIbanLabel" for="transaction-sellerIban">
                  Seller Iban
                </Label>
                <AvField id="transaction-sellerIban" type="text" name="sellerIban" />
              </AvGroup>
              <AvGroup>
                <Label id="buyeridLabel" for="transaction-buyerid">
                  Buyerid
                </Label>
                <AvField id="transaction-buyerid" type="string" className="form-control" name="buyerid" />
              </AvGroup>
              <AvGroup>
                <Label id="selleridLabel" for="transaction-sellerid">
                  Sellerid
                </Label>
                <AvField id="transaction-sellerid" type="string" className="form-control" name="sellerid" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/transaction" replace color="info">
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
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  transactionEntity: storeState.transaction.entity,
  loading: storeState.transaction.loading,
  updating: storeState.transaction.updating,
  updateSuccess: storeState.transaction.updateSuccess
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TransactionUpdate);
