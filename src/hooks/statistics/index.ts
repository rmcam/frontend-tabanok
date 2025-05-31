import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { statisticsService } from '../../services/statistics';
import type { Statistics, CreateStatisticsDto, UpdateLearningProgressDto, LearningPathDto } from '../../types/api';

/**
 * Claves de consulta para TanStack Query.
 */
export const statisticsQueryKeys = {
  all: ['statistics'] as const,
  user: (userId: string) => [...statisticsQueryKeys.all, 'user', userId] as const,
  learningPath: (userId: string) => [...statisticsQueryKeys.all, 'learningPath', userId] as const,
};

/**
 * Hook para obtener la ruta de aprendizaje del usuario.
 * @param userId El ID del usuario.
 * @returns Un objeto con los datos de la ruta de aprendizaje, estado de carga y error.
 */
export const useUserLearningPath = (userId: string) => {
  return useQuery<LearningPathDto, Error>({
    queryKey: statisticsQueryKeys.learningPath(userId),
    queryFn: () => statisticsService.getUserLearningPath(userId),
    enabled: !!userId,
  });
};

/**
 * Hook para obtener las estadísticas de un usuario.
 * @param userId El ID del usuario.
 * @returns Un objeto con los datos de las estadísticas, estado de carga y error.
 */
export const useUserStatistics = (userId: string) => {
  return useQuery<Statistics, Error>({
    queryKey: statisticsQueryKeys.user(userId),
    queryFn: () => statisticsService.getUserStatistics(userId),
    enabled: !!userId,
  });
};

/**
 * Hook para crear un nuevo registro de estadísticas para un usuario.
 * Invalida las consultas de estadísticas del usuario después de una creación exitosa.
 * @returns Un objeto con la función de mutación, estado de carga y error.
 */
export const useCreateStatistics = () => {
  const queryClient = useQueryClient();
  return useMutation<Statistics, Error, CreateStatisticsDto>({
    mutationFn: statisticsService.createStatistics,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: statisticsQueryKeys.user(data.userId) });
      queryClient.invalidateQueries({ queryKey: statisticsQueryKeys.all });
    },
  });
};

/**
 * Hook para actualizar el progreso de aprendizaje de un usuario.
 * Invalida las consultas de estadísticas del usuario y la ruta de aprendizaje después de una actualización exitosa.
 * @returns Un objeto con la función de mutación, estado de carga y error.
 */
export const useUpdateLearningProgress = () => {
  const queryClient = useQueryClient();
  return useMutation<Statistics, Error, { userId: string; data: UpdateLearningProgressDto }>({
    mutationFn: ({ userId, data }) => statisticsService.updateLearningProgress(userId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: statisticsQueryKeys.user(data.userId) });
      queryClient.invalidateQueries({ queryKey: statisticsQueryKeys.learningPath(data.userId) });
      queryClient.invalidateQueries({ queryKey: statisticsQueryKeys.all });
    },
  });
};
