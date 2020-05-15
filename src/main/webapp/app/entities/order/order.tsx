import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, InputGroup, Col, Row, Table, Card } from 'reactstrap';
import { AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import { ICrudSearchAction, ICrudGetAllAction, TextFormat, getSortState, IPaginationBaseState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getSearchEntities, getEntities, reset } from './order.reducer';
import { IOrder } from 'app/shared/model/order.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';

export interface IOrderProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Order = (props: IOrderProps) => {
  const [search, setSearch] = useState('');
  const [paginationState, setPaginationState] = useState(getSortState(props.location, ITEMS_PER_PAGE));
  const [sorting, setSorting] = useState(false);

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

  const resetAll = () => {
    props.reset();
    setPaginationState({
      ...paginationState,
      activePage: 1
    });
  };

  useEffect(() => {
    resetAll();
  }, []);

  const startSearching = () => {
    if (search) {
      props.reset();
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
    props.reset();
    setSearch('');
    setPaginationState({
      ...paginationState,
      activePage: 1
    });
    props.getEntities();
  };

  const handleSearch = event => setSearch(event.target.value);

  useEffect(() => {
    getAllEntities();
  }, [paginationState.activePage]);

  const handleLoadMore = () => {
    if (window.pageYOffset > 0) {
      setPaginationState({
        ...paginationState,
        activePage: paginationState.activePage + 1
      });
    }
  };

  useEffect(() => {
    if (sorting) {
      getAllEntities();
      setSorting(false);
    }
  }, [sorting, search]);

  const sort = p => () => {
    props.reset();
    setPaginationState({
      ...paginationState,
      activePage: 1,
      order: paginationState.order === 'asc' ? 'desc' : 'asc',
      sort: p
    });
    setSorting(true);
  };

  const { orderList, match, loading } = props;
  return (
    <Card className="bg-white p-3 mb-2">
      <div>
        <h2 id="order-heading">
          Orders
          <Link
            to={`/api/user-orders/export?beginDateParam=2020-05-12T01:00:00.147Z&endDateParam=2020-06-12T23:00:00.147Z&userId=1`}
            target="_self"
            className="btn btn-primary float-right ml-2"
          >
            <FontAwesomeIcon icon="download" />
            &nbsp; Export orders
          </Link>
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
            <FontAwesomeIcon icon="plus" />
            &nbsp; Create new Order
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
          <InfiniteScroll
            pageStart={paginationState.activePage}
            loadMore={handleLoadMore}
            hasMore={paginationState.activePage - 1 < props.links.next}
            loader={<div className="loader">Loading ...</div>}
            threshold={0}
            initialLoad={false}
          >
            {orderList && orderList.length > 0 ? (
              <Table responsive>
                <thead>
                  <tr>
                    <th className="hand text-nowrap" onClick={sort('id')}>
                      ID <FontAwesomeIcon icon="sort" />
                    </th>
                    <th className="hand text-nowrap" onClick={sort('idOrder')}>
                      Id Order <FontAwesomeIcon icon="sort" />
                    </th>
                    <th className="hand text-nowrap" onClick={sort('refOrder')}>
                      Ref Order <FontAwesomeIcon icon="sort" />
                    </th>
                    <th className="hand text-nowrap" onClick={sort('createDate')}>
                      Create Date <FontAwesomeIcon icon="sort" />
                    </th>
                    <th className="hand text-nowrap" onClick={sort('updateDate')}>
                      Update Date <FontAwesomeIcon icon="sort" />
                    </th>
                    <th className="hand text-nowrap" onClick={sort('closeDate')}>
                      Close Date <FontAwesomeIcon icon="sort" />
                    </th>
                    <th className="hand text-nowrap" onClick={sort('securityTokenName')}>
                      Security Token Name <FontAwesomeIcon icon="sort" />
                    </th>
                    <th className="hand text-nowrap" onClick={sort('symbol')}>
                      Symbol <FontAwesomeIcon icon="sort" />
                    </th>
                    <th className="hand text-nowrap" onClick={sort('type')}>
                      Type <FontAwesomeIcon icon="sort" />
                    </th>
                    <th className="hand text-nowrap" onClick={sort('limitOrMarket')}>
                      Limit Or Market <FontAwesomeIcon icon="sort" />
                    </th>
                    <th className="hand text-nowrap" onClick={sort('volume')}>
                      Volume <FontAwesomeIcon icon="sort" />
                    </th>
                    <th className="hand text-nowrap" onClick={sort('price')}>
                      Price <FontAwesomeIcon icon="sort" />
                    </th>
                    <th className="hand text-nowrap" onClick={sort('totalAmount')}>
                      Total Amount <FontAwesomeIcon icon="sort" />
                    </th>
                    <th className="hand text-nowrap" onClick={sort('categoryToken')}>
                      Category Token <FontAwesomeIcon icon="sort" />
                    </th>
                    <th className="hand text-nowrap" onClick={sort('status')}>
                      Status <FontAwesomeIcon icon="sort" />
                    </th>
                    <th className="hand text-nowrap" onClick={sort('active')}>
                      Active <FontAwesomeIcon icon="sort" />
                    </th>
                    <th className="text-nowrap">
                      User <FontAwesomeIcon icon="sort" />
                    </th>
                    <th className="text-nowrap">
                      Transaction <FontAwesomeIcon icon="sort" />
                    </th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {orderList.map((order, i) => (
                    <tr key={`entity-${i}`}>
                      <td>
                        <Button tag={Link} to={`${match.url}/${order.id}`} color="link" size="sm">
                          {order.id}
                        </Button>
                      </td>
                      <td>{order.idOrder}</td>
                      <td>{order.refOrder}</td>
                      <td>
                        <TextFormat type="date" value={order.createDate} format={APP_DATE_FORMAT} />
                      </td>
                      <td>
                        <TextFormat type="date" value={order.updateDate} format={APP_DATE_FORMAT} />
                      </td>
                      <td>
                        <TextFormat type="date" value={order.closeDate} format={APP_DATE_FORMAT} />
                      </td>
                      <td>{order.securityTokenName}</td>
                      <td>{order.symbol}</td>
                      <td>{order.type}</td>
                      <td>{order.limitOrMarket}</td>
                      <td>{order.volume}</td>
                      <td>{order.price}</td>
                      <td>{order.totalAmount}</td>
                      <td>{order.categoryToken}</td>
                      <td>{order.status}</td>
                      <td>{order.active ? 'true' : 'false'}</td>
                      <td>{order.user ? order.user.id : ''}</td>
                      <td>{order.transaction ? <Link to={`transaction/${order.transaction.id}`}>{order.transaction.id}</Link> : ''}</td>
                      <td className="text-right">
                        <div className="btn-group flex-btn-group-container">
                          <Button tag={Link} to={`${match.url}/${order.id}`} color="info" size="sm">
                            <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                          </Button>
                          <Button tag={Link} to={`${match.url}/${order.id}/edit`} color="primary" size="sm">
                            <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                          </Button>
                          <Button tag={Link} to={`${match.url}/${order.id}/delete`} color="danger" size="sm">
                            <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Delete</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              !loading && <div className="alert alert-warning">No Orders found</div>
            )}
          </InfiniteScroll>
        </div>
      </div>
    </Card>
  );
};

const mapStateToProps = ({ order }: IRootState) => ({
  orderList: order.entities,
  loading: order.loading,
  totalItems: order.totalItems,
  links: order.links,
  entity: order.entity,
  updateSuccess: order.updateSuccess
});

const mapDispatchToProps = {
  getSearchEntities,
  getEntities,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Order);
