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
            style={{ height: '70px', width: '70px', borderRadius: '50%' }}
            className="bg-secondary d-flex justify-content-center align-items-center "
          >
            <h4 className="text-center text-light m-0">1</h4>
          </div>
          <div style={{ height: '8px', width: '100px' }} className=" bg-secondary"></div>
          <div
            style={{ height: '70px', width: '70px', borderRadius: '50%' }}
            className="bg-secondary d-flex justify-content-center align-items-center "
          >
            <h4 className="text-center text-light m-0">2</h4>
          </div>
          <div style={{ height: '8px', width: '100px' }} className=" bg-secondary"></div>
          <div
            style={{ height: '70px', width: '70px', borderRadius: '50%' }}
            className="bg-primary d-flex justify-content-center align-items-center"
          >
            <h4 className="text-center text-light m-0">3</h4>
          </div>
        </div>
      </Row>
      <Row className="mt-2 justify-content-center">
        <h6 className="col text-right  text-secondary  ">Creation</h6>
        <h6 className="col text-nowrap text-center text-secondary pl-5 ">Due Deligence</h6>
        <h6 className="col text-center pr-5">
          <FontAwesomeIcon icon="check" /> Completed
        </h6>
      </Row>
    </div>
  );
};

export default State;
