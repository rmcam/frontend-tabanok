import { useQuery } from '@tanstack/react-query';
import { gamificationService } from '../../services/gamification/gamification.service';
import { ApiError } from '../../services/_shared';
import type {
  LeaderboardEntryDto,
  UserAchievementDto, // Importar UserAchievementDto
  UserMissionDto, // Importar UserMissionDto
} from '../../types/api';

/**
 * Hooks para los endpoints de gamificación.
 */
export const useLeaderboard = () => {
  return useQuery<LeaderboardEntryDto[], ApiError>({
    queryKey: ['leaderboard'],
    queryFn: async () => (await gamificationService.getLeaderboard()).data,
  });
};

export const useUserAchievements = (userId: string) => {
  return useQuery<UserAchievementDto[], ApiError>({
    queryKey: ['userAchievements', userId],
    queryFn: async () => (await gamificationService.getUserAchievements(userId)).data,
    enabled: !!userId,
  });
};

export const useUserMissions = (userId: string) => {
  return useQuery<UserMissionDto[], ApiError>({
    queryKey: ['userMissions', userId],
    queryFn: async () => (await gamificationService.getUserMissions(userId)).data,
    enabled: !!userId,
  });
};
