import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './white-listing.reducer';
import { IWhiteListing } from 'app/shared/model/white-listing.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IWhiteListingDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const WhiteListingDetail = (props: IWhiteListingDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { whiteListingEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          WhiteListing [<b>{whiteListingEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="dateEvent">Date Event</span>
          </dt>
          <dd>
            <TextFormat value={whiteListingEntity.dateEvent} type="date" format={APP_DATE_FORMAT} />
          </dd>
          <dt>
            <span id="status">Status</span>
          </dt>
          <dd>{whiteListingEntity.status}</dd>
          <dt>
            <span id="active">Active</span>
          </dt>
          <dd>{whiteListingEntity.active ? 'true' : 'false'}</dd>
          <dt>
            <span id="ethAddress">Eth Address</span>
          </dt>
          <dd>{whiteListingEntity.ethAddress}</dd>
          <dt>
            <span id="dateSynchBlk">Date Synch Blk</span>
          </dt>
          <dd>
            <TextFormat value={whiteListingEntity.dateSynchBlk} type="date" format={APP_DATE_FORMAT} />
          </dd>
          <dt>
            <span id="stName">St Name</span>
          </dt>
          <dd>{whiteListingEntity.stName}</dd>
          <dt>
            <span id="customerName">Customer Name</span>
          </dt>
          <dd>{whiteListingEntity.customerName}</dd>
          <dt>
            <span id="balance">Balance</span>
          </dt>
          <dd>{whiteListingEntity.balance}</dd>
          <dt>User</dt>
          <dd>{whiteListingEntity.user ? whiteListingEntity.user.id : ''}</dd>
          <dt>Securitytoken</dt>
          <dd>{whiteListingEntity.securitytoken ? whiteListingEntity.securitytoken.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/white-listing" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/white-listing/${whiteListingEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ whiteListing }: IRootState) => ({
  whiteListingEntity: whiteListing.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(WhiteListingDetail);
