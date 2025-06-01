import React from 'react';
import { useAllModules } from '@/hooks/modules/modules.hooks';
import type { Module } from '@/types/api';
import type { LearningModule } from '@/types/learning';

interface UseLearningPathResult {
  learningPath: LearningModule[];
  isLoading: boolean;
  error: Error | null;
  totalModulesCompleted: number;
  totalModules: number;
  nextModule: LearningModule | undefined;
}

// Función utilitaria para mapear Module a LearningModule
const mapModuleToLearningModule = (module: Module): LearningModule => {
  // isCompleted no está en la API Module, se inicializa a false.
  // progress sí está en la API Module (opcional), se usa si está presente.
  return {
    ...module,
    units: [], // Las unidades se cargarán en la página de detalle del módulo
    url: `/learn/module/${module.id}`, // URL para navegar al detalle del módulo
    isCompleted: false, // Asumiendo que el backend no proporciona este campo aquí
    progress: module.progress ?? 0, // Usar el valor del backend si está presente, de lo contrario 0
  };
};

export const useLearningPath = (): UseLearningPathResult => {
  const { data: modulesData, isLoading, error } = useAllModules();

  const modules = modulesData || [];

  const learningPath = React.useMemo(() => {
    // Mapear los módulos de la API a LearningModule usando la función utilitaria
    const path: LearningModule[] = modules.map(mapModuleToLearningModule);

    return path.sort((a, b) => a.order - b.order);
  }, [modules]);

  // Calcular el progreso general del camino de aprendizaje basado en módulos
  // Nota: totalModulesCompleted y nextModule se basan en el campo isCompleted,
  // que actualmente se inicializa a false ya que no viene de la API /module.
  // Esto puede no reflejar el estado real de completitud si el backend no lo proporciona.
  const totalModulesCompleted = learningPath.filter(m => m.isCompleted).length;
  const totalModules = learningPath.length;
  const nextModule = learningPath.find(m => !m.isCompleted);

  return {
    learningPath,
    isLoading,
    error,
    totalModulesCompleted,
    totalModules,
    nextModule,
  };
};
