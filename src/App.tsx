import { Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/common/PrivateRoute";
import HomePage from "./components/home/HomePage";
import AuthenticatedLayout from "./components/layout/AuthenticatedLayout";
import MultimediaPage from "./components/multimedia/MultimediaPage";
import { SidebarProvider } from "./components/ui/sidebar";
import UnifiedDashboard from "./components/dashboard/Dashboard";
import QuizActivity from "./components/activities/QuizActivity"; // Import QuizActivity
import MatchingActivity from "./components/activities/MatchingActivity"; // Import MatchingActivity
import FillInTheBlanksActivity from "./components/activities/FillInTheBlanksActivity"; // Import FillInTheBlanksActivity
import { useParams } from "react-router-dom"; // Import useParams

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
        {/* Route for QuizActivity */}
        <Route
          path="/activities/quiz/:activityId"
          element={
            <PrivateRoute requiredRoles={["student"]}> {/* Only students can access quizzes */}
              <AuthenticatedLayout>
                {/* Pass activityId from URL params to QuizActivity */}
                <QuizActivity activityId={useParams().activityId as string} />
              </AuthenticatedLayout>
            </PrivateRoute>
          }
        />
        {/* Route for MatchingActivity */}
        <Route
          path="/activities/matching/:activityId"
          element={
            <PrivateRoute requiredRoles={["student"]}> {/* Only students can access matching activities */}
              <AuthenticatedLayout>
                {/* Pass activityId from URL params to MatchingActivity */}
                <MatchingActivity activityId={useParams().activityId as string} />
              </AuthenticatedLayout>
            </PrivateRoute>
          }
        />
        {/* New route for FillInTheBlanksActivity */}
        <Route
          path="/activities/fill-in-the-blanks/:activityId"
          element={
            <PrivateRoute requiredRoles={["student"]}> {/* Only students can access fill-in-the-blanks activities */}
              <AuthenticatedLayout>
                {/* Pass activityId from URL params to FillInTheBlanksActivity */}
                <FillInTheBlanksActivity activityId={useParams().activityId as string} />
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
