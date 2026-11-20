import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../../../app/hooks';

function ProtectedRoute(): React.JSX.Element {
  const location = useLocation();
  const authToken = useAppSelector((state) => state.auth?.tokens?.token);
  if (!authToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}

export default ProtectedRoute;
