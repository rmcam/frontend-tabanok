import { Search, Globe, LogOut, User } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { navigationItems } from "@/config/navigation"
import { useLanguage } from "@/hooks/use-language"
import { useAuth } from "@/hooks/use-auth"
import { useTranslation } from "react-i18next" // Mantener useTranslation para t()

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

export function AppSidebar() {
  const { t } = useTranslation() // Solo t() es necesario aquí
  const location = useLocation()
  const { state: sidebarState } = useSidebar()
  const { changeLanguage } = useLanguage()
  const { handleLogout } = useAuth()

  // Mock user data for demonstration
  const user = {
    name: "Usuario Invitado",
    avatar: "https://github.com/shadcn.png", // Replace with actual user avatar
  }

  const isSidebarCollapsed = sidebarState === "collapsed"

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
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className={cn("flex-1 text-left", isSidebarCollapsed && "hidden")}>{t(user.name)}</span>
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
              {t("Inglés")}
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
