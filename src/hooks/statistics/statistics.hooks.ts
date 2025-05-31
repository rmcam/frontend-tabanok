import { useQuery } from '@tanstack/react-query';
import { statisticsService } from '@/services/statistics/statistics.service';
import type { Statistics, NextMilestoneDto } from '@/types/api';

/**
 * Hook para obtener las estadísticas de un usuario por su ID.
 * @param userId El ID del usuario.
 */
export const useUserStatistics = (userId: string) => {
  return useQuery<Statistics, Error>({
    queryKey: ['userStatistics', userId],
    queryFn: async () => {
      const response = await statisticsService.getStatisticsByUserId(userId);
      // Asegurarse de que response.data no sea undefined. Si no hay estadísticas, devolver null.
      return response.data || null;
    },
    enabled: !!userId,
  });
};

/**
 * Hook para obtener los próximos hitos de un usuario por su ID.
 * @param userId El ID del usuario.
 */
export const useNextMilestones = (userId: string) => {
  return useQuery<NextMilestoneDto[], Error>({
    queryKey: ['nextMilestones', userId],
    queryFn: async () => {
      const response = await statisticsService.getNextMilestones(userId);
      // Asumiendo que la respuesta de getNextMilestones es ApiResponse<NextMilestoneDto[]>
      return response.data;
    },
    enabled: !!userId,
  });
};
