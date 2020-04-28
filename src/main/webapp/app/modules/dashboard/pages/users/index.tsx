import React from 'react';
import { Switch } from 'react-router-dom';

import UserSettings from 'app/entities/user-setting';
import PrivateRoute from 'app/shared/auth/private-route';

const Users = () => (
  <div className="bg-white p-2 ">
    <Switch>
      <PrivateRoute component={UserSettings} />
    </Switch>
  </div>
);

export default Users;
