import React from 'react';
import { AppSidebar } from '../navigation/app-sidebar';
import PageContainer from '../common/PageContainer';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => {
  return (
    <div className="flex"> {/* Contenedor flex para sidebar y contenido */}
      <AppSidebar /> {/* Renderizar el sidebar */}
      <PageContainer> {/* Contenedor principal del contenido */}
        <div className="flex-1 p-4">
          {children} {/* Renderizar el contenido de la página (Dashboard, etc.) */}
        </div>
      </PageContainer>
    </div>
  );
};

export default AuthenticatedLayout;
