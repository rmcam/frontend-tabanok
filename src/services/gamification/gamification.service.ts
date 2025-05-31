import type {
  ApiResponse,
  User,
  LeaderboardEntryDto,
  UserAchievementDto,
  UserMissionDto,
} from '../../types/api';

import { apiRequest } from '../_shared';

/**
 * Funciones específicas para los endpoints de gamificación.
 */
export const gamificationService = {
  grantPoints: (userId: string, points: number) =>
    apiRequest<ApiResponse<User>>('POST', `/gamification/grant-points/${userId}`, { points }),
  assignMission: (userId: string, missionId: string) =>
    apiRequest<ApiResponse<void>>('POST', `/gamification/${userId}/assign-mission/${missionId}`),
  getLeaderboard: () =>
    apiRequest<ApiResponse<LeaderboardEntryDto[]>>('GET', '/gamification/leaderboard'),

  getUserAchievements: (userId: string) =>
    apiRequest<ApiResponse<UserAchievementDto[]>>('GET', `/achievements/user/${userId}`), // Asumiendo UserAchievementDto[] como tipo de respuesta

  getUserMissions: (userId: string) =>
    apiRequest<ApiResponse<UserMissionDto[]>>('GET', `/missions/user/${userId}`), // Asumiendo UserMissionDto[] como tipo de respuesta
};
