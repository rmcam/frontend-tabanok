import { lazy, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom'; // Eliminar useNavigate, importar Navigate
import { useAuth } from './auth/hooks/useAuth'; // Importar useAuth desde el hook
import PrivateRoute from './components/common/PrivateRoute';
import HomePage from './components/home/HomePage';
import AuthenticatedLayout from './components/layout/AuthenticatedLayout'; // Importar el nuevo layout
import { SidebarProvider } from './components/ui/sidebar';
import MultimediaPage from './components/multimedia/MultimediaPage';
// Importaciones dinámicas para code-splitting
const UnifiedDashboard = lazy(() => import('./components/dashboard/Dashboard'));
// import { SidebarTrigger } from './components/ui/sidebar';

function App() {
  const { loading } = useAuth(); // Obtener user y loading

  // Mostrar un indicador de carga o null mientras se verifica la autenticación inicial
  if (loading) {
    return <div>Cargando autenticación...</div>; // O un spinner, etc.
  }
  return (
    <SidebarProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute requiredRoles={['user', 'student']}>
              {' '}
              {/* Proteger ruta para roles user y student */}
              <AuthenticatedLayout>
                {' '}
                {/* Usar el layout autenticado */}
                <Suspense fallback={<div>Cargando contenido...</div>}>
                  {' '}
                  {/* Mover Suspense aquí */}
                  <UnifiedDashboard />
                </Suspense>
              </AuthenticatedLayout>
            </PrivateRoute>
          }
        />
        <Route path="/unauthorized" element={<div>Acceso no autorizado</div>} />
        <Route path="/teacher-dashboard" element={<Navigate to="/dashboard" />} />
        <Route
          path="/multimedia"
          element={
            <PrivateRoute requiredRoles={['user', 'student', 'teacher']}>
              <AuthenticatedLayout>
                <MultimediaPage />
              </AuthenticatedLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/units"
          element={
            <PrivateRoute requiredRoles={['user', 'student', 'teacher']}>
              <AuthenticatedLayout>
                <div>Unidades</div>
              </AuthenticatedLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/activities"
          element={
            <PrivateRoute requiredRoles={['user', 'student', 'teacher']}>
              <AuthenticatedLayout>
                <div>Actividades</div>
              </AuthenticatedLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/gamification"
          element={
            <PrivateRoute requiredRoles={['user', 'student', 'teacher']}>
              <AuthenticatedLayout>
                <div>Gamificación</div>
              </AuthenticatedLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute requiredRoles={['user', 'student', 'teacher']}>
              <AuthenticatedLayout>
                <div>Configuración</div>
              </AuthenticatedLayout>
            </PrivateRoute>
          }
        />
        {/* Ruta para acceso no autorizado */}
      </Routes>
    </SidebarProvider>
  );
}

export default App;
