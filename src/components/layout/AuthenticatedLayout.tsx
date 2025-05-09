import React from 'react';
import { AppSidebar } from '../navigation/app-sidebar';
import PageContainer from '../common/PageContainer';
import { SidebarTrigger } from '../ui/sidebar'; // Importar SidebarTrigger
import { useIsMobile } from '@/hooks/use-mobile'; // Importar useIsMobile

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile(); // Detectar si es móvil

  return (
    <div className="flex min-h-screen"> {/* Contenedor flex para sidebar y contenido, asegurar altura mínima */}
      {!isMobile && <AppSidebar />} {/* Renderizar el sidebar solo si NO es móvil */}
      <div className="flex flex-col flex-1 overflow-hidden"> {/* Contenedor principal del contenido, permitir desbordamiento horizontal */}
        {isMobile && ( // Mostrar el trigger solo en móviles
          <div className="p-2">
             <SidebarTrigger />
          </div>
        )}
        <PageContainer> {/* Contenedor de la página */}
          <div className="flex-1 p-4 overflow-y-auto"> {/* Permitir desbordamiento vertical si es necesario */}
            {children} {/* Renderizar el contenido de la página (Dashboard, etc.) */}
          </div>
        </PageContainer>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
