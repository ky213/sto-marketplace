import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, Link } from 'react-router-dom';
import { Row } from 'reactstrap';
import { Button } from 'reactstrap';

import { getUser } from './user-management.reducer';
import { IRootState } from 'app/shared/reducers';
import { convertDateTimeFromServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
      <form className="col pb-5">
        <div className="form-goup mb-3">
          <label>Username</label>
          <input type="text" className="form-control" value={user.login} />
        </div>
        <div className="form-row">
          <div className="form-goup col-md-6">
            <label>first name</label>
            <input type="text" className="form-control" value={user.firstName} />
          </div>
          <div className="form-group col-md-6">
            <label>Last name</label>
            <input type="text" className="form-control" value={user.lastName} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-goup col-md-6">
            <label>Email</label>
            <input type="text" className="form-control" value={user.email} />
          </div>
          <div className="form-group col-md-6">
            <label>Phone</label>
            <input type="text" className="form-control" value={user.setting?.phoneNumber} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-goup col-md-6">
            <label>Date of Birth</label>
            <input type="text" className="form-control" value={convertDateTimeFromServer(user.setting?.dateOfBirth)} />
          </div>
          <div className="form-group col-md-6">
            <label>Nationality</label>
            <input type="text" className="form-control" value={user.setting?.nationality} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-goup col-md-6">
            <label>State</label>
            <input type="text" className="form-control" value={user.setting?.city} />
          </div>
          <div className="form-group col-md-6">
            <label>Country</label>
            <input type="text" className="form-control" value={user.setting?.country} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-goup col">
            <label>Bank Account</label>
            <input type="text" className="form-control" value={user.setting?.iban} />
          </div>
        </div>
        <div className="form-row my-3">
          <div className="form-goup col">
            <label>Ethereum Address </label>
            <input type="text" className="form-control" value={user.setting?.ethAddress} />
          </div>
        </div>
        <Button tag={Link} to="/admin/user-management" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />
          &nbsp;
          <span className="d-none d-md-inline">Back</span>
        </Button>
      </form>
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
