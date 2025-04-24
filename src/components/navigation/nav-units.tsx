import { Link } from 'react-router-dom';
import {
  Folder,
} from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { useFetchUnits } from "@/hooks/useFetchUnits";

export function NavUnits() {
  const { units, loading, error } = useFetchUnits();

  if (loading) {
    return <div>Cargando unidades...</div>;
  }

  if (error) {
    console.error("Error al cargar las unidades:", error);
    return <div className="text-red-500">Error al cargar las unidades.</div>;
  }

  if (!units || units.length === 0) {
    return null;
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Unidades</SidebarGroupLabel>
      <SidebarMenu>
        {units.map((unit) => (
          <SidebarMenuItem key={unit.id}>
            <SidebarMenuButton asChild>
              <Link to={unit.url}>
                <Folder />
                <span>{unit.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
