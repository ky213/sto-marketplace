import React from 'react';
import { NavLink } from 'react-router-dom';
import { Nav, NavItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { AUTHORITIES } from '../../../../config/constants';
import './menu.scss';

const Menu = ({ account, location }) => {
  const isAdmin = account.authorities.includes(AUTHORITIES.ADMIN);
  const isBank = account.authorities.includes(AUTHORITIES.BANK);
  const homeLink = isAdmin || isBank ? '/home-bank' : '/home-customer';

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
          Securiry token
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink to="/order" className="text-primary d-block pl-3 py-1" activeClassName="active-menu">
          <FontAwesomeIcon icon="box" className="mr-2" />
          Orders
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink to="/reporting" className="text-primary d-block pl-3 py-1" activeClassName="active-menu">
          <FontAwesomeIcon icon="file-signature" className="mr-2" />
          Reporting
        </NavLink>
      </NavItem>
      {(isAdmin || isBank) && (
        <NavItem>
          <NavLink to="/bank-info" className="text-primary d-block pl-3 py-1" activeClassName="active-menu">
            <FontAwesomeIcon icon="university" className="mr-2" />
            Bank info
          </NavLink>
        </NavItem>
      )}
      {(isAdmin || isBank) && (
        <NavItem>
          <NavLink to="/admin/user-management" className="text-primary d-block pl-3 py-1" activeClassName="active-menu">
            <FontAwesomeIcon icon="users" className="mr-2" />
            Users
          </NavLink>
        </NavItem>
      )}
      <NavItem>
        <NavLink to="/settings" className="text-primary d-block pl-3 py-1" activeClassName="active-menu">
          <FontAwesomeIcon icon="cogs" className="mr-2" /> Settings
        </NavLink>
      </NavItem>
    </Nav>
  );
};

export default Menu;
