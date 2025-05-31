
import React, { Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
// import { Navbar } from "./components/layout/navbar"; // Eliminar la importación del Navbar antiguo
import AuthModal from './features/auth/components/AuthModal';
import AuthGuard from './features/auth/components/AuthGuard';
import { useVerifySession } from './hooks/auth/auth.hooks';

// Importaciones de páginas con lazy loading
const LandingPage = React.lazy(() => import("./features/landing"));

const importLearnPage = () => import("./features/learn/pages/LearnPage");
const LearnPage = React.lazy(importLearnPage); // Importación explícita de la página

const ModuleDetailPage = React.lazy(() => import("./features/learn/pages/ModuleDetailPage")); // Nueva importación
const UnitDetailPage = React.lazy(() => import("./features/learn/pages/UnitDetailPage")); // Importación de UnitDetailPage

const importDashboardPage = () => import("./features/dashboard/pages/DashboardPage");
const DashboardPage = React.lazy(importDashboardPage);
const InboxPage = React.lazy(() => import("./features/inbox/pages/InboxPage"));
const CalendarPage = React.lazy(() => import("./features/calendar/pages/CalendarPage"));
const CoursesPage = React.lazy(() => import("./features/learn/pages/CoursesPage"));
const LessonsPage = React.lazy(() => import("./features/learn/pages/LessonsPage"));
const LessonDetailPage = React.lazy(() => import("./features/learn/pages/LessonDetailPage")); // Nueva importación
const ExerciseDetailPage = React.lazy(() => import("./features/learn/pages/ExerciseDetailPage")); // Nueva importación
const ProgressPage = React.lazy(() => import("./features/learn/pages/ProgressPage"));
const ProfilePage = React.lazy(() => import("./features/settings/pages/ProfilePage"));
const SecurityPage = React.lazy(() => import("./features/settings/pages/SecurityPage"));
const SettingsPage = React.lazy(() => import("./features/settings/pages/SettingsPage"));

/**
 * Componente principal de la aplicación que configura el enrutamiento
 * y la estructura básica del layout.
 * Utiliza lazy loading para cargar los componentes de página de forma asíncrona.
 *
 * @returns El componente App con las rutas y el layout configurados.
 */
function App() {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  const { data: userProfile, isLoading: isSessionLoading } = useVerifySession(); // Obtener estado de la sesión

  useEffect(() => {
    // Precargar componentes clave si el usuario está autenticado
    if (!isSessionLoading && userProfile) {
      // Precargar DashboardPage
      importDashboardPage();
      // Precargar LearnPage
      importLearnPage();
      // Puedes añadir más páginas aquí según la probabilidad de navegación
    }
  }, [isSessionLoading, userProfile]);

  return (
    <RootLayout isLandingPage={isLandingPage}>
      <div className="flex flex-col flex-grow">
        <Suspense fallback={<div>Cargando...</div>}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            {/* Rutas protegidas */}
            <Route element={<AuthGuard />}>
              <Route path="/learn" element={<LearnPage />} /> {/* Muestra todos los módulos */}
              <Route path="/learn/module/:moduleId" element={<ModuleDetailPage />} /> {/* Muestra las unidades de un módulo */}
              <Route path="/learn/unit/:unitId" element={<UnitDetailPage />} /> {/* Muestra las lecciones y ejercicios de una unidad */}
              {/* Las siguientes rutas se mantendrán por ahora, pero podrían necesitar páginas dedicadas en el futuro */}
              <Route path="/learn/lesson/:id" element={<LessonDetailPage />} /> {/* Usar LessonDetailPage */}
              <Route path="/learn/exercise/:id" element={<ExerciseDetailPage />} /> {/* Usar ExerciseDetailPage */}

              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/inbox" element={<InboxPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/learn/courses" element={<CoursesPage />} />
              <Route path="/learn/lessons" element={<LessonsPage />} />
              <Route path="/learn/progress" element={<ProgressPage />} />
              <Route path="/settings/profile" element={<ProfilePage />} />
              <Route path="/settings/security" element={<SecurityPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </Suspense>
      </div>
      <AuthModal /> {/* Renderizar AuthModal aquí */}
    </RootLayout>
  )
}

export default App
