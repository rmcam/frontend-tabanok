import { useQuery } from '@tanstack/react-query';
import { culturalAchievementsService } from '../../services/cultural-achievements/cultural-achievements.service';
import { ApiError } from '../../services/_shared';
import type {
  Achievement,
} from '../../types/api';

/**
 * Hooks para los endpoints de logros culturales.
 */
export const useCulturalAchievementsByUserId = (userId: string) => {
  return useQuery<Achievement[], ApiError>({
    queryKey: ['culturalAchievements', userId],
    queryFn: async () => (await culturalAchievementsService.getUserAchievements(userId)).data,
    enabled: !!userId,
  });
};
