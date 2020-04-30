import React from 'react';
import { NavLink as Link } from 'react-router-dom';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { AUTHORITIES } from '../../../../config/constants';
import './menu.scss';

const Menu = ({ account, location }) => {
  const isAdmin = account.authorities.includes(AUTHORITIES.ADMIN);
  const isBank = account.authorities.includes(AUTHORITIES.BANK);
  const isUser = account.authorities.includes(AUTHORITIES.USER);
  const homeLink = isUser ? '/home-customer' : '/home-bank';

  return (
    <Nav vertical>
      <NavItem>
        <NavLink tag={Link} to={homeLink} className="text-primary">
          <FontAwesomeIcon icon="tachometer-alt" className="mr-2" /> Home
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink tag={Link} to="/security-token" className="text-primary">
          <FontAwesomeIcon icon="file-invoice-dollar" className="mr-2" />
          Securiry token
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink tag={Link} ink to="/order" className="text-primary">
          <FontAwesomeIcon icon="box" className="mr-2" />
          Orders
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink tag={Link} to="/reporting" className="text-primary">
          <FontAwesomeIcon icon="file-signature" className="mr-2" />
          Reporting
        </NavLink>
      </NavItem>
      {(isAdmin || isBank) && (
        <NavItem>
          <NavLink tag={Link} to="/bank-info" className="text-primary">
            <FontAwesomeIcon icon="university" className="mr-2" />
            Bank info
          </NavLink>
        </NavItem>
      )}
      {(isAdmin || isBank) && (
        <NavItem>
          <NavLink tag={Link} to="/user-setting" className="text-primary">
            <FontAwesomeIcon icon="users" className="mr-2" />
            Users
          </NavLink>
        </NavItem>
      )}
      <NavItem>
        <NavLink tag={Link} to="/settings" className="text-primary">
          <FontAwesomeIcon icon="cogs" className="mr-2" /> Settings
        </NavLink>
      </NavItem>
    </Nav>
  );
};

export default Menu;
