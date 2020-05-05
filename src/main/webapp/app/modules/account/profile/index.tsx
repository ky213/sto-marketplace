import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card, CardHeader, CardBody, CardFooter, Progress, NavLink } from 'reactstrap';
import { IRootState } from 'app/shared/reducers';
import { IUserSettingsProps } from '../settings/settings';
import moment from 'moment';

const Profile = ({ account }: IUserSettingsProps) => {
  return (
    <Row className="mx-auto">
      <Col md="4" className="p-0">
        <Card className="p-0">
          <CardBody className="p-3">
            <h4>
              {account.firstName} {account.lastName}
            </h4>
            <p className="text-muted">
              {account.setting?.city}, {account.setting?.country} <br />
              {moment().format('LLL')}
            </p>

            <p className="text-muted mt-5 mb-1 pb-0">Risk level: {account.setting?.riskProfil || 0}</p>
            <Progress className="p-0 mt-2 mb-2" color="primary" value={account.setting?.riskProfil || 0} style={{ height: '7px' }} />
          </CardBody>
          <CardFooter>
            <NavLink to="#" className="p-1">
              Upgrade Risk
            </NavLink>
          </CardFooter>
        </Card>
      </Col>
      <Col className=" ml-3 p-0">
        <Card className=" p-0">
          <CardHeader>
            <h5 className="p-0 m-0">Profile</h5>
            <p className="text-muted p-0 m-0">your account information</p>
          </CardHeader>
          <CardBody>
            <Row>
              <Col>
                <small className="text-muted ">First Name</small>
                <p>{account.firstName}</p>
              </Col>
              <Col>
                <small className="text-muted">Last Name</small>
                <p>{account.lastName}</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-muted ">Email Address</small>
                <p>{account.email}</p>
              </Col>
              <Col>
                <small className="text-muted">Phone Number</small>
                <p>{account.setting?.phoneNumber}</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-muted ">Date of Birth </small>
                <p>{moment(account.setting?.dateOfBirth).format('LLL')}</p>
              </Col>
              <Col>
                <small className="text-muted">Nationality</small>
                <p>{account.setting?.nationality}</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-muted ">City</small>
                <p>{account.setting?.city}</p>
              </Col>
              <Col>
                <small className="text-muted">Country</small>
                <p>{account.setting?.country}</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-muted ">Bank Account</small>
                <p>{account.setting?.iban}</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <small className="text-muted ">Ethereum Address</small>
                <p>{account.setting?.ethAddress}</p>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ authentication }: IRootState) => ({
  account: authentication.account
});

export default connect(mapStateToProps)(Profile);
