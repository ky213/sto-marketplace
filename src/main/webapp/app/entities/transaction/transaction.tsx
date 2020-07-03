import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, InputGroup, Col, Row, Table, Card } from 'reactstrap';
import { AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import { TextFormat, getSortState, JhiItemCount, JhiPagination } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getSearchEntities, getEntities, reset } from './transaction.reducer';
import { APP_DATE_FORMAT, AUTHORITIES } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';

export interface ITransactionProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Transaction = (props: ITransactionProps) => {
  const { transactionList, match, loading, totalItems, account } = props;
  const [search, setSearch] = useState('');
  const [paginationState, setPaginationState] = useState(getSortState(props.location, ITEMS_PER_PAGE));
  const [sorting, setSorting] = useState(false);
  const isAdmin = account.authorities.includes(AUTHORITIES.ADMIN);
  const isBank = account.authorities.includes(AUTHORITIES.BANK);
  const isUser = account.authorities.includes(AUTHORITIES.USER);

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

  const handlePagination = currentPage =>
    setPaginationState({
      ...paginationState,
      activePage: currentPage
    });

  return (
    <Card className="bg-white p-3 mb-2">
      <div>
        <h2 id="transaction-heading">Transactions</h2>
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
            {transactionList && transactionList.length > 0 ? (
              <Table responsive>
                <thead>
                  <tr>
                    {(isAdmin || isBank) && (
                      <th className="hand text-nowrap" onClick={sort('id')}>
                        ID <FontAwesomeIcon icon="sort" />
                      </th>
                    )}
                    <th className="hand text-nowrap" onClick={sort('idTx')}>
                      Id Tx <FontAwesomeIcon icon="sort" />
                    </th>
                    <th className="hand text-nowrap" onClick={sort('createDate')}>
                      Create Date <FontAwesomeIcon icon="sort" />
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
                    <th className="hand text-nowrap" onClick={sort('volume')}>
                      Volume <FontAwesomeIcon icon="sort" />
                    </th>
                    <th className="hand text-nowrap" onClick={sort('price')}>
                      Price <FontAwesomeIcon icon="sort" />
                    </th>
                    <th className="hand text-nowrap" onClick={sort('totalAmount')}>
                      Total Amount <FontAwesomeIcon icon="sort" />
                    </th>
                    {isUser && (
                      <>
                        <th className="hand text-nowrap" onClick={sort('buyerid')}>
                          Buyer Name <FontAwesomeIcon icon="sort" />
                        </th>
                        <th className="hand text-nowrap" onClick={sort('sellerid')}>
                          Seller Name <FontAwesomeIcon icon="sort" />
                        </th>
                      </>
                    )}
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {transactionList.map((transaction, i) => (
                    <tr key={`entity-${i}`}>
                      {(isAdmin || isBank) && (
                        <td>
                          <Button tag={Link} to={`${match.url}/${transaction.id}`} color="link" size="sm">
                            {transaction.id}
                          </Button>
                        </td>
                      )}
                      <td>{transaction.idTx}</td>
                      <td>
                        <TextFormat type="date" value={transaction.createDate} format={APP_DATE_FORMAT} />
                      </td>
                      <td>
                        <TextFormat type="date" value={transaction.closeDate} format={APP_DATE_FORMAT} />
                      </td>
                      <td>{transaction.securityTokenName}</td>
                      <td>{transaction.symbol}</td>
                      <td>{transaction.volume}</td>
                      <td className="text-nowrap">CHF {transaction.price?.toLocaleString()}</td>
                      <td className="text-right">{transaction.totalAmount}</td>
                      {isUser && (
                        <>
                          <td className="text-right">{transaction.buyerName}</td>
                          <td className="text-right">{transaction.sellerName}</td>
                        </>
                      )}
                      <td className="text-right">
                        <div className="btn-group flex-btn-group-container">
                          <Button tag={Link} to={`${match.url}/${transaction.id}`} color="info" size="sm">
                            <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              !loading && <div className="alert alert-warning">No Transactions found</div>
            )}
          </InfiniteScroll>
        </div>
      </div>
      <div className={transactionList && transactionList.length > 0 ? '' : 'd-none'}>
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

const mapStateToProps = ({ transaction, authentication }: IRootState) => ({
  transactionList: transaction.entities,
  loading: transaction.loading,
  totalItems: transaction.totalItems,
  links: transaction.links,
  entity: transaction.entity,
  updateSuccess: transaction.updateSuccess,
  account: authentication.account
});

const mapDispatchToProps = {
  getSearchEntities,
  getEntities,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Transaction);
