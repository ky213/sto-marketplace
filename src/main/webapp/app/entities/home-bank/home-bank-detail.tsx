import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './home-bank.reducer';
import { IHomeBank } from 'app/shared/model/home-bank.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IHomeBankDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const HomeBankDetail = (props: IHomeBankDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { homeBankEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          HomeBank [<b>{homeBankEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="dateEvent">Date Event</span>
          </dt>
          <dd>
            <TextFormat value={homeBankEntity.dateEvent} type="date" format={APP_DATE_FORMAT} />
          </dd>
          <dt>
            <span id="custodyBalance">Custody Balance</span>
          </dt>
          <dd>{homeBankEntity.custodyBalance}</dd>
          <dt>
            <span id="totalUser">Total User</span>
          </dt>
          <dd>{homeBankEntity.totalUser}</dd>
          <dt>
            <span id="volumeOrder">Volume Order</span>
          </dt>
          <dd>{homeBankEntity.volumeOrder}</dd>
          <dt>
            <span id="totalRevenu">Total Revenu</span>
          </dt>
          <dd>{homeBankEntity.totalRevenu}</dd>
          <dt>
            <span id="equityAllocation">Equity Allocation</span>
          </dt>
          <dd>{homeBankEntity.equityAllocation}</dd>
          <dt>
            <span id="fundsAllocation">Funds Allocation</span>
          </dt>
          <dd>{homeBankEntity.fundsAllocation}</dd>
          <dt>
            <span id="realEstateAllocation">Real Estate Allocation</span>
          </dt>
          <dd>{homeBankEntity.realEstateAllocation}</dd>
          <dt>
            <span id="derivativeAllocation">Derivative Allocation</span>
          </dt>
          <dd>{homeBankEntity.derivativeAllocation}</dd>
          <dt>User</dt>
          <dd>{homeBankEntity.user ? homeBankEntity.user.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/home-bank" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/home-bank/${homeBankEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ homeBank }: IRootState) => ({
  homeBankEntity: homeBank.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(HomeBankDetail);
