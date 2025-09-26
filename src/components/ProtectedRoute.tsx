import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRoles, UserRole } from '@/hooks/useRoles';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles?: UserRole[]; // if omitted, any authenticated user
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const { roles, loading: rolesLoading } = useRoles();

  if (loading || rolesLoading) return null;

  if (!user) return <Navigate to="/" replace />;

  if (!allowedRoles) return children;

  // If user exists but roles haven't loaded or are empty, wait a tick to avoid false redirects
  if (roles.length === 0) return null;

  const isAllowed = roles.includes('super_admin') || roles.some(r => allowedRoles.includes(r));
  return isAllowed ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
