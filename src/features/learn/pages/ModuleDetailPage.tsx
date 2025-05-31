import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import BreadcrumbNav from '@/components/common/BreadcrumbNav'; // Importar BreadcrumbNav
import { ArrowLeft, BookOpen, Lightbulb, CheckCircle2, Lock } from 'lucide-react';
import { useUnitiesByModuleId, useModuleById } from '@/hooks/modules/modules.hooks';
import { useProfile } from '@/hooks/auth/auth.hooks'; // Importar useProfile
import { useGetProgressByUser } from '@/hooks/progress/progress.hooks'; // Importar useGetProgressByUser
import LearningUnitCard from '@/features/learn/components/LearningUnitCard';
import type { LearningUnit, LearningLesson, LearningExercise, LearningTopic } from '@/types/learning'; // Importar tipos de aprendizaje
import type { Lesson, Exercise, Topic, Module } from '@/types/api'; // Importar tipo Lesson, Exercise, Topic y Module
import { calculateExerciseProgress, calculateLessonProgress, calculateTopicProgress, calculateUnityProgress } from '@/lib/learning.utils'; // Importar funciones de utilidad

const ModuleDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { moduleId } = useParams<{ moduleId: string }>();

  // Obtener el perfil del usuario para el progreso
  const { data: userProfile } = useProfile();
  const userId = userProfile?.id;
  const { data: userProgress, isLoading: isLoadingProgress } = useGetProgressByUser(userId);

  const { data: moduleData, isLoading: isLoadingModule, error: errorModule } = useModuleById(moduleId || '');
  const { data: unitiesData, isLoading: isLoadingUnities, error: errorUnities } = useUnitiesByModuleId(moduleId || '');

  console.log('ModuleDetailPage - moduleId:', moduleId); // Debugging
  console.log('ModuleDetailPage - moduleData:', moduleData); // Debugging
  console.log('ModuleDetailPage - unitiesData (from hook):', unitiesData); // Debugging

  // Log después de que los datos se han resuelto y antes de mapear
  React.useEffect(() => {
    if (moduleData && unitiesData) {
      console.log('ModuleDetailPage - Final moduleData:', moduleData);
      console.log('ModuleDetailPage - Final unitiesData:', unitiesData);
    }
  }, [moduleData, unitiesData]);

  const isLoading = isLoadingModule || isLoadingUnities || isLoadingProgress; // Incluir carga de progreso
  const error = errorModule || errorUnities;

  const module: Module | null | undefined = moduleData; // Permitir que module sea null
  const unities = unitiesData || [];

  // Mapear las unidades de la API a LearningUnit para pasarlas a LearningUnitCard
  const mappedUnities: LearningUnit[] = React.useMemo(() => {
    if (!userProgress) return []; // Asegurarse de que userProgress esté disponible

    // Filtrar las unidades para asegurar que solo se muestren las que pertenecen al módulo actual
    const filteredUnities = unities.filter(unit => {
      // console.log(`Filtering unit: ${unit.title} (unit.id: ${unit.id}) - unit.moduleId: ${unit.moduleId}, current moduleId: ${moduleId}`);
      return unit.moduleId === moduleId;
    });

    let previousUnityCompleted = true; // La primera unidad no tiene una anterior, así que se considera "completada" para no bloquearla
    return filteredUnities.map(unit => {
      // Usar la función de utilidad para calcular el progreso de la unidad
      const processedUnit = calculateUnityProgress(unit, userProgress, previousUnityCompleted);
      previousUnityCompleted = processedUnit.isCompleted; // Actualizar para la siguiente unidad
      return processedUnit;
    }).sort((a, b) => a.order - b.order); // Ordenar unidades
  }, [unities, moduleId, userProgress]); // Añadir userProgress como dependencia

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <p className="text-lg">{t("Cargando módulo...")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-red-500">
        <p className="text-lg">{t("Error al cargar módulo")}: {error.message}</p>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-muted-foreground">
        <p className="text-lg">{t("Módulo no encontrado.")}</p>
      </div>
    );
  }

  const totalUnits = mappedUnities.length;
  const completedUnits = mappedUnities.filter(unit => unit.isCompleted).length;
  const moduleProgress = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;

  return (
    <div className="flex flex-col flex-grow p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        {/* Breadcrumbs */}
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
              <span>{t("Puntos del Módulo")}: <span className="font-semibold text-primary">{module.points}</span></span>
              <span>{t("Progreso del Módulo")}: <span className="font-semibold text-primary">{moduleProgress}%</span></span>
            </div>
            <Progress value={moduleProgress} className="w-full h-3" />
          </CardContent>
        </Card>
      </div>

      <h2 className="text-3xl font-bold tracking-tight text-center mb-8 text-secondary-foreground">
        {t("Unidades del Módulo")}
      </h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mappedUnities.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground mt-8 p-4 border rounded-lg bg-card shadow-lg">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary" />
            <p className="text-xl font-semibold mb-2">{t("¡Aún no hay unidades en este módulo!")}</p>
            <p>{t("Parece que este módulo está vacío. Por favor, contacta al administrador para que añada contenido.")}</p>
          </div>
        )}
        {mappedUnities.map((unit, i) => (
          <LearningUnitCard key={unit.id} unit={unit} index={i} />
        ))}
      </div>
    </div>
  );
};

export default ModuleDetailPage;
