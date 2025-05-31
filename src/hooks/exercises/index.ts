import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { exercisesService } from '../../services/exercises';
import type { Exercise, CreateExerciseDto, UpdateExerciseDto } from '../../types/api';

/**
 * Claves de consulta para TanStack Query.
 */
export const exerciseQueryKeys = {
  all: ['exercises'] as const,
  details: () => [...exerciseQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...exerciseQueryKeys.details(), id] as const,
};

/**
 * Hook para obtener un ejercicio específico por su ID.
 * @param exerciseId El ID del ejercicio.
 * @returns Un objeto con los datos del ejercicio, estado de carga y error.
 */
export const useExerciseById = (exerciseId: string) => {
  return useQuery<Exercise, Error>({
    queryKey: exerciseQueryKeys.detail(exerciseId),
    queryFn: () => exercisesService.getExerciseById(exerciseId),
    enabled: !!exerciseId,
  });
};

/**
 * Hook para crear un nuevo ejercicio.
 * Invalida las consultas de ejercicios después de una creación exitosa.
 * @returns Un objeto con la función de mutación, estado de carga y error.
 */
export const useCreateExercise = () => {
  const queryClient = useQueryClient();
  return useMutation<Exercise, Error, CreateExerciseDto>({
    mutationFn: exercisesService.createExercise,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: exerciseQueryKeys.all });
    },
  });
};

/**
 * Hook para actualizar un ejercicio existente.
 * Invalida las consultas de ejercicios y el detalle del ejercicio después de una actualización exitosa.
 * @returns Un objeto con la función de mutación, estado de carga y error.
 */
export const useUpdateExercise = () => {
  const queryClient = useQueryClient();
  return useMutation<Exercise, Error, { id: string; data: UpdateExerciseDto }>({
    mutationFn: ({ id, data }) => exercisesService.updateExercise(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: exerciseQueryKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: exerciseQueryKeys.all });
    },
  });
};

/**
 * Hook para eliminar un ejercicio.
 * Invalida las consultas de ejercicios después de una eliminación exitosa.
 * @returns Un objeto con la función de mutación, estado de carga y error.
 */
export const useDeleteExercise = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: exercisesService.deleteExercise,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: exerciseQueryKeys.all });
    },
  });
};
