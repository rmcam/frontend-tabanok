import {
  Settings2,
  LayoutDashboard, // Añadido para Dashboard
  Folder, // Añadido para Unidades/Proyectos
  Activity, // Añadido para Actividades
  Film, // Añadido para Multimedia
  Award, // Añadido para Gamificación
} from "lucide-react";

// Datos estáticos para la navegación principal (ajustados a endpoints disponibles)
// Los datos de usuario, equipos y proyectos serán dinámicos
export const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard", // Asumiendo esta es la ruta del dashboard
      icon: LayoutDashboard,
      isActive: true, // Podría ser dinámico basado en la ruta actual
    },
    {
      title: "Unidades", // Renombrado de Projects
      url: "/units", // Asumiendo una ruta para listar unidades
      icon: Folder,
    },
    {
      title: "Actividades",
      url: "/activities", // Asumiendo una ruta para listar actividades
      icon: Activity,
    },
    {
      title: "Multimedia",
      url: "/multimedia",
      icon: Film,
    },
    {
      title: "Gamificación",
      url: "/gamification", // Asumiendo una ruta principal de gamificación
      icon: Award,
      items: [
        {
          title: "Leaderboard",
          url: "/gamification/leaderboard",
        },
        {
          title: "Logros",
          url: "/gamification/achievements",
        },
        // Otros sub-items de gamificación si son necesarios
      ],
    },
    {
      title: "Settings",
      url: "/settings", // Asumiendo una ruta de configuración
      icon: Settings2,
      items: [
        {
          title: "Perfil",
          url: "/settings/profile", // Usaría GET /auth/profile y PUT /auth/profile
        },
        // Otros sub-items de configuración si son necesarios
      ],
    },
    {
      title: "Panel Docente",
      url: "/teacher-dashboard", // Asumiendo esta es la ruta del dashboard
      icon: Settings2,
    },
  ],
  // user, teams, projects data will be fetched dynamically
};
