import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, InputGroup, Col, Row, Table, Card, Alert } from 'reactstrap';
import { AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import { openFile, getSortState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getSearchEntities, getEntities } from './security-token.reducer';
import { AUTHORITIES } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';

export interface ISecurityTokenProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const SecurityToken = (props: ISecurityTokenProps) => {
  const [search, setSearch] = useState('');
  const [paginationState, setPaginationState] = useState(getSortState(props.location, ITEMS_PER_PAGE));

  const isAdmin = props.account.authorities.includes(AUTHORITIES.ADMIN);
  const isBank = props.account.authorities.includes(AUTHORITIES.BANK);
  const isUser = props.account.authorities.includes(AUTHORITIES.USER);

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

  const { securityTokenList, match, loading, totalItems } = props;
  return (
    <Card className="bg-white p-3 mb-2">
      <h2 id="security-token-heading">
        Security Tokens
        {isAdmin && (
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
            <FontAwesomeIcon icon="plus" />
            &nbsp; Add Security Token
          </Link>
        )}
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
        {securityTokenList && securityTokenList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                {isAdmin && (
                  <th className="hand text-nowrap" onClick={sort('idRed')}>
                    Id Red <FontAwesomeIcon icon="sort" />
                  </th>
                )}
                <th className="hand text-nowrap" onClick={sort('name')}>
                  Name <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand text-nowrap" onClick={sort('symbol')}>
                  Symbol <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand text-nowrap" onClick={sort('category')}>
                  Category <FontAwesomeIcon icon="sort" />
                </th>
                {isAdmin && (
                  <>
                    <th className="hand text-nowrap" onClick={sort('issuerName')}>
                      Issuer Name <FontAwesomeIcon icon="sort" />
                    </th>
                    <th className="hand text-nowrap" onClick={sort('status')}>
                      Status <FontAwesomeIcon icon="sort" />
                    </th>
                  </>
                )}
                <th className="hand text-nowrap" onClick={sort('logo')}>
                  Logo <FontAwesomeIcon icon="sort" />
                </th>

                <th className="hand text-nowrap" onClick={sort('lastSellingprice')}>
                  Last Selling Price <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand text-nowrap" onClick={sort('lastBuyingPrice')}>
                  Last Buying Price <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {securityTokenList.map((securityToken, i) => (
                <tr key={`entity-${i}`}>
                  {isAdmin && <td>{securityToken.idRed}</td>}
                  <td>{securityToken.name}</td>
                  <td>{securityToken.symbol}</td>
                  <td>{securityToken.category}</td>
                  {isAdmin && (
                    <>
                      <td>{securityToken.issuerName}</td>
                      <td>{securityToken.status}</td>
                    </>
                  )}
                  <td>
                    {securityToken.logo ? (
                      <div>
                        <a onClick={openFile(securityToken.logoContentType, securityToken.logo)}>
                          <img src={`data:${securityToken.logoContentType};base64,${securityToken.logo}`} style={{ maxHeight: '30px' }} />
                          &nbsp;
                        </a>
                      </div>
                    ) : null}
                  </td>
                  {(isUser || isBank) && (
                    <>
                      <td>
                        <Alert color="danger" className="py-2 pl-4 w-75 m-auto">
                          <Link to={isUser ? `order/new/${securityToken.id}/SELL` : '#'} style={{ textDecoration: 'none' }}>
                            <div className="d-flex justify-content-center align-items-center ">
                              <h5 className="mr-3">{securityToken.lastSellingprice?.toLocaleString()}</h5>
                              <div className="d-flex flex-column">
                                <small>
                                  <b>SELL</b>
                                </small>
                                <small>CHF</small>
                              </div>
                            </div>
                          </Link>
                        </Alert>
                      </td>
                      <td>
                        <Alert color="success" className="py-2 px-4 w-75 m-auto">
                          <Link to={isUser ? `order/new/${securityToken.id}/BUY` : '#'} style={{ textDecoration: 'none' }}>
                            <div className="d-flex justify-content-center align-items-center">
                              <h5 className="mr-3">{securityToken.lastBuyingPrice?.toLocaleString()}</h5>
                              <span className="d-flex flex-column">
                                <small>
                                  <b>BUY</b>
                                </small>
                                <small>CHF</small>
                              </span>
                            </div>
                          </Link>
                        </Alert>
                      </td>
                    </>
                  )}
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${securityToken.id}${isAdmin || isBank ? '' : '/user'}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                      </Button>
                      {(isAdmin || isBank) && (
                        <>
                          <Button
                            tag={Link}
                            to={`${match.url}/${securityToken.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                            color="primary"
                            size="sm"
                          >
                            <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                          </Button>
                        </>
                      )}
                      {isAdmin && (
                        <Button
                          tag={Link}
                          to={`${match.url}/${securityToken.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                          color="danger"
                          size="sm"
                        >
                          <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Delete</span>
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && <div className="alert alert-warning">No Security Tokens found</div>
        )}
      </div>
      <div className={securityTokenList && securityTokenList.length > 0 ? '' : 'd-none'}>
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

const mapStateToProps = ({ securityToken, authentication }: IRootState) => ({
  securityTokenList: securityToken.entities,
  loading: securityToken.loading,
  totalItems: securityToken.totalItems,
  account: authentication.account
});

const mapDispatchToProps = {
  getSearchEntities,
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(SecurityToken);
