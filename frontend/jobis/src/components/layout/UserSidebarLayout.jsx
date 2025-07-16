import React from 'react';
import { Outlet } from 'react-router-dom';
import UserSidebar from '../sidebar/UserSidebar';

const UserSidebarLayout = () => {
  return (
    <UserSidebar>
      <Outlet />
    </UserSidebar>
  );
};

export default UserSidebarLayout;