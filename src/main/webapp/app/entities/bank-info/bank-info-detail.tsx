import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { ICrudGetAction, openFile, byteSize } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './bank-info.reducer';
import { IBankInfo } from 'app/shared/model/bank-info.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IBankInfoDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const BankInfoDetail = (props: IBankInfoDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { bankInfoEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          BankInfo [<b>{bankInfoEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="bankName">Bank Name</span>
          </dt>
          <dd>{bankInfoEntity.bankName}</dd>
          <dt>
            <span id="logo">Logo</span>
          </dt>
          <dd>
            {bankInfoEntity.logo ? (
              <div>
                <a onClick={openFile(bankInfoEntity.logoContentType, bankInfoEntity.logo)}>
                  <img src={`data:${bankInfoEntity.logoContentType};base64,${bankInfoEntity.logo}`} style={{ maxHeight: '30px' }} />
                </a>
                <span>
                  {bankInfoEntity.logoContentType}, {byteSize(bankInfoEntity.logo)}
                </span>
              </div>
            ) : null}
          </dd>
          <dt>
            <span id="country">Country</span>
          </dt>
          <dd>{bankInfoEntity.country}</dd>
          <dt>
            <span id="bicNumber">Bic Number</span>
          </dt>
          <dd>{bankInfoEntity.bicNumber}</dd>
          <dt>
            <span id="omnibusAccount">Omnibus Account</span>
          </dt>
          <dd>{bankInfoEntity.omnibusAccount}</dd>
          <dt>
            <span id="fixedFee">Fixed Fee</span>
          </dt>
          <dd>{bankInfoEntity.fixedFee}</dd>
          <dt>
            <span id="percentFee">Percent Fee</span>
          </dt>
          <dd>{bankInfoEntity.percentFee}</dd>
        </dl>
        <Button tag={Link} to="/bank-info" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/bank-info/${bankInfoEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ bankInfo }: IRootState) => ({
  bankInfoEntity: bankInfo.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(BankInfoDetail);
