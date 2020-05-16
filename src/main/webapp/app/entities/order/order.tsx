import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, InputGroup, Col, Row, Table, Card, Badge } from 'reactstrap';
import { AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import { ICrudSearchAction, ICrudGetAllAction, TextFormat, getSortState, IPaginationBaseState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getSearchEntities, getEntities, reset } from './order.reducer';
import { IOrder } from 'app/shared/model/order.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT, AUTHORITIES } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import OrderExportDialog from './components/OrderExport';

export interface IOrderProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Order = (props: IOrderProps) => {
  const [search, setSearch] = useState('');
  const [paginationState, setPaginationState] = useState(getSortState(props.location, ITEMS_PER_PAGE));
  const [sorting, setSorting] = useState(false);
  const [exportOrders, setExportOrders] = useState(false);
  const isAdmin = props.account.authorities.includes(AUTHORITIES.ADMIN);
  const isBank = props.account.authorities.includes(AUTHORITIES.BANK);

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

  const orderStatus = {
    INIT: 'primary',
    PENDING: 'warning',
    SUCCESS: 'success',
    REMOVE: 'danger',
    FAIL: 'danger',
    NONE: 'info'
  };

  const filterOrders = order => {
    if (isAdmin || isBank) return order;
    if (order.user?.id === props.account.id) return order;
  };

  const { orderList, match, loading } = props;
  return (
    <Card className="bg-white p-3 mb-2">
      <OrderExportDialog open={exportOrders} setExportdialog={(status: boolean) => setExportOrders(status)} />
      <div>
        <h2 id="order-heading">
          Orders
          <Button color="primary" className="float-right ml-2" onClick={() => setExportOrders(true)}>
            <FontAwesomeIcon icon="download" />
            &nbsp; Export orders
          </Button>
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
                    <th className="hand text-nowrap" onClick={sort('refOrder')}>
                      Order Ref <FontAwesomeIcon icon="sort" />
                    </th>
                    <th></th>
                    <th className="hand text-nowrap" onClick={sort('securityTokenName')}>
                      Token <FontAwesomeIcon icon="sort" />
                    </th>
                    <th className="hand text-nowrap" onClick={sort('symbol')}>
                      Symbol <FontAwesomeIcon icon="sort" />
                    </th>
                    <th className="hand text-nowrap" onClick={sort('categoryToken')}>
                      Category <FontAwesomeIcon icon="sort" />
                    </th>

                    <th className="hand text-nowrap" onClick={sort('type')}>
                      Type <FontAwesomeIcon icon="sort" />
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
                    {(isAdmin || isBank) && (
                      <th className="text-nowrap" onClick={sort('user.login')}>
                        Username <FontAwesomeIcon icon="sort" />
                      </th>
                    )}
                    <th className="hand text-nowrap" onClick={sort('createDate')}>
                      Date <FontAwesomeIcon icon="sort" />
                    </th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {orderList.filter(filterOrders).map((order, i) => (
                    <tr key={`entity-${i}`}>
                      <td className="text-nowrap">{order.refOrder}</td>
                      <td>
                        <Badge color="none" className={`ml-3 btn btn-outline-${orderStatus[order.status]}`}>
                          {order.status.toLowerCase()}
                        </Badge>
                      </td>
                      <td>{order.securityTokenName}</td>
                      <td>{order.symbol}</td>
                      <td>{order.categoryToken}</td>
                      <td>{order.type}</td>
                      <td>{order.volume}</td>
                      <td className="text-nowrap">{order.price.toLocaleString()} CHF</td>
                      <td className="text-nowrap">{order.totalAmount.toLocaleString()} CHF</td>
                      {(isAdmin || isBank) && <td>{order.user ? order.user.login : ''}</td>}
                      <td>
                        <TextFormat type="date" value={order.createDate} format={APP_DATE_FORMAT} />
                      </td>

                      <td className="text-right">
                        <div className="btn-group flex-btn-group-container">
                          <Button tag={Link} to={`${match.url}/${order.id}`} color="info" size="sm">
                            <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                          </Button>
                          {(isAdmin || isBank) && (
                            <>
                              <Button tag={Link} to={`${match.url}/${order.id}/edit`} color="primary" size="sm">
                                <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                              </Button>
                              <Button tag={Link} to={`${match.url}/${order.id}/delete`} color="danger" size="sm">
                                <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Delete</span>
                              </Button>
                            </>
                          )}{' '}
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

const mapStateToProps = ({ order, authentication }: IRootState) => ({
  account: authentication.account,
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
