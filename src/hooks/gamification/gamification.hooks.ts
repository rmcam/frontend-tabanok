import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner'; // Asumiendo que 'sonner' es la librería de notificaciones
import { gamificationService } from '@/services/gamification/gamification.service';
import type { Leaderboard, GamificationUserStatsDto, Achievement, MissionTemplate } from '@/types/gamification/gamification.d';
import type { ApiResponse } from '@/types/common/common.d';
import { ApiError } from '@/services/_shared'; // Importar ApiError
import { useHeartsStore } from '@/stores/heartsStore'; // Importar el store de vidas

/**
 * Hook para obtener la tabla de clasificación semanal actual.
 * @returns Un objeto de React Query con los datos de la tabla de clasificación, estado de carga y error.
 */
export function useCurrentLeaderboard() {
  return useQuery<Leaderboard, Error>({
    queryKey: ['currentLeaderboard'],
    queryFn: () => gamificationService.getCurrentLeaderboard(),
  });
}

/**
 * Hook para obtener las estadísticas de gamificación de un usuario.
 * @param userId El ID del usuario.
 * @returns Un objeto de React Query con los datos de las estadísticas, estado de carga y error.
 */
export function useGamificationUserStats(userId: string) {
  return useQuery<GamificationUserStatsDto, Error>({
    queryKey: ['userStats', userId],
    queryFn: async () => (await gamificationService.getUserStats(userId)).data, // Extraer los datos de ApiResponse
    enabled: !!userId, // Solo ejecutar la query si userId existe
  });
}

/**
 * Hook para obtener todos los logros.
 * @returns Un objeto de React Query con los datos de los logros, estado de carga y error.
 */
export function useAllAchievements() {
  return useQuery<Achievement[], Error>({
    queryKey: ['achievements'],
    queryFn: async () => (await gamificationService.getAchievements()).data,
  });
}

/**
 * Hook para obtener todas las misiones.
 * @returns Un objeto de React Query con los datos de las misiones, estado de carga y error.
 */
export function useAllMissionTemplates() {
  return useQuery<MissionTemplate[], Error>({
    queryKey: ['missionTemplates'],
    queryFn: async () => (await gamificationService.getMissions()).data,
  });
}

/**
 * Hook para recargar las vidas de un usuario.
 * @returns Un objeto de React Query con la función de mutación para recargar vidas.
 */
export function useHeartRecharge() {
  const queryClient = useQueryClient();
  const { setHearts } = useHeartsStore(); // Obtener la función para actualizar las vidas en el store

  return useMutation<ApiResponse<GamificationUserStatsDto>, ApiError, string>({
    mutationFn: (userId) => gamificationService.rechargeHearts(userId),
    onSuccess: (response) => {
      toast.success('Vidas recargadas exitosamente.');
      queryClient.invalidateQueries({ queryKey: ['userStats'] }); // Invalidar las estadísticas del usuario
      setHearts(response.data.hearts); // Actualizar el store de vidas con el nuevo valor
    },
    onError: (error) => {
      console.error('Error al recargar vidas:', error.message, error.details);
      toast.error('Error al recargar vidas.');
    },
  });
}

/**
 * Hook para otorgar puntos a un usuario.
 */
export function useGrantPoints() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<GamificationUserStatsDto>, ApiError, { userId: string; points: number }>({
    mutationFn: ({ userId, points }) => gamificationService.grantPoints(userId, { points }),
    onSuccess: (response, { userId }) => {
      toast.success('Puntos otorgados exitosamente.');
      queryClient.invalidateQueries({ queryKey: ['userStats', userId] });
      queryClient.invalidateQueries({ queryKey: ['currentLeaderboard'] });
    },
    onError: (error) => {
      console.error('Error al otorgar puntos:', error.message, error.details);
      toast.error('Error al otorgar puntos.');
    },
  });
}

/**
 * Hook para asignar una misión a un usuario.
 */
export function useAssignMission() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<GamificationUserStatsDto>, ApiError, { userId: string; missionId: string }>({
    mutationFn: ({ userId, missionId }) => gamificationService.assignMission(userId, missionId),
    onSuccess: (response, { userId }) => {
      toast.success('Misión asignada exitosamente.');
      queryClient.invalidateQueries({ queryKey: ['userStats', userId] });
      queryClient.invalidateQueries({ queryKey: ['missionTemplates'] });
    },
    onError: (error) => {
      console.error('Error al asignar misión:', error.message, error.details);
      toast.error('Error al asignar misión.');
    },
  });
}
