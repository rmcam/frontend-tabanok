import React from 'react';
import { useUnityWithTopicsAndContent } from '@/hooks/unities/unities.hooks'; // Usar el hook para obtener la unidad con estructura
import { useGetProgressByUser } from '@/hooks/progress/progress.hooks'; // Usar el hook para obtener el progreso del usuario
import { useProfile } from '@/hooks/auth/auth.hooks'; // Usar useProfile para obtener el usuario actual
import { calculateUnityProgress } from '@/lib/learning.utils'; // Importar la función de cálculo de progreso
import type { LearningUnit } from '@/types/learning'; // Importar tipo de unidad de aprendizaje procesada

interface UseDetailedUnitResult {
  unit: LearningUnit | undefined;
  isLoading: boolean;
  error: Error | null;
}

export const useDetailedUnit = (unitId: string): UseDetailedUnitResult => {
  const { data: userProfile } = useProfile(); // Obtener el perfil del usuario
  const userId = userProfile?.id; // Obtener el ID del usuario del perfil

  // Obtener la unidad con su estructura anidada (lecciones, tópicos, contenido, ejercicios)
  const { data: unitData, isLoading: isLoadingUnit, error: unitError } = useUnityWithTopicsAndContent(unitId);

  // Obtener el progreso del usuario para esta unidad (o para todas las unidades, dependiendo de la API)
  // Obtener el progreso del usuario para esta unidad (o para todas las unidades, dependiendo de la API)
  // Asumiendo que useGetProgressByUser ya maneja la lógica de 'enabled' internamente
  const { data: userProgress, isLoading: isLoadingProgress, error: progressError } = useGetProgressByUser(userId);

  // Combinar estados de carga y errores
  const isLoading = isLoadingUnit || isLoadingProgress;
  const error = unitError || progressError;

  const detailedUnit = React.useMemo(() => {
    // Solo procesar si tenemos los datos de la unidad y el progreso del usuario
    if (!unitData || !userProgress) {
      return undefined;
    }

    // Usar la función utilitaria para calcular el progreso y la completitud
    // Pasar los datos de la unidad y el progreso del usuario
    return calculateUnityProgress(unitData, userProgress);

  }, [unitData, userProgress]); // Dependencias: datos de la unidad y progreso del usuario

  return {
    unit: detailedUnit,
    isLoading,
    error,
  };
};
