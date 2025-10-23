import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import BreadcrumbNav from '@/components/common/BreadcrumbNav'; // Importar BreadcrumbNav
import { BookOpen, Lightbulb } from 'lucide-react';
import { useDetailedUnit } from '@/hooks/learn/useDetailedUnit';
import { useModuleById } from '@/hooks/modules/modules.hooks'; // Importar useModuleById
import LearningLessonCard from '@/features/learn/components/LearningLessonCard';
import LearningTopicSection from '@/features/learn/components/LearningTopicSection';
import LearningExerciseItem from '@/features/learn/components/LearningExerciseItem';
import type { LearningUnit } from '@/types/learning'; // Importar LearningUnit
import type { Module } from '@/types/api'; // Importar Module
import { useProfile } from '@/hooks/auth/auth.hooks';
import { useGetProgressByUser } from '@/hooks/progress/progress.hooks';
import { useUnitProgress } from '@/hooks/learn/useUnitProgress'; // Nueva importación

const UnitDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { unitId } = useParams<{ unitId: string }>();

  const { data: userProfile } = useProfile();
  const userId = userProfile?.id;

  const { data: userProgress, isLoading: isLoadingProgress } = useGetProgressByUser(userId);

  const { unit, isLoading, error } = useDetailedUnit(unitId || '');

  // Obtener el módulo al que pertenece la unidad
  const moduleId = unit?.moduleId;
  const { data: moduleData, isLoading: isLoadingModule } = useModuleById(moduleId || '');
  const module: Module | null | undefined = moduleData;

  // Usar el nuevo hook para el cálculo de progreso
  const { unitProgress } = useUnitProgress(unit as LearningUnit, userProgress); // Forzar tipo a LearningUnit

  if (isLoading || isLoadingProgress || isLoadingModule) { // Incluir estado de carga del módulo
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <p className="text-lg">{t("Cargando unidad, módulo y progreso...")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-red-500">
        <p className="text-lg">{t("Error al cargar datos")}: {error.message}</p>
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-muted-foreground">
        <p className="text-lg">{t("Unidad no encontrada.")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-grow p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        {/* Breadcrumbs */}
        <BreadcrumbNav
          items={[
            { label: t("Camino de Aprendizaje"), path: "/learn" },
            ...(module ? [{ label: module.name, path: `/learn/module/${module.id}` }] : []),
            { label: unit.title, path: `/learn/unit/${unit.id}` },
          ]}
          className="mb-4"
        />
        <Card className="shadow-lg border-primary/20">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-primary">{unit.title}</CardTitle>
            <CardDescription>{unit.description}</CardDescription>
            {unit.level && (
              <p className="text-sm text-muted-foreground mt-1">
                {t("Nivel")}: <span className="font-semibold text-primary">{unit.level}</span>
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-lg text-muted-foreground">
              <span>{t("Puntos Requeridos")}: <span className="font-semibold text-primary">{unit.requiredPoints}</span></span>
              <span>{t("Progreso de la Unidad")}: <span className="font-semibold text-primary">{unitProgress}%</span></span>
            </div>
            <Progress value={unitProgress} className="w-full h-3" />
          </CardContent>
        </Card>
      </div>

      {/* Renderizar Lecciones */}
      {(unit.lessons && unit.lessons.length > 0) && (
        <>
          <h2 className="flex items-center text-3xl font-bold tracking-tight mb-8 text-secondary-foreground">
            <BookOpen className="mr-3 h-8 w-8 text-primary" /> {t("Lecciones de la Unidad")}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {unit.lessons.map((lesson, index) => {
              // Determinar si la lección anterior está completada
              const isPreviousLessonCompleted = index === 0 ? true : unit.lessons[index - 1]?.isCompleted || false;
              return (
                <React.Fragment key={lesson.id}>
                  <LearningLessonCard lesson={lesson} userProgress={userProgress} isPreviousLessonCompleted={isPreviousLessonCompleted} />
                  {/* Renderizar ejercicios de la lección si existen */}
                  {(lesson.exercises && lesson.exercises.length > 0) && (
                    <div className="col-span-full ml-8 space-y-2">
                      <h4 className="text-lg font-semibold text-secondary-foreground">{t("Ejercicios de la Lección")}</h4>
                      {lesson.exercises.map(exercise => {
                        const isCompleted = userProgress?.completedExerciseIds?.includes(exercise.id) || false;
                        return (
                          <LearningExerciseItem
                            key={exercise.id}
                            exercise={exercise}
                            isCompleted={isCompleted}
                          />
                        );
                      })}
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </>
      )}

      {/* Renderizar Tópicos y su Contenido */}
      {(unit.topics && unit.topics.length > 0 && userProgress) && (
        <>
          <h2 className="flex items-center text-3xl font-bold tracking-tight mb-8 text-secondary-foreground">
            <Lightbulb className="mr-3 h-8 w-8 text-primary" /> {t("Tópicos de la Unidad")}
          </h2>
          <div className="space-y-8">
            {unit.topics.map((topic, index) => {
              // Determinar si el tópico anterior está completado
              const isPreviousTopicCompleted = index === 0 ? true : unit.topics[index - 1]?.isCompleted || false;
              return (
                <LearningTopicSection key={topic.id} topic={topic} userProgress={userProgress} isPreviousTopicCompleted={isPreviousTopicCompleted} />
              );
            })}
          </div>
        </>
      )}

      {/* Mensaje si no hay lecciones ni tópicos */}
      {(!unit.lessons || unit.lessons.length === 0) && (!unit.topics || unit.topics.length === 0) && (
        <div className="col-span-full text-center text-muted-foreground mt-8 p-4 border rounded-lg bg-card shadow-lg">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary" />
          <p className="text-xl font-semibold mb-2">{t("¡Aún no hay contenido en esta unidad!")}</p>
          <p>{t("Parece que esta unidad está vacía. Por favor, contacta al administrador para que añada contenido.")}</p>
        </div>
      )}
    </div>
  );
};

export default UnitDetailPage;
