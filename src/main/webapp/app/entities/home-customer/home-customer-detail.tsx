import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './home-customer.reducer';
import { APP_DATE_FORMAT } from 'app/config/constants';

export interface IHomeCustomerDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const HomeCustomerDetail = (props: IHomeCustomerDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { homeCustomerEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          HomeCustomer [<b>{homeCustomerEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="dateEvent">Date Event</span>
          </dt>
          <dd>
            <TextFormat value={homeCustomerEntity.dateEvent} type="date" format={APP_DATE_FORMAT} />
          </dd>
          <dt>
            <span id="tokenBalance">Token Balance</span>
          </dt>
          <dd>{homeCustomerEntity.tokenBalance}</dd>
          <dt>
            <span id="bigestTokenName">Bigest Token Name</span>
          </dt>
          <dd>{homeCustomerEntity.bigestTokenName}</dd>
          <dt>
            <span id="bigestTokenValue">Bigest Token Value</span>
          </dt>
          <dd>{homeCustomerEntity.bigestTokenValue}</dd>
          <dt>
            <span id="secondTokenName">Second Token Name</span>
          </dt>
          <dd>{homeCustomerEntity.secondTokenName}</dd>
          <dt>
            <span id="secondTokenValue">Second Token Value</span>
          </dt>
          <dd>{homeCustomerEntity.secondTokenValue}</dd>
          <dt>
            <span id="bankBalance">Bank Balance</span>
          </dt>
          <dd>{homeCustomerEntity.bankBalance}</dd>
          <dt>
            <span id="equityAllocation">Equity Allocation</span>
          </dt>
          <dd>{homeCustomerEntity.equityAllocation}</dd>
          <dt>
            <span id="fundsAllocation">Funds Allocation</span>
          </dt>
          <dd>{homeCustomerEntity.fundsAllocation}</dd>
          <dt>
            <span id="realEstateAllocation">Real Estate Allocation</span>
          </dt>
          <dd>{homeCustomerEntity.realEstateAllocation}</dd>
          <dt>
            <span id="derivativeAllocation">Derivative Allocation</span>
          </dt>
          <dd>{homeCustomerEntity.derivativeAllocation}</dd>
          <dt>User</dt>
          <dd>{homeCustomerEntity.user ? homeCustomerEntity.user.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/home-customer" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/home-customer/${homeCustomerEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ homeCustomer }: IRootState) => ({
  homeCustomerEntity: homeCustomer.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(HomeCustomerDetail);
