import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import { Button } from 'reactstrap';

import { getUser } from './user-management.reducer';
import { IRootState } from 'app/shared/reducers';
import { convertDateTimeFromServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';

export interface IUserManagementDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ login: string }> {}

export const UserManagementDetail = (props: IUserManagementDetailProps) => {
  useEffect(() => {
    props.getUser(props.match.params.login);
  }, []);

  const { user } = props;

  return (
    <Row className=" flex-column align-items-center w-75 mx-auto">
      <h4 className="col py-0 mb-0"> Profile</h4>
      <span className="col mb-3 py-0 text-muted"> profile information</span>
      <Col className=" ml-3 p-0">
        <Row>
          <Col>
            <small className="text-muted ">Username</small>
            <p>{user.login}</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <small className="text-muted ">First Name</small>
            <p>{user.firstName}</p>
          </Col>
          <Col>
            <small className="text-muted">Last Name</small>
            <p>{user.lastName}</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <small className="text-muted ">Email Address</small>
            <p>{user.email}</p>
          </Col>
          <Col>
            <small className="text-muted">Phone Number</small>
            <p>{user.setting?.phoneNumber}</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <small className="text-muted ">Date of Birth </small>
            <p>{moment(user.setting?.dateOfBirth).format('LLL')}</p>
          </Col>
          <Col>
            <small className="text-muted">Nationality</small>
            <p>{user.setting?.nationality}</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <small className="text-muted ">City</small>
            <p>{user.setting?.city}</p>
          </Col>
          <Col>
            <small className="text-muted">Country</small>
            <p>{user.setting?.country}</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <small className="text-muted ">Bank user</small>
            <p>{user.setting?.iban}</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <small className="text-muted ">Ethereum Address</small>
            <p>{user.setting?.ethAddress}</p>
          </Col>
        </Row>
        <Button tag={Link} to="/admin/user-management" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />
          &nbsp;
          <span className="d-none d-md-inline">Back</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  user: storeState.userManagement.user
});

const mapDispatchToProps = { getUser };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserManagementDetail);
