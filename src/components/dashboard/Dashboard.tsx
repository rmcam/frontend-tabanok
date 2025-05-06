import { useAuth } from "@/auth/hooks/useAuth";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import React, { Suspense, lazy } from "react";
import ContentManager from "./components/ContentManager";
const StudentProgress = lazy(() => import("./components/StudentProgress"));
const ActivityCreator = lazy(() => import("./components/ActivityCreator"));
const ReportViewer = lazy(() => import("./components/ReportViewer"));
const MultimediaUploadForm = lazy(
  () => import("./components/MultimediaUploadForm")
);
const MultimediaGallery = lazy(() => import("./components/MultimediaGallery"));
const DashboardStatistics = lazy(
  () => import("./components/DashboardStatistics")
);
const LatestActivities = lazy(() => import("./components/LatestActivities"));

const UnifiedDashboard = () => {
  const { user } = useAuth();
  const isTeacher = user?.roles.includes("teacher");

  return (
    <div className="container mx-auto py-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Inicio</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">
              {isTeacher ? "Panel Docente" : "Dashboard"}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-3xl font-semibold mb-5">
        {isTeacher ? "Panel Docente" : "Dashboard"}
      </h1>

      {/* Estadísticas del dashboard */}
      <section className="mb-8">
        <Suspense fallback={<div>Cargando...</div>}>
          <DashboardStatistics />
        </Suspense>
      </section>

      {/* Herramientas para docentes */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">
          Herramientas para docentes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Creación de Contenido
            </h3>
            <p className="text-gray-700">
              Diseña lecciones y actividades interactivas.
            </p>
            <Suspense fallback={<div>Cargando...</div>}>
              <ActivityCreator />
            </Suspense>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Seguimiento de Estudiantes
            </h3>
            <p className="text-gray-700">
              Monitorea el progreso y genera reportes.
            </p>
            <Suspense fallback={<div>Cargando...</div>}>
              <StudentProgress />
            </Suspense>
            <Suspense fallback={<div>Cargando...</div>}>
              <ReportViewer />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Multimedia */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Multimedia</h2>
        <p>Carga y gestiona recursos multimedia.</p>
        <Suspense fallback={<div>Cargando...</div>}>
          <MultimediaUploadForm />
        </Suspense>
        <Suspense fallback={<div>Cargando...</div>}>
          <MultimediaGallery />
        </Suspense>
      </section>

      {/* Evaluaciones Efectivas */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Evaluaciones Efectivas</h2>
        <Suspense fallback={<div>Cargando...</div>}>
          <ContentManager />
        </Suspense>
      </section>

      {/* Últimas Actividades */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Últimas Actividades</h2>
        <Suspense fallback={<div>Cargando...</div>}>
          <LatestActivities />
        </Suspense>
      </section>
    </div>
  );
};

export default UnifiedDashboard;
