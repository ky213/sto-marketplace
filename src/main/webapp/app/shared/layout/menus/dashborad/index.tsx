import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Nav, NavItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getEntities } from 'app/entities/bank-info/bank-info.reducer';
import { AUTHORITIES } from 'app/config/constants';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import './menu.scss';

const Menu = ({ account, totalBankItems, getBanks }) => {
  const isAdmin = account.authorities.includes(AUTHORITIES.ADMIN);
  const isBank = account.authorities.includes(AUTHORITIES.BANK);
  const homeLink = isAdmin || isBank ? '/home-bank' : '/home-customer';
  const bankInfoLink = totalBankItems ? `/bank-info/1/${isAdmin || isBank ? 'edit' : ''}` : `/bank-info/${isAdmin || isBank ? 'new' : '1'}`;

  useEffect(() => {
    getBanks();
  }, []);

  return (
    <Nav vertical>
      <NavItem>
        <NavLink to={homeLink} className="text-primary d-block pl-3 py-1" activeClassName="active-menu">
          <FontAwesomeIcon icon="tachometer-alt" className="mr-2" /> Home
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink to="/security-token" className="text-primary d-block pl-3 py-1" activeClassName="active-menu">
          <FontAwesomeIcon icon="file-invoice-dollar" className="mr-2" />
          Securiry Token
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink to="/order" className="text-primary d-block pl-3 py-1" activeClassName="active-menu">
          <FontAwesomeIcon icon="box" className="mr-2" />
          Orders
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink to="/transaction" className="text-primary d-block pl-3 py-1" activeClassName="active-menu">
          <FontAwesomeIcon icon="file-signature" className="mr-2" />
          Reporting
        </NavLink>
      </NavItem>

      <NavItem>
        <NavLink to={bankInfoLink} className="text-primary d-block pl-3 py-1" activeClassName="active-menu">
          <FontAwesomeIcon icon="university" className="mr-2" />
          Bank info
        </NavLink>
      </NavItem>

      {(isAdmin || isBank) && (
        <>
          <NavItem>
            <NavLink to="/admin/user-management" className="text-primary d-block pl-3 py-1" activeClassName="active-menu">
              <FontAwesomeIcon icon="users" className="mr-2" />
              Users
            </NavLink>
          </NavItem>
        </>
      )}
      <NavItem>
        <NavLink to="/white-listing" className="text-primary d-block pl-3 py-1" activeClassName="active-menu">
          <FontAwesomeIcon icon="user-shield" className="mr-2" />
          White Listing
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink to="/account/profile" className="text-primary d-block pl-3 py-1" activeClassName="active-menu">
          <FontAwesomeIcon icon="cogs" className="mr-2" /> Settings
        </NavLink>
      </NavItem>
    </Nav>
  );
};

const mapStateToProps = ({ bankInfo }: IRootState) => ({
  totalBankItems: bankInfo.totalItems
});

const mapDispatchToProps = {
  getBanks: getEntities
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
