import React from 'react';
import { Outlet } from 'react-router-dom';
import CompanySidebar from '../sidebar/CompanySidebar'; // 실제 경로에 맞게 조정

const CompanySidebarLayout = () => {
  return (
    <CompanySidebar>
      <Outlet />
    </CompanySidebar>
  );
};

export default CompanySidebarLayout;