import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Progress } from '@/components/ui/progress';
import BreadcrumbNav from '@/components/common/BreadcrumbNav'; // Importar BreadcrumbNav
import { BookOpen } from 'lucide-react';
import { useModuleById } from '@/hooks/modules/modules.hooks';
import { useProfile } from '@/hooks/auth/auth.hooks'; // Importar useProfile
import { useGetProgressByUser } from '@/hooks/progress/progress.hooks'; // Importar useGetProgressByUser
import LearningUnitCard from '@/features/learn/components/LearningUnitCard';
import type { LearningUnit } from '@/types/learning'; // Importar tipos de aprendizaje
import type { Module } from '@/types/api'; // Importar Module desde api
import { calculateUnityProgress } from '@/lib/learning.utils'; // Importar la función

const ModuleDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { moduleId } = useParams<{ moduleId: string }>();

  // Obtener el perfil del usuario para el progreso
  const { data: userProfile } = useProfile();
  const userId = userProfile?.id;
  const { data: userProgress, isLoading: isLoadingProgress } = useGetProgressByUser(userId);

  const { data: moduleData, isLoading: isLoadingModule, error: errorModule } = useModuleById(moduleId || '');

  console.log('ModuleDetailPage - moduleId:', moduleId); // Debugging
  console.log('ModuleDetailPage - moduleData:', moduleData); // Debugging

  // Log después de que los datos se han resuelto y antes de mapear
  React.useEffect(() => {
    if (moduleData) {
      console.log('ModuleDetailPage - Final moduleData:', moduleData);
    }
  }, [moduleData]);

  const isLoading = isLoadingModule || isLoadingProgress; // Incluir carga de progreso
  const error = errorModule;

  const module: Module | null | undefined = moduleData; // Permitir que module sea null
  const unities = moduleData?.unities || []; // Obtener unities directamente de moduleData

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
  }, [unities, userProgress]); // Eliminar moduleId como dependencia, ya que unities ya está filtrado por módulo

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

      <div className="relative">
        {/* Línea de tiempo vertical */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-primary/20 transform -translate-x-1/2"></div>

        <div className="space-y-12">
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
    </div>
  );
};

export default ModuleDetailPage;
