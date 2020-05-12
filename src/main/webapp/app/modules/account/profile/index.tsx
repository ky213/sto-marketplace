import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card, CardHeader, CardBody, Progress } from 'reactstrap';
import { IRootState } from 'app/shared/reducers';
import { IUserSettingsProps } from '../settings/settings';
import moment from 'moment';
import { AUTHORITIES } from 'app/config/constants';

const Profile = ({ account }: IUserSettingsProps) => {
  const isBanker = account.authorities.includes(AUTHORITIES.BANK);
  const isUser = account.authorities.includes(AUTHORITIES.USER);

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
            {isUser && (
              <>
                <p className="text-muted mt-5 mb-1 pb-0">Risk level: {account.setting?.riskProfil}</p>
                <Progress
                  className="p-0 mt-2 mb-2"
                  color="primary"
                  value={account.setting?.riskProfil * 2 * 10}
                  style={{ height: '7px' }}
                />
              </>
            )}
          </CardBody>
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
              {(isUser || isBanker) && (
                <Col>
                  <small className="text-muted">Phone Number</small>
                  <p>{account.setting?.phoneNumber}</p>
                </Col>
              )}
            </Row>
            <Row>
              {isUser && (
                <>
                  <Col>
                    <small className="text-muted ">Date of Birth </small>
                    <p>{moment(account.setting?.dateOfBirth).format('LLL')}</p>
                  </Col>
                  <Col>
                    <small className="text-muted">Nationality</small>
                    <p>{account.setting?.nationality}</p>
                  </Col>
                </>
              )}
            </Row>
            <Row>
              {(isBanker || isUser) && (
                <>
                  <Col>
                    <small className="text-muted ">City</small>
                    <p>{account.setting?.city}</p>
                  </Col>
                  <Col>
                    <small className="text-muted">Country</small>
                    <p>{account.setting?.country}</p>
                  </Col>
                </>
              )}
            </Row>
            <Row>
              {isUser && (
                <>
                  <Col>
                    <small className="text-muted ">Address</small>
                    <p>{account.setting?.address}</p>
                  </Col>
                  <Col>
                    <small className="text-muted">Postal Code</small>
                    <p>{account.setting?.code}</p>
                  </Col>
                </>
              )}
            </Row>
            <Row>
              {isUser && (
                <>
                  <Col>
                    <small className="text-muted ">Bank Account</small>
                    <p>{account.setting?.iban}</p>
                  </Col>
                  <Col>
                    <small className="text-muted ">Ethereum Address</small>
                    <p>{account.setting?.ethAddress}</p>
                  </Col>
                </>
              )}
            </Row>
            <Row>
              {isBanker && (
                <Col>
                  <small className="text-muted">Position</small>
                  <p>{account.setting?.position}</p>
                </Col>
              )}
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
