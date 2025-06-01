import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton'; // Importar Skeleton
import BreadcrumbNav from '@/components/common/BreadcrumbNav';
import { ArrowLeft, ArrowRight, BookOpen, Lightbulb } from 'lucide-react';
import { useLessonById } from '@/hooks/lessons/lessons.hooks';
import { useUnityById } from '@/hooks/unities/unities.hooks';
import { useModuleById } from '@/hooks/modules/modules.hooks';
import LearningContentRenderer from '@/features/learn/components/LearningContentRenderer';
import LearningExerciseItem from '@/features/learn/components/LearningExerciseItem';
import { useProfile } from '@/hooks/auth/auth.hooks';
import { useGetProgressByUser } from '@/hooks/progress/progress.hooks';
import type { LearningContent } from '@/types/learning'; // Importar LearningLesson

const LessonDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { id: lessonId } = useParams<{ id: string }>();

  const { data: userProfile } = useProfile();
  const userId = userProfile?.id;

  const { data: userProgress, isLoading: isLoadingProgress } = useGetProgressByUser(userId);

  const { data: lesson, isLoading: isLoadingLesson, error: lessonError } = useLessonById(lessonId || '');

  // Obtener la unidad y el módulo padre para los breadcrumbs
  const { data: unit, isLoading: isLoadingUnit } = useUnityById(lesson?.unityId || '');
  const { data: module, isLoading: isLoadingModule } = useModuleById(unit?.moduleId || '');

  if (isLoadingLesson || isLoadingProgress || isLoadingUnit || isLoadingModule) {
    return (
      <div className="flex flex-col flex-grow p-4 md:p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-4" /> {/* Skeleton para Breadcrumbs */}
          <Card className="shadow-lg border-primary/20">
            <CardHeader>
              <Skeleton className="h-8 w-3/4 mb-2" /> {/* Skeleton para CardTitle */}
              <Skeleton className="h-4 w-full" /> {/* Skeleton para CardDescription */}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-lg text-muted-foreground">
                <Skeleton className="h-4 w-1/4" /> {/* Skeleton para Puntos Requeridos */}
                <Skeleton className="h-4 w-1/4" /> {/* Skeleton para Progreso de la Lección */}
              </div>
              <Skeleton className="w-full h-3" /> {/* Skeleton para Barra de progreso */}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-10 w-32" /> {/* Skeleton para botón Lección Anterior */}
          <Skeleton className="h-10 w-32" /> {/* Skeleton para botón Siguiente Lección */}
        </div>

        <div className="mb-8">
          <Skeleton className="h-8 w-1/2 mb-8" /> {/* Skeleton para título Contenido de la Lección */}
          <Skeleton className="h-48 w-full" /> {/* Skeleton para LearningContentRenderer */}
        </div>

        <div className="mb-8">
          <Skeleton className="h-8 w-1/2 mb-8" /> {/* Skeleton para título Ejercicios de la Lección */}
          <div className="grid gap-4">
            <Skeleton className="h-24 w-full" /> {/* Skeleton para LearningExerciseItem */}
            <Skeleton className="h-24 w-full" /> {/* Skeleton para LearningExerciseItem */}
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <Skeleton className="h-10 w-40" /> {/* Skeleton para botón Volver a la Unidad */}
        </div>
      </div>
    );
  }

  if (lessonError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-red-500">
        <p className="text-lg">{t("Error al cargar la lección")}: {lessonError.message}</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-muted-foreground">
        <p className="text-lg">{t("Lección no encontrada.")}</p>
      </div>
    );
  }

  // Procesar el contenido de la lección para el renderizado
  const lessonContent: LearningContent | null = lesson.content ? {
    id: lesson.id, // Usar el ID de la lección como ID del contenido principal
    title: lesson.title,
    description: lesson.description,
    type: 'html', // Asumir que el contenido de la lección es HTML o texto
    content: lesson.content,
    multimedia: lesson.multimedia || [],
    isCompleted: false, // El estado de completado se maneja a nivel de lección/ejercicio
    isLocked: false, // El estado de bloqueo se maneja a nivel de lección
    progress: 0,
    unityId: lesson.unityId, // Añadir unityId
  } : null;

  return (
    <div className="flex flex-col flex-grow p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        {/* Breadcrumbs */}
        <BreadcrumbNav
          items={[
            { label: t("Camino de Aprendizaje"), path: "/learn" },
            ...(module ? [{ label: module.name, path: `/learn/module/${module.id}` }] : []),
            ...(unit ? [{ label: unit.title, path: `/learn/unit/${unit.id}` }] : []),
            { label: lesson.title, path: `/learn/lesson/${lesson.id}` },
          ]}
          className="mb-4"
        />
        <Card className="shadow-lg border-primary/20">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-primary">{lesson.title}</CardTitle>
            <CardDescription>{lesson.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-lg text-muted-foreground">
              <span>{t("Puntos Requeridos")}: <span className="font-semibold text-primary">{lesson.requiredPoints}</span></span>
              <span>{t("Progreso de la Lección")}: <span className="font-semibold text-primary">{lesson.progress}%</span></span>
            </div>
            <Progress value={lesson.progress} className="w-full h-3" /> {/* Barra de progreso */}
          </CardContent>
        </Card>
      </div>

      {/* Lógica para navegación entre lecciones */}
      {unit && (
        <div className="flex justify-between items-center mb-8">
          {/* Botón de Lección Anterior */}
          {(() => {
            if (!unit?.lessons) return null; // Si no hay unidad o lecciones, no renderizar
            const currentLessonIndex = unit.lessons.findIndex(l => l.id === lesson.id);
            const previousLesson = currentLessonIndex > 0 ? unit.lessons[currentLessonIndex - 1] : null;
            return (
              <Button asChild variant="outline" disabled={!previousLesson}>
                <Link to={previousLesson ? `/learn/lesson/${previousLesson.id}` : '#'}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> {t("Lección Anterior")}
                </Link>
              </Button>
            );
          })()}

          {/* Botón de Lección Siguiente */}
          {(() => {
            if (!unit?.lessons) return null; // Si no hay unidad o lecciones, no renderizar
            const currentLessonIndex = unit.lessons.findIndex(l => l.id === lesson.id);
            const nextLesson = currentLessonIndex < unit.lessons.length - 1 ? unit.lessons[currentLessonIndex + 1] : null;
            return (
              <Button asChild>
                <Link to={nextLesson ? `/learn/lesson/${nextLesson.id}` : '#'}>
                  {t("Siguiente Lección")} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            );
          })()}
        </div>
      )}

      {/* Contenido principal de la lección */}
      {lessonContent && (
        <div className="mb-8">
          <h2 className="flex items-center text-3xl font-bold tracking-tight mb-8 text-secondary-foreground">
            <BookOpen className="mr-3 h-8 w-8 text-primary" /> {t("Contenido de la Lección")}
          </h2>
          <LearningContentRenderer content={lessonContent} userProgress={userProgress} isLocked={lesson.isLocked} />
        </div>
      )}

      {/* Ejercicios de la lección */}
      {(lesson.exercises && lesson.exercises.length > 0) && (
        <div className="mb-8">
          <h2 className="flex items-center text-3xl font-bold tracking-tight mb-8 text-secondary-foreground">
            <Lightbulb className="mr-3 h-8 w-8 text-primary" /> {t("Ejercicios de la Lección")}
          </h2>
          <div className="grid gap-4">
            {lesson.exercises.map(exercise => {
              const isCompleted = userProgress?.completedExerciseIds?.includes(exercise.id) || false;
              return (
                <LearningExerciseItem
                  key={exercise.id}
                  exercise={exercise}
                  isCompleted={isCompleted}
                  isLocked={lesson.isLocked || exercise.isLocked}
                />
              );
            })}
          </div>
        </div>
      )}

      {(!lessonContent && (!lesson.exercises || lesson.exercises.length === 0)) && (
        <div className="col-span-full text-center text-muted-foreground mt-8 p-4 border rounded-lg bg-card shadow-lg">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary" />
          <p className="text-xl font-semibold mb-2">{t("¡Aún no hay contenido ni ejercicios en esta lección!")}</p>
          <p>{t("Parece que esta lección está vacía. Por favor, contacta al administrador para que añada contenido.")}</p>
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <Button asChild variant="outline">
          <Link to={unit ? `/learn/unit/${unit.id}` : '/learn'}>
            <ArrowLeft className="mr-2 h-4 w-4" /> {t("Volver a la Unidad")}
          </Link>
        </Button>
        {/* Aquí se podría añadir un botón para "Siguiente Lección" si se implementa la lógica de navegación secuencial */}
      </div>
    </div>
  );
};

export default LessonDetailPage;
