import { useAuth } from "@/auth/hooks/useAuth";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { Suspense, lazy } from "react";

const ActivityCreator = lazy(() => import("./components/ActivityCreator"));
const CategoryManager = lazy(() => import("./components/CategoryManager"));
const ContentManager = lazy(() => import("./components/ContentManager"));
const DashboardStatistics = lazy(() => import("./components/DashboardStatistics"));
const LatestActivities = lazy(() => import("./components/LatestActivities"));
const MultimediaGallery = lazy(() => import("./components/MultimediaGallery"));
const MultimediaUploadForm = lazy(() => import("./components/MultimediaUploadForm"));
const ReportViewer = lazy(() => import("./components/ReportViewer"));
const StudentProgress = lazy(() => import("./components/StudentProgress"));
const TagManager = lazy(() => import("./components/TagManager"));


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

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="content">Gestión de Contenido</TabsTrigger>
          <TabsTrigger value="activities">Gestión de Actividades</TabsTrigger>
          <TabsTrigger value="multimedia">Gestión Multimedia</TabsTrigger>
          <TabsTrigger value="progress">Seguimiento y Reportes</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Suspense fallback={<div>Cargando estadísticas...</div>}>
              <DashboardStatistics />
            </Suspense>
            <Suspense fallback={<div>Cargando últimas actividades...</div>}>
              <LatestActivities />
            </Suspense>
          </div>
        </TabsContent>
        <TabsContent value="content">
          <Suspense fallback={<div>Cargando gestión de contenido...</div>}>
            <ContentManager />
          </Suspense>
          <Suspense fallback={<div>Cargando gestión de categorías...</div>}>
            <CategoryManager />
          </Suspense>
          <Suspense fallback={<div>Cargando gestión de etiquetas...</div>}>
            <TagManager />
          </Suspense>
        </TabsContent>
        <TabsContent value="activities">
          <Suspense fallback={<div>Cargando creador de actividades...</div>}>
            <ActivityCreator />
          </Suspense>
        </TabsContent>
        <TabsContent value="multimedia">
          <Suspense fallback={<div>Cargando gestión multimedia...</div>}>
            <MultimediaUploadForm />
            <MultimediaGallery />
          </Suspense>
        </TabsContent>
        <TabsContent value="progress">
          <Suspense fallback={<div>Cargando seguimiento de estudiantes...</div>}>
            <StudentProgress />
          </Suspense>
          <Suspense fallback={<div>Cargando reportes...</div>}>
            <ReportViewer />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnifiedDashboard;
