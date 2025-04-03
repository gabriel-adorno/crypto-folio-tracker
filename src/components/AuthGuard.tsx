
import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthGuard: React.FC = () => {
  // Simply render the Outlet without any authentication checks
  return <Outlet />;
};

export default AuthGuard;
