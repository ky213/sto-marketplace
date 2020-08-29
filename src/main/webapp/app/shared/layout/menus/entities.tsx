import React from 'react';
import MenuItem from 'app/shared/layout/menus/menu-item';
import { NavDropdown } from './menu-components';

export const EntitiesMenu = props => (
  <NavDropdown icon="th-list" name="Entities" id="entity-menu" style={{ maxHeight: '80vh', overflow: 'auto' }}>
    <MenuItem icon="asterisk" to="/home-bank">
      Home Bank
    </MenuItem>
    <MenuItem icon="asterisk" to="/home-customer">
      Home Customer
    </MenuItem>
    <MenuItem icon="asterisk" to="/security-token">
      Security Token
    </MenuItem>
    <MenuItem icon="asterisk" to="/user-setting">
      User Setting
    </MenuItem>
    <MenuItem icon="asterisk" to="/bank-info">
      Bank Info
    </MenuItem>
    <MenuItem icon="asterisk" to="/order">
      Order
    </MenuItem>
    <MenuItem icon="asterisk" to="/transaction">
      Transaction
    </MenuItem>
    <MenuItem icon="asterisk" to="/white-listing">
      White Listing
    </MenuItem>
    {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
  </NavDropdown>
);
