import { Calendar, Home, Inbox, Search, Settings, LayoutDashboard, User, BookOpen, GraduationCap, BarChart, ShieldCheck, Globe, LogOut } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar, // Importar useSidebar
} from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/common/mode-toggle"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { CommandPalette } from "@/components/common/command-palette"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUserStore } from '@/stores/userStore'; // Importar useUserStore

// Menu items.
const navigationItems = [
  {
    group: "General",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard", // Asumiendo que el dashboard es una ruta principal
        icon: LayoutDashboard,
      },
      {
        title: "Home",
        url: "/", // La página de inicio
        icon: Home,
      },
      {
        title: "Inbox",
        url: "/inbox", // Ruta para la bandeja de entrada
        icon: Inbox,
      },
      {
        title: "Calendar",
        url: "/calendar", // Ruta para el calendario
        icon: Calendar,
      },
    ],
  },
  {
    group: "Aprendizaje",
    items: [
      {
        title: "Cursos",
        url: "/learn/courses", // Ruta para la sección de cursos
        icon: BookOpen,
      },
      {
        title: "Lecciones",
        url: "/learn/lessons", // Ruta para la sección de lecciones
        icon: GraduationCap,
      },
      {
        title: "Progreso",
        url: "/learn/progress", // Ruta para la sección de progreso
        icon: BarChart,
      },
    ],
  },
  {
    group: "Configuración",
    items: [
      {
        title: "Perfil",
        url: "/settings/profile", // Ruta para la configuración del perfil
        icon: User,
      },
      {
        title: "Seguridad",
        url: "/settings/security", // Ruta para la configuración de seguridad
        icon: ShieldCheck,
      },
      {
        title: "Ajustes",
        url: "/settings", // Ruta general de ajustes
        icon: Settings,
      },
    ],
  },
]

export function AppSidebar() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const { state: sidebarState } = useSidebar() // Obtener el estado del sidebar
  const user = useUserStore((state) => state.user); // Obtener el usuario del store

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  const handleLogout = () => {
    // Implement actual logout logic here
    console.log("Cerrar sesión")
    // Redirect to login page or home page after logout
    // navigate("/login");
  }

  const isSidebarCollapsed = sidebarState === "collapsed"

  // Determinar la URL del avatar
  const avatarSrc = user?.avatarUrl
    ? `${import.meta.env.VITE_API_URL}/multimedia/${user.avatarUrl}/file`
    : (user?.firstName && user?.lastName
      ? `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random&color=fff`
      : undefined);

  // Determinar el texto de fallback para el avatar
  const avatarFallbackText = user?.firstName && user?.lastName
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
    : (user?.username ? user.username.charAt(0) : '');

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <Link to="/" className="flex items-center gap-2 transition-all duration-300 hover:opacity-80">
          <h1 className={cn("text-xl font-bold", isSidebarCollapsed && "hidden")}>Tabanok</h1>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex flex-col">
        <div className="p-2">
          <CommandPalette>
            <Button variant="ghost" className="w-full justify-start transition-all duration-300">
              <Search className="h-5 w-5 mr-2" />
              <span className={cn(isSidebarCollapsed && "hidden")}>{t("Buscar")}</span>
            </Button>
          </CommandPalette>
        </div>
        <SidebarSeparator />
        <ScrollArea className="h-full flex-1">
          {navigationItems.map((group, index) => (
            <SidebarGroup key={group.group}>
              <SidebarGroupLabel className={cn("transition-opacity duration-300", isSidebarCollapsed && "opacity-0 h-0 p-0")}>
                {t(group.group)}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <TooltipProvider>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <SidebarMenuButton asChild>
                              <Link
                                to={item.url}
                                className={cn(
                                  "w-full flex items-center gap-2 transition-all duration-300",
                                  location.pathname === item.url && "bg-accent text-accent-foreground"
                                )}
                              >
                                <item.icon />
                                <span className={cn(isSidebarCollapsed && "hidden")}>{t(item.title)}</span>
                              </Link>
                            </SidebarMenuButton>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            {t(item.title)}
                          </TooltipContent>
                        </Tooltip>
                      </SidebarMenuItem>
                    ))}
                  </TooltipProvider>
                </SidebarMenu>
              </SidebarGroupContent>
              {index < navigationItems.length - 1 && <SidebarSeparator />}
            </SidebarGroup>
          ))}
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="py-4 space-y-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={cn("w-full h-auto p-2 transition-all duration-300", isSidebarCollapsed ? "justify-center" : "justify-start")}>
              <Avatar className={cn("h-8 w-8", !isSidebarCollapsed && "mr-2")}>
                <AvatarImage src={avatarSrc} alt={user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Usuario'} />
                <AvatarFallback>{avatarFallbackText}</AvatarFallback>
              </Avatar>
              <span className={cn("flex-1 text-left", isSidebarCollapsed && "hidden")}>{t(user?.firstName || "Usuario Invitado")}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="end">
            <DropdownMenuItem onClick={() => console.log("Ir a perfil")}>
              <User className="h-4 w-4 mr-2" />
              {t("Mi Perfil")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              {t("Cerrar Sesión")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={cn("w-full transition-all duration-300", isSidebarCollapsed ? "justify-center" : "justify-start")}>
              <Globe className={cn("h-5 w-5", !isSidebarCollapsed && "mr-2")} />
              <span className={cn(isSidebarCollapsed && "hidden")}>{t("Idioma")}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="end">
            <DropdownMenuItem onClick={() => changeLanguage("es")}>
              {t("Español")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLanguage("en")}>
              {t("English")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLanguage("kmt")}>
              {t("Kamentsa")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className={cn("w-full flex", isSidebarCollapsed ? "justify-center" : "justify-start")}>
          <ModeToggle />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
