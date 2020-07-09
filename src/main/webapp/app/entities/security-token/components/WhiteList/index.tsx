import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Card, CardHeader, CardBody, CardFooter, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { getUsersWhitelisted } from '../../security-token.reducer';

export interface WhitelistProps extends StateProps, DispatchProps {
  id: number;
}

function WhiteList(props: WhitelistProps) {
  useEffect(() => {
    if (props.id) props.getUsersWhitelisted(props.id);
  }, [props.id]);

  return (
    <Card className="p-0 h-100">
      <CardHeader className="py-3">Users Whitelisted </CardHeader>
      <CardBody className="p-0">
        <Table>
          <tbody>
            {props.usersWhitelisted.map(user => (
              <tr className="border-top-0" key={user.id}>
                <td className="d-flex border-top-0">
                  <div>
                    <p className="m-0" style={{ fontSize: '16px' }}>
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-muted m-0" style={{ fontSize: '12px' }}>
                      Risk level {user.setting.riskProfil}
                    </p>
                  </div>
                </td>
                <td className="text-right  border-top-0">
                  <Button color="none">
                    <FontAwesomeIcon icon="ellipsis-v" />
                  </Button>
                </td>
              </tr>
            ))}
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

const mapStateToProps = ({ securityToken }: IRootState) => ({
  usersWhitelisted: securityToken.usersWhitelisted
});

const mapDispatchToProps = {
  getUsersWhitelisted
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(WhiteList);
