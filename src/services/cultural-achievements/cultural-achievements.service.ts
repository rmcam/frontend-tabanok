import type { ApiResponse } from '../../types/common/common.d';
import type { Achievement, CreateAchievementDto, UpdateProgressDto } from '../../types/gamification/gamification.d';

import { apiRequest } from '../_shared';

/**
 * Funciones específicas para los endpoints de logros culturales.
 */
export const culturalAchievementsService = {
  createAchievement: (achievementData: CreateAchievementDto) =>
    apiRequest<ApiResponse<Achievement>>('POST', '/cultural-achievements', achievementData),
  getAllAchievements: () =>
    apiRequest<ApiResponse<Achievement[]>>('GET', '/cultural-achievements'),
  initializeProgress: (achievementId: string, userId: string) =>
    apiRequest<ApiResponse<void>>('POST', `/cultural-achievements/${achievementId}/progress/${userId}`),
  updateProgress: (achievementId: string, userId: string, progressData: UpdateProgressDto) =>
    apiRequest<ApiResponse<void>>('PUT', `/cultural-achievements/${achievementId}/progress/${userId}`, progressData),
  getAchievementProgress: (achievementId: string, userId: string) =>
    apiRequest<ApiResponse<UpdateProgressDto>>('GET', `/cultural-achievements/${achievementId}/progress/${userId}`),
  getUserAchievements: (userId: string) =>
    apiRequest<ApiResponse<Achievement[]>>('GET', `/cultural-achievements/users/${userId}`),
};
