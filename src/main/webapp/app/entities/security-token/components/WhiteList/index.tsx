import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Card, CardHeader, CardBody, CardFooter, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function WhiteList(props) {
  return (
    <Card className="p-0 h-100">
      <CardHeader className="py-3">Users Whitelisted </CardHeader>
      <CardBody className="p-0">
        <Table>
          <tbody>
            <tr className="border-top-0">
              <td className="d-flex border-top-0">
                <div>
                  <p className="m-0" style={{ fontSize: '16px' }}>
                    User 1
                  </p>
                  <p className="text-muted m-0" style={{ fontSize: '12px' }}>
                    Risk level 4
                  </p>
                </div>
              </td>
              <td className="text-right  border-top-0">
                <Button color="none">
                  <FontAwesomeIcon icon="ellipsis-v" />
                </Button>
              </td>
            </tr>
            <tr>
              <td className="d-flex">
                <div>
                  <p className="m-0" style={{ fontSize: '16px' }}>
                    User 2
                  </p>
                  <p className="text-muted m-0" style={{ fontSize: '12px' }}>
                    Risk level 4
                  </p>
                </div>
              </td>
              <td className="text-right">
                <Button color="none">
                  <FontAwesomeIcon icon="ellipsis-v" />
                </Button>
              </td>
            </tr>
            <tr>
              <td className="d-flex">
                <div>
                  <p className="m-0" style={{ fontSize: '16px' }}>
                    User 3
                  </p>
                  <p className="text-muted m-0" style={{ fontSize: '12px' }}>
                    Risk level 4
                  </p>
                </div>
              </td>
              <td className="text-right">
                <Button color="none">
                  <FontAwesomeIcon icon="ellipsis-v" />
                </Button>
              </td>
            </tr>
            <tr>
              <td className="d-flex">
                <div>
                  <p className="m-0" style={{ fontSize: '16px' }}>
                    User 4
                  </p>
                  <p className="text-muted m-0" style={{ fontSize: '12px' }}>
                    Risk level 4
                  </p>
                </div>
              </td>
              <td className="text-right">
                <Button color="none">
                  <FontAwesomeIcon icon="ellipsis-v" />
                </Button>
              </td>
            </tr>
            <tr>
              <td className="d-flex">
                <div>
                  <p className="m-0" style={{ fontSize: '16px' }}>
                    User 5
                  </p>
                  <p className="text-muted m-0" style={{ fontSize: '12px' }}>
                    Risk level 4
                  </p>
                </div>
              </td>
              <td className="text-right">
                <Button color="none">
                  <FontAwesomeIcon icon="ellipsis-v" />
                </Button>
              </td>
            </tr>
          </tbody>
        </Table>
      </CardBody>
      <CardFooter className="d-flex p-0">
        <Button className="ml-auto" color="none ">
          <Link to="/white-listing">
            <span className="mr-2 text-primary" style={{ fontSize: '14px' }}>
              view all <FontAwesomeIcon icon="caret-right" />
            </span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default WhiteList;
