import { useAuth } from "@/auth/hooks/useAuth";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { Suspense, lazy } from "react";
import { FaChartBar, FaFileAlt, FaTasks, FaImages, FaUsers } from "react-icons/fa"; // Import icons
import { Skeleton } from "@/components/ui/skeleton";

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
    <div className="container mx-auto px-2 sm:px-6 lg:px-8 py-10">
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
        <TabsList className="flex overflow-x-auto w-full justify-start gap-2 p-1">
          <TabsTrigger value="overview" className="flex-shrink-0 px-3 py-1 text-sm flex items-center gap-1"><FaChartBar className="text-base" aria-hidden="true" /> Resumen</TabsTrigger> {/* Add icon */}
          <TabsTrigger value="content" className="flex-shrink-0 px-3 py-1 text-sm flex items-center gap-1"><FaFileAlt className="text-base" aria-hidden="true" /> Gestión de Contenido</TabsTrigger> {/* Add icon */}
          <TabsTrigger value="activities" className="flex-shrink-0 px-3 py-1 text-sm flex items-center gap-1"><FaTasks className="text-base" aria-hidden="true" /> Gestión de Actividades</TabsTrigger> {/* Add icon */}
          <TabsTrigger value="multimedia" className="flex-shrink-0 px-3 py-1 text-sm flex items-center gap-1"><FaImages className="text-base" aria-hidden="true" /> Gestión Multimedia</TabsTrigger> {/* Add icon */}
          <TabsTrigger value="progress" className="flex-shrink-0 px-3 py-1 text-sm flex items-center gap-1"><FaUsers className="text-base" aria-hidden="true" /> Seguimiento y Reportes</TabsTrigger> {/* Add icon */}
        </TabsList>
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Suspense fallback={<Skeleton className="h-32 w-full" />}>
              <DashboardStatistics />
            </Suspense>
            <Suspense fallback={<Skeleton className="h-32 w-full" />}>
              <LatestActivities />
            </Suspense>
          </div>
        </TabsContent>
        <TabsContent value="content">
          <Suspense fallback={<Skeleton className="h-32 w-full" />}>
            <ContentManager />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-32 w-full" />}>
            <CategoryManager />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-32 w-full" />}>
            <TagManager />
          </Suspense>
        </TabsContent>
        <TabsContent value="activities">
          <Suspense fallback={<Skeleton className="h-32 w-full" />}>
            <ActivityCreator />
          </Suspense>
        </TabsContent>
        <TabsContent value="multimedia">
          <Suspense fallback={<Skeleton className="h-32 w-full" />}>
            <MultimediaUploadForm />
            <MultimediaGallery />
          </Suspense>
        </TabsContent>
        <TabsContent value="progress">
          <Suspense fallback={<Skeleton className="h-32 w-full" />}>
            <StudentProgress />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-32 w-full" />}>
            <ReportViewer />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnifiedDashboard;
