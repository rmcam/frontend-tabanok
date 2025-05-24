
import React, { Suspense } from 'react';
import { Routes, Route, useLocation } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import { Navbar } from "./components/layout/navbar";
import AuthModal from './features/auth/components/AuthModal'; // Importar AuthModal

const LandingPage = React.lazy(() => import("./features/landing"));
const LearnPage = React.lazy(() => import("./features/learn"));
const DashboardPage = React.lazy(() => import("./pages/dashboard"));
const InboxPage = React.lazy(() => import("./pages/inbox"));
const CalendarPage = React.lazy(() => import("./pages/calendar"));
const CoursesPage = React.lazy(() => import("./pages/courses"));
const LessonsPage = React.lazy(() => import("./pages/lessons"));
const ProgressPage = React.lazy(() => import("./pages/progress"));
const ProfilePage = React.lazy(() => import("./pages/profile"));
const SecurityPage = React.lazy(() => import("./pages/security"));
const SettingsPage = React.lazy(() => import("./pages/settings"));

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

  return (
    <RootLayout isLandingPage={isLandingPage}>
      <div className="flex flex-col flex-grow">
        {isLandingPage && <Navbar hideToggle={isLandingPage} isLandingPage={isLandingPage} />}
        <Suspense fallback={<div>Cargando...</div>}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/inbox" element={<InboxPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/lessons" element={<LessonsPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/security" element={<SecurityPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Suspense>
      </div>
      <AuthModal /> {/* Renderizar AuthModal aquí */}
    </RootLayout>
  )
}

export default App
