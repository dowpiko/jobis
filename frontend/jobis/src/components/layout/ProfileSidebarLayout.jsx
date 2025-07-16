import React from 'react';
import { Outlet } from 'react-router-dom';
import ProfileSidebar from '../sidebar/ProfileSidebar'; // 실제 경로에 맞게 조정

const ProfileSidebarLayout = () => {
  return (
    <ProfileSidebar>
      <Outlet />
    </ProfileSidebar>
  );
};

export default ProfileSidebarLayout;