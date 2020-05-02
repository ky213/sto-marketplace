import React from 'react';
import { Row, Table, Card, CardHeader, CardBody, CardFooter, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Tables = () => {
  return (
    <Row className="mt-3">
      <Card className="p-0 col-4">
        <CardHeader className="py-2">Latest Token Added</CardHeader>
        <CardBody className="p-0">
          <Table>
            <tbody>
              <tr className="border-top-0">
                <td className="d-flex border-top-0">
                  <div className="pr-3 d-flex align-items-center" style={{ fontSize: '35px' }}>
                    <FontAwesomeIcon icon="file-contract" />
                  </div>
                  <div>
                    <p className="m-0" style={{ fontSize: '16px' }}>
                      Token 1
                    </p>
                    <p className="text-muted m-0" style={{ fontSize: '12px' }}>
                      Updated 2 days ago
                    </p>
                  </div>
                </td>
                <td className="text-right  border-top-0">
                  <Button color="none">
                    <FontAwesomeIcon icon="eye" />
                  </Button>
                </td>
              </tr>
              <tr>
                <td className="d-flex">
                  <div className="pr-3 d-flex align-items-center" style={{ fontSize: '35px' }}>
                    <FontAwesomeIcon icon="file-contract" />
                  </div>
                  <div>
                    <p className="m-0" style={{ fontSize: '16px' }}>
                      Token 2
                    </p>
                    <p className="text-muted m-0" style={{ fontSize: '12px' }}>
                      Updated 2 days ago
                    </p>
                  </div>
                </td>
                <td className="text-right">
                  <Button color="none">
                    <FontAwesomeIcon icon="eye" />
                  </Button>
                </td>
              </tr>
              <tr>
                <td className="d-flex">
                  <div className="pr-3 d-flex align-items-center" style={{ fontSize: '35px' }}>
                    <FontAwesomeIcon icon="file-contract" />
                  </div>
                  <div>
                    <p className="m-0" style={{ fontSize: '16px' }}>
                      Token 3
                    </p>
                    <p className="text-muted m-0" style={{ fontSize: '12px' }}>
                      Updated 2 days ago
                    </p>
                  </div>
                </td>
                <td className="text-right">
                  <Button color="none">
                    <FontAwesomeIcon icon="eye" />
                  </Button>
                </td>
              </tr>
              <tr>
                <td className="d-flex">
                  <div className="pr-3 d-flex align-items-center" style={{ fontSize: '35px' }}>
                    <FontAwesomeIcon icon="file-contract" />
                  </div>
                  <div>
                    <p className="m-0" style={{ fontSize: '16px' }}>
                      Token 4
                    </p>
                    <p className="text-muted m-0" style={{ fontSize: '12px' }}>
                      Updated 2 days ago
                    </p>
                  </div>
                </td>
                <td className="text-right">
                  <Button color="none">
                    <FontAwesomeIcon icon="eye" />
                  </Button>
                </td>
              </tr>
              <tr>
                <td className="d-flex">
                  <div className="pr-3 d-flex align-items-center" style={{ fontSize: '35px' }}>
                    <FontAwesomeIcon icon="file-contract" />
                  </div>
                  <div>
                    <p className="m-0" style={{ fontSize: '16px' }}>
                      Token 5
                    </p>
                    <p className="text-muted m-0" style={{ fontSize: '12px' }}>
                      Updated 2 days ago
                    </p>
                  </div>
                </td>
                <td className="text-right">
                  <Button color="none">
                    <FontAwesomeIcon icon="eye" />
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </CardBody>
        <CardFooter className="d-flex p-0">
          <Button className="ml-auto" color="none ">
            <span className=" mr-2" style={{ fontSize: '14px' }}>
              view all
            </span>
            <FontAwesomeIcon icon="caret-right" />
          </Button>
        </CardFooter>
      </Card>
    </Row>
  );
};

export default Tables;
