import React from 'react';
import { cn } from '@/lib/utils'; // Importar la función cn
import { AppSidebar } from '../navigation/app-sidebar';
import PageContainer from '../common/PageContainer';
import { SidebarProvider, useSidebar } from '../ui/sidebar'; // Importar SidebarProvider y useSidebar
import { MobileNavbar } from '../navigation/MobileNavbar'; // Importar MobileNavbar
 
 interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => {
  const { openMobile } = useSidebar(); // Obtener el estado openMobile del hook useSidebar
  return (
    <SidebarProvider> {/* Envolver el layout con SidebarProvider */}
      <div className="flex min-h-screen"> {/* Contenedor flex para sidebar y contenido, asegurar altura mínima */}
        <MobileNavbar /> {/* Añadir el navbar móvil */}
        <AppSidebar />
        <div className={cn("flex flex-col flex-1 overflow-hidden", openMobile ? "ml-[var(--sidebar-width-mobile)]" : "ml-0", "pt-12 md:pt-0")}> {/* Añadir margen izquierdo condicional y padding superior para el navbar móvil */}
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
