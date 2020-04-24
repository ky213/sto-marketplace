import React from 'react';
import { NavLink as Link } from 'react-router-dom';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { AUTHORITIES } from '../../../../config/constants';
import './menu.scss';

const Menu = props => {
  const { account, location } = props;
  const isAdmin = account.authorities.includes(AUTHORITIES.ADMIN);
  const isBank = account.authorities.includes(AUTHORITIES.BANK);
  const isUser = account.authorities.includes(AUTHORITIES.USER);

  return (
    <Nav vertical>
      <NavItem>
        <NavLink tag={Link} to="/dashboard/home" className="text-primary">
          <FontAwesomeIcon icon="tachometer-alt" className="mr-2" /> Home
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink tag={Link} to="/dashboard/security-token" className="text-primary">
          <FontAwesomeIcon icon="file-invoice-dollar" className="mr-2" />
          Securiry token
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink tag={Link} ink to="/dashboard/orders" className="text-primary">
          <FontAwesomeIcon icon="box" className="mr-2" />
          Orders
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink tag={Link} to="/dashboard/reporting" className="text-primary">
          <FontAwesomeIcon icon="file-signature" className="mr-2" />
          Reporting
        </NavLink>
      </NavItem>
      {(isAdmin || isBank) && (
        <NavItem>
          <NavLink tag={Link} to="/dashboard/bank-info" className="text-primary">
            <FontAwesomeIcon icon="university" className="mr-2" />
            Bank info
          </NavLink>
        </NavItem>
      )}
      {(isAdmin || isBank) && (
        <NavItem>
          <NavLink tag={Link} to="/dashboard/users" className="text-primary">
            <FontAwesomeIcon icon="users" className="mr-2" />
            Users
          </NavLink>
        </NavItem>
      )}
      <NavItem>
        <NavLink tag={Link} to="/dashboard/settings" className="text-primary">
          <FontAwesomeIcon icon="cogs" className="mr-2" /> Settings
        </NavLink>
      </NavItem>
    </Nav>
  );
};

export default Menu;
