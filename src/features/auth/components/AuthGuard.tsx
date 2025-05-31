import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useVerifySession } from '../../../hooks/auth/auth.hooks';
import { useUserStore } from '../../../stores/userStore';
import { useAuthModalStore } from '../../../stores/authModalStore';

/**
 * Componente AuthGuard para proteger rutas.
 * Redirige a la página de inicio de sesión si el usuario no está autenticado.
 */
const AuthGuard: React.FC = () => {
  const { data: userProfile, isLoading, isError } = useVerifySession();
  const user = useUserStore((state) => state.user);
  const openAuthModal = useAuthModalStore((state) => state.openModal);

  useEffect(() => {
    if (!isLoading && (isError || !userProfile)) {
      openAuthModal();
    }
  }, [isLoading, isError, userProfile, openAuthModal]);

  if (isLoading) {
    // Podrías mostrar un spinner o un componente de carga aquí
    return <div>Cargando autenticación...</div>;
  }

  // Si no hay perfil de usuario o hay un error, redirigir al inicio de sesión
  if (isError || !userProfile) {
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }

  // Si el usuario está autenticado, renderizar las rutas hijas
  return <Outlet />;
};

export default AuthGuard;
