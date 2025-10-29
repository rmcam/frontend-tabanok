import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import BreadcrumbNav from '@/components/common/BreadcrumbNav';
import { BookOpen } from 'lucide-react';
import { useModuleById } from '@/hooks/modules/modules.hooks';
import { useProfile } from '@/hooks/auth/auth.hooks';
import { useGetProgressByUser } from '@/hooks/progress/progress.hooks';
import LearningUnitCard from '@/features/learn/components/LearningUnitCard';
import type { LearningModule, LearningUnit, UserProgress } from '@/types/learning';
import type { Module } from '@/types/learning/learning.d'; // Importar Module del archivo correcto

const ModuleUnitsPage: React.FC = () => {
  const { t } = useTranslation();
  const { moduleId } = useParams<{ moduleId: string }>();

  const { data: userProfile } = useProfile();
  const userId = userProfile?.id;

  const { data: userProgress, isLoading: isLoadingProgress } = useGetProgressByUser(userId);

  const { data: moduleData, isLoading: isLoadingModule, error: moduleError } = useModuleById(moduleId || '');

  if (isLoadingModule || isLoadingProgress) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <p className="text-lg">{t("Cargando módulo y progreso...")}</p>
      </div>
    );
  }

  if (moduleError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-red-500">
        <p className="text-lg">{t("Error al cargar datos")}: {moduleError?.message}</p>
      </div>
    );
  }

  if (!moduleData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-muted-foreground">
        <p className="text-lg">{t("Módulo no encontrado.")}</p>
      </div>
    );
  }

  // Usar moduleData directamente, ya que ahora incluye las unidades y lecciones
  const module: LearningModule = {
    ...moduleData,
    units: (moduleData.unities || []).map((unity) => ({
      ...unity,
      lessons: (unity.lessons || []).map((lesson) => ({
        ...lesson,
        exercises: (lesson.exercises || []).map((exercise) => ({
          ...exercise,
          url: `/learn/exercise/${exercise.id}`, // URL por defecto para el ejercicio
          isCompleted: false, // Calcular esto en base al progreso del usuario
          isLocked: lesson.isLocked || false, // Heredar el bloqueo de la lección o false
          progress: 0, // Calcular esto en base al progreso del usuario
          lessonId: lesson.id, // Vincular el ejercicio a la lección
        })),
        multimedia: lesson.multimedia || [], // Asignar multimedia
        topics: lesson.topics || [], // Asignar tópicos
        url: `/learn/lesson/${lesson.id}`, // URL por defecto para la lección
        isCompleted: false, // Calcular esto en base al progreso del usuario
        isLocked: unity.isLocked || false, // Heredar el bloqueo de la unidad o false
        progress: 0, // Calcular esto en base al progreso del usuario
        difficulty: lesson.difficulty || 'normal', // Dificultad por defecto
      })),
      topics: unity.topics || [], // Asignar tópicos a la unidad
      url: `/learn/unit/${unity.id}`,
      isCompleted: false, // Calcular esto en base al progreso del usuario
      progress: 0, // Calcular esto en base al progreso del usuario
      level: unity.level || 'Básico', // Usar el nivel del backend o un valor por defecto
      isActive: true, // Asignar true por defecto
    })),
    url: `/learn/module/${moduleData.id}`,
    isCompleted: false, // Calcular esto en base al progreso de las unidades
    progress: 0, // Calcular esto en base al progreso de las unidades
  };

  // Calcular el progreso del módulo (simplificado por ahora)
  if (module.units.length > 0) {
    const completedUnits = module.units.filter(unit => unit.isCompleted).length;
    module.progress = (completedUnits / module.units.length) * 100;
  }


  return (
    <div className="flex flex-col flex-grow p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <BreadcrumbNav
          items={[
            { label: t("Camino de Aprendizaje"), path: "/learn" },
            { label: module.name, path: `/learn/module/${module.id}` },
          ]}
          className="mb-4"
        />
        <Card className="shadow-lg border-primary/20">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-primary">{module.name}</CardTitle>
            <CardDescription>{module.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-lg text-muted-foreground">
              <span>{t("Progreso del Módulo")}: <span className="font-semibold text-primary">{module.progress || 0}%</span></span>
            </div>
            <Progress value={module.progress || 0} className="w-full h-3" />
          </CardContent>
        </Card>
      </div>

      {/* Renderizar Unidades */}
      {(module.units && module.units.length > 0) ? (
        <>
          <h2 className="flex items-center text-3xl font-bold tracking-tight mb-8 text-secondary-foreground">
            <BookOpen className="mr-3 h-8 w-8 text-primary" /> {t("Unidades del Módulo")}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {module.units.map((unit: LearningUnit, index: number) => (
              <LearningUnitCard
                key={unit.id}
                unit={unit}
                userProgress={userProgress}
                isPreviousUnitCompleted={index === 0 ? true : module.units[index - 1]?.isCompleted || false}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="col-span-full text-center text-muted-foreground mt-8 p-4 border rounded-lg bg-card shadow-lg">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary" />
          <p className="text-xl font-semibold mb-2">{t("¡Aún no hay unidades en este módulo!")}</p>
          <p>{t("Parece que este módulo está vacío. Por favor, contacta al administrador para que añada contenido.")}</p>
        </div>
      )}
    </div>
  );
};

export default ModuleUnitsPage;
