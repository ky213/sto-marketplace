import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Table, Row, Col, InputGroup, Badge } from 'reactstrap';
import { TextFormat, JhiPagination, JhiItemCount, getSortState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { getUsers, updateUser } from './user-management.reducer';
import { IRootState } from 'app/shared/reducers';
import { getSearchEntities } from 'app/entities/user-setting/user-setting.reducer';

export interface IUserManagementProps extends StateProps, DispatchProps, RouteComponentProps<{}> {}

export const UserManagement = (props: IUserManagementProps) => {
  const [pagination, setPagination] = useState(getSortState(props.location, ITEMS_PER_PAGE));
  const [search, setSearch] = useState('');

  useEffect(() => {
    props.getUsers(pagination.activePage - 1, pagination.itemsPerPage, `${pagination.sort},${pagination.order}`);
    props.history.push(`${props.location.pathname}?page=${pagination.activePage}&sort=${pagination.sort},${pagination.order}`);
  }, [pagination]);

  const sort = p => () =>
    setPagination({
      ...pagination,
      order: pagination.order === 'asc' ? 'desc' : 'asc',
      sort: p
    });

  const handPagination = currentPage =>
    setPagination({
      ...pagination,
      activePage: currentPage
    });

  const startSearching = () => {
    if (search) {
      setPagination({
        ...pagination,
        activePage: 1
      });
      props.getSearchEntities(search, pagination.activePage - 1, pagination.itemsPerPage, `${pagination.sort},${pagination.order}`);
    }
  };

  const handleSearch = event => setSearch(event.target.value);

  const { users, account, match, totalItems } = props;
  return (
    <div>
      <h2 id="user-management-page-heading">
        Users
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity">
          <FontAwesomeIcon icon="plus" /> Create a new user
        </Link>
      </h2>

      <Row>
        <Col sm="12">
          <AvForm onSubmit={startSearching}>
            <AvGroup>
              <InputGroup>
                <AvInput type="text" name="search" value={search} onChange={handleSearch} placeholder="Search" />
                <Button className="ml-2 input-group-addon">Search</Button>
              </InputGroup>
            </AvGroup>
          </AvForm>
        </Col>
      </Row>

      <Table responsive striped>
        <thead>
          <tr>
            <th className="hand text-nowrap" onClick={sort('login')}>
              Username
              <FontAwesomeIcon icon="sort" className="ml-2" />
            </th>
            <th className="hand text-nowrap" onClick={sort('firstName')}>
              Name
              <FontAwesomeIcon icon="sort" className="ml-2" />
            </th>
            <th className="hand text-nowrap" onClick={sort('email')}>
              Email
              <FontAwesomeIcon icon="sort" className="ml-2" />
            </th>
            <th className="hand text-nowrap" onClick={sort('setting.city')}>
              City
              <FontAwesomeIcon icon="sort" className="ml-2" />
            </th>
            <th className="hand text-nowrap" onClick={sort('setting.country')}>
              Country
              <FontAwesomeIcon icon="sort" className="ml-2" />
            </th>
            <th> Phone</th>
            <th>Role</th>
            <th className="hand text-nowrap text-nowrap" onClick={sort('createdDate')}>
              Registration Date
              <FontAwesomeIcon icon="sort" className="ml-2" />
            </th>
            <th />
          </tr>
        </thead>
        <tbody>
          {users.map((user, i) => (
            <tr id={user.login} key={`user-${i}`}>
              <td>{user.login}</td>
              <td>
                {user.firstName} {user.lastName}
              </td>
              <td>{user.email}</td>
              <td>{user.setting?.city}</td>
              <td>{user.setting?.country}</td>
              <td>{user.setting?.phoneNumber}</td>
              <td>
                {user.authorities
                  ? user.authorities.map((authority, j) => (
                      <div key={`user-auth-${i}-${j}`}>
                        <Badge color="info">{authority}</Badge>
                      </div>
                    ))
                  : null}
              </td>
              <td>
                <TextFormat value={user.createdDate} type="date" format={APP_DATE_FORMAT} blankOnInvalid />
              </td>
              <td className="text-right">
                <div className="btn-group flex-btn-group-container">
                  <Button tag={Link} to={`${match.url}/${user.login}`} color="info" size="sm">
                    <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                  </Button>
                  <Button tag={Link} to={`${match.url}/${user.login}/edit`} color="primary" size="sm">
                    <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                  </Button>
                  <Button
                    tag={Link}
                    to={`${match.url}/${user.login}/delete`}
                    color="danger"
                    size="sm"
                    disabled={account.login === user.login}
                  >
                    <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Delete</span>
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className={users && users.length > 0 ? '' : 'd-none'}>
        <Row className="justify-content-center">
          <JhiItemCount page={pagination.activePage} total={totalItems} itemsPerPage={pagination.itemsPerPage} i18nEnabled />
        </Row>
        <Row className="justify-content-center">
          <JhiPagination
            activePage={pagination.activePage}
            onSelect={handPagination}
            maxButtons={5}
            itemsPerPage={pagination.itemsPerPage}
            totalItems={props.totalItems}
          />
        </Row>
      </div>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  users: storeState.userManagement.users,
  totalItems: storeState.userManagement.totalItems,
  account: storeState.authentication.account
});

const mapDispatchToProps = { getUsers, updateUser, getSearchEntities };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserManagement);
