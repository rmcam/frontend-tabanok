import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { progressService } from '../../services/progress';
import type { ProgressDto, CreateProgressDto, UpdateProgressCompletedDto, UpdateProgressScoreDto } from '../../types/api';

/**
 * Claves de consulta para TanStack Query.
 */
export const progressQueryKeys = {
  all: ['progress'] as const,
  user: (userId: string) => [...progressQueryKeys.all, 'user', userId] as const,
  detail: (id: string) => [...progressQueryKeys.all, 'detail', id] as const,
};

/**
 * Hook para obtener todos los registros de progreso de un usuario.
 * @param userId El ID del usuario.
 * @returns Un objeto con los datos de progreso, estado de carga y error.
 */
export const useUserProgress = (userId: string) => {
  return useQuery<ProgressDto[], Error>({
    queryKey: progressQueryKeys.user(userId),
    queryFn: () => progressService.getUserProgress(userId),
    enabled: !!userId,
  });
};

/**
 * Hook para crear un nuevo registro de progreso.
 * Invalida las consultas de progreso del usuario después de una creación exitosa.
 * @returns Un objeto con la función de mutación, estado de carga y error.
 */
export const useCreateProgress = () => {
  const queryClient = useQueryClient();
  return useMutation<ProgressDto, Error, CreateProgressDto>({
    mutationFn: progressService.createProgress,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: progressQueryKeys.user(data.userId) });
      queryClient.invalidateQueries({ queryKey: progressQueryKeys.all });
    },
  });
};

/**
 * Hook para actualizar el progreso de un ejercicio como completado.
 * Invalida las consultas de progreso del usuario y el detalle del progreso después de una actualización exitosa.
 * @returns Un objeto con la función de mutación, estado de carga y error.
 */
export const useUpdateProgressCompleted = () => {
  const queryClient = useQueryClient();
  return useMutation<ProgressDto, Error, { id: string; data: UpdateProgressCompletedDto }>({
    mutationFn: ({ id, data }) => progressService.updateProgressCompleted(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: progressQueryKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: progressQueryKeys.user(data.userId) });
      queryClient.invalidateQueries({ queryKey: progressQueryKeys.all });
    },
  });
};

/**
 * Hook para actualizar el puntaje de un progreso de ejercicio.
 * Invalida las consultas de progreso del usuario y el detalle del progreso después de una actualización exitosa.
 * @returns Un objeto con la función de mutación, estado de carga y error.
 */
export const useUpdateProgressScore = () => {
  const queryClient = useQueryClient();
  return useMutation<ProgressDto, Error, { id: string; data: UpdateProgressScoreDto }>({
    mutationFn: ({ id, data }) => progressService.updateProgressScore(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: progressQueryKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: progressQueryKeys.user(data.userId) });
      queryClient.invalidateQueries({ queryKey: progressQueryKeys.all });
    },
  });
};

/**
 * Hook para eliminar un registro de progreso.
 * Invalida las consultas de progreso del usuario después de una eliminación exitosa.
 * @returns Un objeto con la función de mutación, estado de carga y error.
 */
export const useDeleteProgress = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: progressService.deleteProgress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: progressQueryKeys.all });
    },
  });
};
