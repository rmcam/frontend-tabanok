import React from 'react';
import { AppSidebar } from '../navigation/app-sidebar';
import PageContainer from '../common/PageContainer';
import { SidebarProvider, SidebarTrigger } from '../ui/sidebar'; // Importar SidebarTrigger y SidebarProvider
 
 interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider> {/* Envolver el layout con SidebarProvider */}
      <div className="flex min-h-screen"> {/* Contenedor flex para sidebar y contenido, asegurar altura mínima */}
        <SidebarTrigger className="md:hidden fixed top-4 left-4 z-20" /> {/* Botón de hamburguesa para móvil */}
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <PageContainer>
            <div className="flex-1 px-4 sm:px-6 lg:px-8 py-4 overflow-y-auto"> {/* Ajustar padding horizontal y mantener padding vertical */}
              {children} {/* Renderizar el contenido de la página (Dashboard, etc.) */}
            </div>
          </PageContainer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AuthenticatedLayout;
