import React from 'react';
import { ISecurityToken } from 'app/shared/model/security-token.model';
import { Row } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const State = (props: ISecurityToken) => {
  return (
    <div className="mx-auto">
      <h5>State</h5>
      <Row>
        <div className="d-flex justify-content-center align-items-center w-100">
          <div
            style={{ height: '50px', width: '50px', borderRadius: '50%' }}
            className="bg-secondary d-flex justify-content-center align-items-center "
          >
            <h5 className="text-center text-light m-0">1</h5>
          </div>
          <div style={{ height: '5px', width: '100px' }} className=" bg-secondary"></div>
          <div
            style={{ height: '50px', width: '50px', borderRadius: '50%' }}
            className="bg-secondary d-flex justify-content-center align-items-center "
          >
            <h5 className="text-center text-light m-0">2</h5>
          </div>
          <div style={{ height: '5px', width: '100px' }} className=" bg-secondary"></div>
          <div
            style={{ height: '50px', width: '50px', borderRadius: '50%' }}
            className="bg-primary d-flex justify-content-center align-items-center"
          >
            <h5 className="text-center text-light m-0">3</h5>
          </div>
        </div>
      </Row>
      <Row className="mt-1 justify-content-center">
        <h6 className="col text-right  text-secondary pl-4">
          <div>Creation</div>
        </h6>
        <h6 className="col text-nowrap text-center text-secondary">
          <div style={{ marginLeft: '35px' }}>Due Deligence</div>
        </h6>
        <h6 className="col text-center pr-5">
          <div style={{ marginRight: '50px' }}>
            <FontAwesomeIcon icon="check" /> Completed
          </div>
        </h6>
      </Row>
    </div>
  );
};

export default State;
