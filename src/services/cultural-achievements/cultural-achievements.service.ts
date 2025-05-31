import type {
  ApiResponse,
  Achievement,
  CreateAchievementDto,
} from '../../types/api';

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
  updateProgress: (achievementId: string, userId: string, progressData: any) => // Ajustar tipo de progressData
    apiRequest<ApiResponse<void>>('PUT', `/cultural-achievements/${achievementId}/progress/${userId}`, progressData),
  getAchievementProgress: (achievementId: string, userId: string) =>
    apiRequest<ApiResponse<any>>('GET', `/cultural-achievements/${achievementId}/progress/${userId}`), // Ajustar tipo de respuesta
  getUserAchievements: (userId: string) =>
    apiRequest<ApiResponse<Achievement[]>>('GET', `/cultural-achievements/users/${userId}`),
};
