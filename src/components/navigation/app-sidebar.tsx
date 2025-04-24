import { useAuth } from '@/auth/hooks/useAuth';
import Loading from '@/components/common/Loading';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar';

import * as React from 'react';

import { NavMain } from './nav-main';
import { NavUnits } from './nav-units';
import { NavUser } from './nav-user';
import { data } from './sidebar-data';
import { useFetchUnits } from '@/hooks/useFetchUnits';
import { Button } from '@/components/ui/button';

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { user, loading: authLoading } = useAuth();
  const { loading: unitsLoading, error: unitsError, refetch } = useFetchUnits();

  if (authLoading || unitsLoading) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarContent>
          <Loading />
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    );
  }

  if (unitsError) {
    console.error('Error loading units:', unitsError);
    // Implementar un mejor manejo de errores, mostrando un mensaje más descriptivo.
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarContent>
          <div className="text-red-500">Error al cargar las unidades: {unitsError || 'Ocurrió un error. Por favor, inténtalo de nuevo.'}</div>
          <Button onClick={() => refetch()}>Recargar</Button>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    );
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="pb-4">
        <div className="font-bold text-xl p-2">Tabanok</div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={data.navMain.map((item) => {
            if (item.title === 'Dashboard') {
              return {
                ...item,
                title: user?.roles.includes('teacher') ? 'Panel Docente' : 'Dashboard',
              };
            }
            return item;
          })}
        />
        <NavUnits />
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter>
        <SidebarSeparator />
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
