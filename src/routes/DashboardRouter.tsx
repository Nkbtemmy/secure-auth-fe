// pages/DashboardRouter.tsx
import React from 'react';
import AdminDashboard from '../pages/AdminDashboard';
import UserDashboard from '../pages/UserDashboard';
import { getUserData } from '../utils/auth';

const DashboardRouter: React.FC = () => {
  const user = getUserData() as { role?: any };
  if (user.role.name === 'ADMIN' || user.role.name === 'SUPER_ADMIN') {
    return <AdminDashboard />;
  } else {
    return <UserDashboard />;
  }
};

export default DashboardRouter;
