import { Calendar, Home, Inbox, LayoutDashboard, User, BookOpen, GraduationCap, BarChart, ShieldCheck, Settings } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface NavigationItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

interface NavigationGroup {
  group: string;
  items: NavigationItem[];
}

export const navigationItems: NavigationGroup[] = [
  {
    group: "General",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Home",
        url: "/",
        icon: Home,
      },
      {
        title: "Inbox",
        url: "/inbox",
        icon: Inbox,
      },
      {
        title: "Calendar",
        url: "/calendar",
        icon: Calendar,
      },
    ],
  },
  {
    group: "Aprendizaje",
    items: [
      {
        title: "Cursos",
        url: "/courses",
        icon: BookOpen,
      },
      {
        title: "Lecciones",
        url: "/lessons",
        icon: GraduationCap,
      },
      {
        title: "Progreso",
        url: "/progress",
        icon: BarChart,
      },
    ],
  },
  {
    group: "Configuración",
    items: [
      {
        title: "Perfil",
        url: "/profile",
        icon: User,
      },
      {
        title: "Seguridad",
        url: "/security",
        icon: ShieldCheck,
      },
      {
        title: "Ajustes",
        url: "/settings",
        icon: Settings,
      },
    ],
  },
]
