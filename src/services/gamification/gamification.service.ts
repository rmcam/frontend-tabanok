import type { ApiResponse, LeaderboardEntryDto, GamificationUserStatsDto, Achievement, MissionTemplate, Leaderboard } from '../../types/api';
import { apiRequest } from '../_shared';

/**
 * Funciones específicas para los endpoints de gamificación.
 */
export const gamificationService = {
  getCurrentLeaderboard: () =>
    apiRequest<Leaderboard>('GET', '/gamification/leaderboard/current'), // Cambiado a Leaderboard y endpoint correcto

  getUserStats: (userId: string) =>
    apiRequest<ApiResponse<GamificationUserStatsDto>>('GET', `/gamification/user-stats/${userId}`),
  getAchievements: () =>
    apiRequest<ApiResponse<Achievement[]>>('GET', '/gamification/achievements'),
  getMissions: () =>
    apiRequest<ApiResponse<MissionTemplate[]>>('GET', '/gamification/missions'),
  rechargeHearts: (userId: string) =>
    apiRequest<ApiResponse<GamificationUserStatsDto>>('POST', `/gamification/recharge-hearts/${userId}`),
};
