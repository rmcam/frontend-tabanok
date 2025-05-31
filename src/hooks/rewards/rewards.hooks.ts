import { useQuery } from '@tanstack/react-query';
import { rewardsService } from '../../services/rewards/rewards.service';
import { ApiError } from '../../services/_shared';
import type {
  Reward,
} from '../../types/api';

/**
 * Hooks para los endpoints de recompensas.
 */
export const useAvailableRewards = () => {
  return useQuery<Reward[], ApiError>({
    queryKey: ['rewards', 'available'],
    queryFn: async () => (await rewardsService.getAvailableRewards()).data,
  });
};

export const useUserRewards = (userId: string) => {
  return useQuery<Reward[], ApiError>({
    queryKey: ['rewards', 'user', userId],
    queryFn: async () => (await rewardsService.getUserRewards(userId)).data,
    enabled: !!userId,
  });
};
