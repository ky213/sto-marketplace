import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, InputGroup, Col, Row, Table, Card } from 'reactstrap';
import { AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import {
  ICrudSearchAction,
  ICrudGetAllAction,
  TextFormat,
  getSortState,
  IPaginationBaseState,
  JhiPagination,
  JhiItemCount
} from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getSearchEntities, getEntities } from './white-listing.reducer';
import { IWhiteListing } from 'app/shared/model/white-listing.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT, AUTHORITIES } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';

export interface IWhiteListingProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const WhiteListing = (props: IWhiteListingProps) => {
  const [search, setSearch] = useState('');
  const [paginationState, setPaginationState] = useState(getSortState(props.location, ITEMS_PER_PAGE));
  const { whiteListingList, match, loading, totalItems, account } = props;
  const isAdmin = account.authorities.includes(AUTHORITIES.ADMIN);
  const isBank = account.authorities.includes(AUTHORITIES.BANK);
  const userId = !isAdmin && !isBank ? account.id : null;

  const getAllEntities = () => {
    if (search) {
      props.getSearchEntities(
        search,
        paginationState.activePage - 1,
        paginationState.itemsPerPage,
        `${paginationState.sort},${paginationState.order}`,
        userId
      );
    } else {
      props.getEntities(
        paginationState.activePage - 1,
        paginationState.itemsPerPage,
        `${paginationState.sort},${paginationState.order}`,
        !isAdmin && !isBank
      );
    }
  };

  const startSearching = () => {
    if (search) {
      setPaginationState({
        ...paginationState,
        activePage: 1
      });
      props.getSearchEntities(
        search,
        paginationState.activePage - 1,
        paginationState.itemsPerPage,
        `${paginationState.sort},${paginationState.order}`,
        userId
      );
    }
  };

  const clear = () => {
    setSearch('');
    setPaginationState({
      ...paginationState,
      activePage: 1
    });
    props.getEntities();
  };

  const handleSearch = event => {
    event.persist();
    setSearch(event.target?.value);
  };

  const sortEntities = () => {
    getAllEntities();
    props.history.push(
      `${props.location.pathname}?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`
    );
  };

  useEffect(() => {
    sortEntities();
  }, [paginationState.activePage, paginationState.order, paginationState.sort, search]);

  const sort = p => () => {
    setPaginationState({
      ...paginationState,
      order: paginationState.order === 'asc' ? 'desc' : 'asc',
      sort: p
    });
  };

  const handlePagination = currentPage =>
    setPaginationState({
      ...paginationState,
      activePage: currentPage
    });

  return (
    <Card className="bg-white p-3 mb-2">
      {(isAdmin || isBank) && (
        <h2 id="white-listing-heading">
          White Listings
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
            <FontAwesomeIcon icon="plus" />
            &nbsp; Create new White Listing
          </Link>
        </h2>
      )}
      <Row>
        <Col sm="12">
          <AvForm onSubmit={startSearching}>
            <AvGroup>
              <InputGroup>
                <AvInput type="text" name="search" value={search} onChange={handleSearch} placeholder="Search" />
                <Button type="submit" className="input-group-addon">
                  <FontAwesomeIcon icon="search" />
                </Button>
                <Button type="reset" className="input-group-addon" onClick={clear}>
                  <FontAwesomeIcon icon="trash" />
                </Button>
              </InputGroup>
            </AvGroup>
          </AvForm>
        </Col>
      </Row>
      <div className="table-responsive">
        {whiteListingList && whiteListingList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand text-nowrap" onClick={sort('dateEvent')}>
                  Date Event <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand text-nowrap" onClick={sort('status')}>
                  Status <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand text-nowrap" onClick={sort('active')}>
                  Active <FontAwesomeIcon icon="sort" />
                </th>

                <th className="hand text-nowrap" onClick={sort('dateSynchBlk')}>
                  Synchronization Date <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand text-nowrap" onClick={sort('stName')}>
                  ST Name <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand text-nowrap" onClick={sort('securitytoken.name')}>
                  ST Name (old) <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand text-nowrap" onClick={sort('balance')}>
                  Balance <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand text-nowrap" onClick={sort('ethAddress')}>
                  Eth Address <FontAwesomeIcon icon="sort" />
                </th>
                {(isAdmin || isBank) && (
                  <th className="hand text-nowrap" onClick={sort('customerName')}>
                    Customer Name <FontAwesomeIcon icon="sort" />
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {whiteListingList.map((whiteListing, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <TextFormat type="date" value={whiteListing.dateEvent} format={APP_DATE_FORMAT} />
                  </td>
                  <td>{whiteListing.status}</td>
                  <td>{whiteListing.active ? 'true' : 'false'}</td>
                  <td>
                    <TextFormat type="date" value={whiteListing.dateSynchBlk} format={APP_DATE_FORMAT} />
                  </td>
                  <td>{whiteListing.stName}</td>
                  <td>{whiteListing.securitytoken.name}</td>
                  <td>{whiteListing.balance.toLocaleString()} CHF</td>
                  <td>{whiteListing.ethAddress}</td>
                  <td>{whiteListing.customerName}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${whiteListing.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                      </Button>
                      {(isAdmin || isBank) && (
                        <>
                          <Button
                            tag={Link}
                            to={`${match.url}/${whiteListing.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                            color="primary"
                            size="sm"
                          >
                            <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                          </Button>
                          <Button
                            tag={Link}
                            to={`${match.url}/${whiteListing.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                            color="danger"
                            size="sm"
                          >
                            <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Delete</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && <div className="alert alert-warning">No White Listings found</div>
        )}
      </div>
      <div className={whiteListingList && whiteListingList.length > 0 ? '' : 'd-none'}>
        <Row className="justify-content-center">
          <JhiItemCount page={paginationState.activePage} total={totalItems} itemsPerPage={paginationState.itemsPerPage} />
        </Row>
        <Row className="justify-content-center">
          <JhiPagination
            activePage={paginationState.activePage}
            onSelect={handlePagination}
            maxButtons={5}
            itemsPerPage={paginationState.itemsPerPage}
            totalItems={props.totalItems}
          />
        </Row>
      </div>
    </Card>
  );
};

const mapStateToProps = ({ whiteListing, authentication }: IRootState) => ({
  whiteListingList: whiteListing.entities,
  loading: whiteListing.loading,
  totalItems: whiteListing.totalItems,
  account: authentication.account
});

const mapDispatchToProps = {
  getSearchEntities,
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(WhiteListing);
