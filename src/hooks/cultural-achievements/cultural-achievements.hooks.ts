import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { culturalAchievementsService } from '@/services/cultural-achievements/cultural-achievements.service';
import { ApiError } from '@/services/_shared';
import type { Achievement, CreateAchievementDto, UpdateProgressDto } from '@/types/gamification/gamification.d';
import type { ApiResponse } from '@/types/common/common.d';

/**
 * Hook para crear un nuevo logro cultural.
 */
export function useCreateCulturalAchievement() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Achievement>, ApiError, CreateAchievementDto>({
    mutationFn: (data) => culturalAchievementsService.createAchievement(data),
    onSuccess: () => {
      toast.success('Logro cultural creado exitosamente.');
      queryClient.invalidateQueries({ queryKey: ['culturalAchievements'] });
    },
    onError: (error) => {
      console.error('Error al crear logro cultural:', error.message, error.details);
      toast.error('Error al crear logro cultural.');
    },
  });
}

/**
 * Hook para obtener todos los logros culturales.
 */
export function useAllCulturalAchievements() {
  return useQuery<Achievement[], ApiError>({
    queryKey: ['culturalAchievements'],
    queryFn: async () => (await culturalAchievementsService.getAllAchievements()).data,
  });
}

/**
 * Hook para inicializar el progreso de un logro cultural para un usuario.
 */
export function useInitializeCulturalAchievementProgress() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<void>, ApiError, { achievementId: string; userId: string }>({
    mutationFn: ({ achievementId, userId }) => culturalAchievementsService.initializeProgress(achievementId, userId),
    onSuccess: (_, { achievementId, userId }) => {
      toast.success('Progreso de logro cultural inicializado.');
      queryClient.invalidateQueries({ queryKey: ['culturalAchievements', userId] });
      queryClient.invalidateQueries({ queryKey: ['culturalAchievementProgress', achievementId, userId] });
    },
    onError: (error) => {
      console.error('Error al inicializar progreso de logro cultural:', error.message, error.details);
      toast.error('Error al inicializar progreso de logro cultural.');
    },
  });
}

/**
 * Hook para actualizar el progreso de un logro cultural para un usuario.
 */
export function useUpdateCulturalAchievementProgress() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<void>, ApiError, { achievementId: string; userId: string; data: UpdateProgressDto }>({
    mutationFn: ({ achievementId, userId, data }) => culturalAchievementsService.updateProgress(achievementId, userId, data),
    onSuccess: (_, { achievementId, userId }) => {
      toast.success('Progreso de logro cultural actualizado.');
      queryClient.invalidateQueries({ queryKey: ['culturalAchievements', userId] });
      queryClient.invalidateQueries({ queryKey: ['culturalAchievementProgress', achievementId, userId] });
    },
    onError: (error) => {
      console.error('Error al actualizar progreso de logro cultural:', error.message, error.details);
      toast.error('Error al actualizar progreso de logro cultural.');
    },
  });
}

/**
 * Hook para obtener el progreso específico de un logro cultural para un usuario.
 */
export function useSpecificCulturalAchievementProgress(achievementId: string, userId: string) {
  return useQuery<UpdateProgressDto, ApiError>({
    queryKey: ['culturalAchievementProgress', achievementId, userId],
    queryFn: async () => (await culturalAchievementsService.getAchievementProgress(achievementId, userId)).data,
    enabled: !!achievementId && !!userId,
  });
}

/**
 * Hook para obtener todos los logros culturales de un usuario.
 */
export const useCulturalAchievementsByUserId = (userId: string) => {
  return useQuery<Achievement[], ApiError>({
    queryKey: ['culturalAchievements', userId],
    queryFn: async () => (await culturalAchievementsService.getUserAchievements(userId)).data,
    enabled: !!userId,
  });
};
