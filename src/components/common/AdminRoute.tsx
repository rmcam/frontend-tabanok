import React from 'react';
import { useAuth } from '../../auth/hooks/useAuth';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user } = useAuth();

  if (!user?.roles.includes("admin")) {
    return null; // O puedes renderizar un mensaje de "no tienes permisos"
  }

  return <>{children}</>;
};

export default AdminRoute;