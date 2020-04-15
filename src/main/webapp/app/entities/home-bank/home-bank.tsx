import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, InputGroup, Col, Row, Table } from 'reactstrap';
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
import { getSearchEntities, getEntities } from './home-bank.reducer';
import { IHomeBank } from 'app/shared/model/home-bank.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';

export interface IHomeBankProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const HomeBank = (props: IHomeBankProps) => {
  const [search, setSearch] = useState('');
  const [paginationState, setPaginationState] = useState(getSortState(props.location, ITEMS_PER_PAGE));

  const getAllEntities = () => {
    if (search) {
      props.getSearchEntities(
        search,
        paginationState.activePage - 1,
        paginationState.itemsPerPage,
        `${paginationState.sort},${paginationState.order}`
      );
    } else {
      props.getEntities(paginationState.activePage - 1, paginationState.itemsPerPage, `${paginationState.sort},${paginationState.order}`);
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
        `${paginationState.sort},${paginationState.order}`
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

  const handleSearch = event => setSearch(event.target.value);

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

  const { homeBankList, match, loading, totalItems } = props;
  return (
    <div>
      <h2 id="home-bank-heading">
        Home Banks
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus" />
          &nbsp; Create new Home Bank
        </Link>
      </h2>
      <Row>
        <Col sm="12">
          <AvForm onSubmit={startSearching}>
            <AvGroup>
              <InputGroup>
                <AvInput type="text" name="search" value={search} onChange={handleSearch} placeholder="Search" />
                <Button className="input-group-addon">
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
        {homeBankList && homeBankList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  ID <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('dateEvent')}>
                  Date Event <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('custodyBalance')}>
                  Custody Balance <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('totalUser')}>
                  Total User <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('volumeOrder')}>
                  Volume Order <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('totalRevenu')}>
                  Total Revenu <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('equityAllocation')}>
                  Equity Allocation <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('fundsAllocation')}>
                  Funds Allocation <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('realEstateAllocation')}>
                  Real Estate Allocation <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('derivativeAllocation')}>
                  Derivative Allocation <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  User <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {homeBankList.map((homeBank, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${homeBank.id}`} color="link" size="sm">
                      {homeBank.id}
                    </Button>
                  </td>
                  <td>
                    <TextFormat type="date" value={homeBank.dateEvent} format={APP_DATE_FORMAT} />
                  </td>
                  <td>{homeBank.custodyBalance}</td>
                  <td>{homeBank.totalUser}</td>
                  <td>{homeBank.volumeOrder}</td>
                  <td>{homeBank.totalRevenu}</td>
                  <td>{homeBank.equityAllocation}</td>
                  <td>{homeBank.fundsAllocation}</td>
                  <td>{homeBank.realEstateAllocation}</td>
                  <td>{homeBank.derivativeAllocation}</td>
                  <td>{homeBank.user ? homeBank.user.id : ''}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${homeBank.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${homeBank.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="primary"
                        size="sm"
                      >
                        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${homeBank.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="danger"
                        size="sm"
                      >
                        <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && <div className="alert alert-warning">No Home Banks found</div>
        )}
      </div>
      <div className={homeBankList && homeBankList.length > 0 ? '' : 'd-none'}>
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
    </div>
  );
};

const mapStateToProps = ({ homeBank }: IRootState) => ({
  homeBankList: homeBank.entities,
  loading: homeBank.loading,
  totalItems: homeBank.totalItems
});

const mapDispatchToProps = {
  getSearchEntities,
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(HomeBank);
