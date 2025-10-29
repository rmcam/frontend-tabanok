import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { rewardsService } from '@/services/rewards/rewards.service';
import { ApiError } from '@/services/_shared';
import type { Reward, CreateRewardDto, AwardRewardDto, RewardStatusDto } from '@/types/gamification/gamification.d';
import type { ApiResponse } from '@/types/common/common.d';

/**
 * Hook para crear una nueva recompensa.
 */
export function useCreateReward() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Reward>, ApiError, CreateRewardDto>({
    mutationFn: (data) => rewardsService.createReward(data),
    onSuccess: () => {
      toast.success('Recompensa creada exitosamente.');
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
    },
    onError: (error) => {
      console.error('Error al crear recompensa:', error.message, error.details);
      toast.error('Error al crear recompensa.');
    },
  });
}

/**
 * Hook para obtener todas las recompensas disponibles.
 */
export const useAvailableRewards = () => {
  return useQuery<Reward[], ApiError>({
    queryKey: ['rewards', 'available'],
    queryFn: async () => (await rewardsService.getAvailableRewards()).data,
  });
};

/**
 * Hook para otorgar una recompensa a un usuario.
 */
export function useAwardReward() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<void>, ApiError, { rewardId: string; userId: string }>({
    mutationFn: ({ rewardId, userId }) => rewardsService.awardRewardToUser(rewardId, userId),
    onSuccess: (_, { userId }) => {
      toast.success('Recompensa otorgada exitosamente.');
      queryClient.invalidateQueries({ queryKey: ['rewards', 'user', userId] });
    },
    onError: (error) => {
      console.error('Error al otorgar recompensa:', error.message, error.details);
      toast.error('Error al otorgar recompensa.');
    },
  });
}

/**
 * Hook para obtener las recompensas de un usuario.
 */
export const useUserRewards = (userId: string) => {
  return useQuery<Reward[], ApiError>({
    queryKey: ['rewards', 'user', userId],
    queryFn: async () => (await rewardsService.getUserRewards(userId)).data,
    enabled: !!userId,
  });
};

/**
 * Hook para consumir una recompensa de un usuario.
 */
export function useConsumeReward() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<void>, ApiError, { userId: string; rewardId: string }>({
    mutationFn: ({ userId, rewardId }) => rewardsService.consumeReward(userId, rewardId),
    onSuccess: (_, { userId, rewardId }) => {
      toast.success('Recompensa consumida exitosamente.');
      queryClient.invalidateQueries({ queryKey: ['rewards', 'user', userId] });
      queryClient.invalidateQueries({ queryKey: ['rewards', 'user', userId, 'status', rewardId] });
    },
    onError: (error) => {
      console.error('Error al consumir recompensa:', error.message, error.details);
      toast.error('Error al consumir recompensa.');
    },
  });
}

/**
 * Hook para verificar el estado de una recompensa de un usuario.
 */
export function useRewardStatus(userId: string, rewardId: string) {
  return useQuery<RewardStatusDto, ApiError>({
    queryKey: ['rewards', 'user', userId, 'status', rewardId],
    queryFn: async () => (await rewardsService.checkRewardStatus(userId, rewardId)).data,
    enabled: !!userId && !!rewardId,
  });
}
