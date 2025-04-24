import React from 'react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import ContentManager from './components/ContentManager';
import StudentProgress from './components/StudentProgress';
import ActivityCreator from './components/ActivityCreator';
import ReportViewer from './components/ReportViewer';
import MultimediaUploadForm from './components/MultimediaUploadForm';
import MultimediaGallery from './components/MultimediaGallery';
import { useAuth } from '@/auth/hooks/useAuth';

const UnifiedDashboard = () => {
  const { user } = useAuth();
  const isTeacher = user?.roles.includes('teacher');

  return (
    <div className="container mx-auto py-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Inicio</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">{isTeacher ? 'Panel Docente' : 'Dashboard'}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-3xl font-semibold mb-5">{isTeacher ? 'Panel Docente' : 'Dashboard'}</h1>

      {/* Herramientas para docentes */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Herramientas para docentes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">Creación de Contenido</h3>
            <p className="text-gray-700">Diseña lecciones y actividades interactivas.</p>
            <ActivityCreator />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Seguimiento de Estudiantes</h3>
            <p className="text-gray-700">Monitorea el progreso y genera reportes.</p>
            <StudentProgress />
            <ReportViewer />
          </div>
        </div>
      </section>

      {/* Multimedia */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Multimedia</h2>
        <p>Carga y gestiona recursos multimedia.</p>
        <MultimediaUploadForm />
        <MultimediaGallery />
      </section>

      {/* Evaluaciones Efectivas */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Evaluaciones Efectivas</h2>
        <ContentManager />
      </section>
    </div>
  );
};

export default UnifiedDashboard;
