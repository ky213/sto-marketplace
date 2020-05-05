import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card, CardHeader, CardFooter, Progress } from 'reactstrap';
import { IRootState } from 'app/shared/reducers';
import { IUserSettingsProps } from '../settings/settings';
import moment from 'moment';

const Profile = ({ account }: IUserSettingsProps) => {
  return (
    <Row className="mx-auto">
      <Card className="col-md-4 p-0">
        <div className="p-3">
          <h4>
            {account.firstName} {account.lastName}
          </h4>
          <p className="text-muted">
            {account.setting?.city}, {account.setting?.country} <br />
            {moment().format('LLL')}
          </p>

          <p className="text-muted mt-5 mb-1 pb-0">Risk level: {account.setting?.riskProfil}</p>
          <Progress className="p-0 mt-2 mb-2" color="primary" value="10" style={{ height: '7px' }} />
        </div>
        <CardFooter>Upgrade Risk</CardFooter>
      </Card>
      <Card className="col ml-3 p-0">
        <CardHeader>
          <h5 className="p-0 m-0">Profile</h5>
          <p className="text-muted p-0 m-0">your profile information</p>{' '}
        </CardHeader>
      </Card>
    </Row>
  );
};

const mapStateToProps = ({ authentication }: IRootState) => ({
  account: authentication.account
});

export default connect(mapStateToProps)(Profile);
