import { Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/common/PrivateRoute";
import HomePage from "./components/home/HomePage";
import AuthenticatedLayout from "./components/layout/AuthenticatedLayout";
import MultimediaPage from "./components/multimedia/MultimediaPage";
import { SidebarProvider } from "./components/ui/sidebar";
import UnifiedDashboard from "./components/dashboard/Dashboard";

function App() {
  return (
    <SidebarProvider>
      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute requiredRoles={["user", "student", "teacher"]}>
              <AuthenticatedLayout>
                <UnifiedDashboard />
              </AuthenticatedLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/unauthorized"
          element={<div>Acceso no autorizado</div>}
        />
        <Route
          path="/teacher-dashboard"
          element={
            <PrivateRoute requiredRoles={["teacher"]}>
              <Navigate to="/dashboard" />
            </PrivateRoute>
          }
        />
        <Route
          path="/multimedia"
          element={
            <PrivateRoute requiredRoles={["user", "student", "teacher"]}>
              <AuthenticatedLayout>
                <MultimediaPage />
              </AuthenticatedLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/units"
          element={
            <PrivateRoute requiredRoles={["user", "student", "teacher"]}>
              <AuthenticatedLayout>
                <div>Unidades</div>
              </AuthenticatedLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/activities"
          element={
            <PrivateRoute requiredRoles={["user", "student", "teacher"]}>
              <AuthenticatedLayout>
                <div>Actividades</div>
              </AuthenticatedLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/gamification"
          element={
            <PrivateRoute requiredRoles={["user", "student", "teacher"]}>
              <AuthenticatedLayout>
                <div>Gamificación</div>
              </AuthenticatedLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute requiredRoles={["user", "student", "teacher"]}>
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
