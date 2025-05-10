import React, { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/common/PrivateRoute";
import HomePage from "./components/home/HomePage";
import AuthenticatedLayout from "./components/layout/AuthenticatedLayout";
import { SidebarProvider } from "./components/ui/sidebar";
import { useParams } from "react-router-dom"; // Import useParams

const UnifiedDashboard = lazy(() => import("./components/dashboard/Dashboard"));
const MultimediaPage = lazy(() => import("./components/multimedia/MultimediaPage"));
const UnitDetail = lazy(() => import("./components/units/UnitDetail"));
const QuizActivity = lazy(() => import("./components/activities/QuizActivity"));
const MatchingActivity = lazy(() => import("./components/activities/MatchingActivity"));
const FillInTheBlanksActivity = lazy(() => import("./components/activities/FillInTheBlanksActivity"));
const ProfilePage = lazy(() => import("./components/settings/ProfilePage")); // Import ProfilePage
const ActivitiesPage = lazy(() => import("./components/activities/ActivitiesPage")); // Import ActivitiesPage
const GamificationPage = lazy(() => import("./components/gamification/GamificationPage")); // Import GamificationPage
const LeaderboardPage = lazy(() => import("./components/gamification/LeaderboardPage")); // Import LeaderboardPage
const AchievementsPage = lazy(() => import("./components/gamification/AchievementsPage")); // Import AchievementsPage
const SettingsPage = lazy(() => import("./components/settings/SettingsPage")); // Import SettingsPage


function App() {
  return (
    <SidebarProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route
            path="/"
            element={<HomePage />}
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute requiredRoles={["user", "student", "teacher", "admin"]}> {/* Added 'admin' role */}
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
            path="/units/:unitId" // Modified route to include unitId parameter
            element={
              <PrivateRoute requiredRoles={["user", "student", "teacher"]}>
                <AuthenticatedLayout>
                  <UnitDetail /> {/* Render UnitDetail component */}
                </AuthenticatedLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/activities"
            element={
              <PrivateRoute requiredRoles={["user", "student", "teacher"]}>
                <AuthenticatedLayout>
                  <ActivitiesPage /> {/* Render ActivitiesPage component */}
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
                  {/* Pass activityId from URL params to ActivityComponent */}
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
                  <GamificationPage /> {/* Render GamificationPage component */}
                </AuthenticatedLayout>
              </PrivateRoute>
            }
          >
             {/* Nested route for Leaderboard */}
             <Route
              path="leaderboard"
              element={
                <PrivateRoute requiredRoles={["user", "student", "teacher"]}>
                   <AuthenticatedLayout> {/* Wrap with AuthenticatedLayout */}
                    <LeaderboardPage />
                  </AuthenticatedLayout>
                </PrivateRoute>
              }
            />
             {/* Nested route for Achievements */}
             <Route
              path="achievements"
              element={
                <PrivateRoute requiredRoles={["user", "student", "teacher"]}>
                   <AuthenticatedLayout> {/* Wrap with AuthenticatedLayout */}
                    <AchievementsPage />
                  </AuthenticatedLayout>
                </PrivateRoute>
              }
            />
          </Route>
          <Route
            path="/settings"
            element={
              <PrivateRoute requiredRoles={["user", "student", "teacher"]}>
                <AuthenticatedLayout>
                  <SettingsPage /> {/* Render SettingsPage component */}
                </AuthenticatedLayout>
              </PrivateRoute>
            }
          >
             <Route
              path="profile" // Nested route for profile
              element={
                <PrivateRoute requiredRoles={["user", "student", "teacher"]}>
                   <AuthenticatedLayout> {/* Wrap with AuthenticatedLayout */}
                    <ProfilePage />
                  </AuthenticatedLayout>
                </PrivateRoute>
              }
            />
          </Route>
          {/* Ruta para acceso no autorizado */}
        </Routes>
      </Suspense>
    </SidebarProvider>
  );
}

export default App;
