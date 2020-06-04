import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Card, CardHeader, CardBody } from 'reactstrap';
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
    <Card className="p-0">
      <CardHeader>
        <h2>
          WhiteListing [<b>{whiteListingEntity?.id}</b>]
        </h2>
      </CardHeader>
      <CardBody className="col-8 mx-auto">
        <Row>
          <Col>
            <small className="text-muted ">St Name</small>
            <p>{whiteListingEntity?.stName}</p>
          </Col>

          <Col>
            <small className="text-muted ">Status</small>
            <p>{whiteListingEntity?.status}</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <small className="text-muted ">Active</small>
            <p>{`${whiteListingEntity?.active}`}</p>
          </Col>
          <Col>
            <small className="text-muted ">Eth Address</small>
            <p>{whiteListingEntity?.ethAddress}</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <small className="text-muted ">Date Event</small>
            <p>
              <TextFormat value={whiteListingEntity?.dateEvent} type="date" format={APP_DATE_FORMAT} />
            </p>
          </Col>
          <Col>
            <small className="text-muted ">Date Synch Blk</small>
            <p>
              <TextFormat value={whiteListingEntity?.dateSynchBlk} type="date" format={APP_DATE_FORMAT} />
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <small className="text-muted ">Customer Name</small>
            <p>{whiteListingEntity?.customerName}</p>
          </Col>
          <Col>
            <small className="text-muted ">Balance</small>
            <p>{whiteListingEntity?.balance}</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <small className="text-muted ">User</small>
            <p>{whiteListingEntity?.user?.login}</p>
          </Col>
          <Col>
            <small className="text-muted ">Security token</small>
            <p>{whiteListingEntity?.securitytoken?.name}</p>
          </Col>
        </Row>
        <Button tag={Link} to="/white-listing" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/white-listing/${whiteListingEntity?.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </CardBody>
    </Card>
  );
};

const mapStateToProps = ({ whiteListing }: IRootState) => ({
  whiteListingEntity: whiteListing.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(WhiteListingDetail);
