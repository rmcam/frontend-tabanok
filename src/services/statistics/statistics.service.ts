import type {
  ApiResponse,
  Statistics,
  CreateStatisticsDto,
  UpdateLearningProgressDto,
  UpdateAchievementStatsDto,
  UpdateBadgeStatsDto,
  GenerateReportDto,
  UpdateCategoryProgressDto,
  CategoryMetricsResponseDto,
  AvailableCategoryDto,
  NextMilestoneDto,
  LearningPathDto,
} from '../../types';

import { apiRequest } from '../_shared';

/**
 * Funciones específicas para los endpoints de estadísticas.
 */
export const statisticsService = {
  createStatistics: (statsData: CreateStatisticsDto) =>
    apiRequest<ApiResponse<Statistics>>('POST', '/statistics', statsData),
  getAllStatistics: () =>
    apiRequest<ApiResponse<Statistics[]>>('GET', '/statistics'),
  getStatisticsByUserId: (userId: string) =>
    apiRequest<ApiResponse<Statistics>>('GET', `/progress/user/${userId}`),
  updateLearningProgress: (userId: string, progressData: UpdateLearningProgressDto) =>
    apiRequest<ApiResponse<Statistics>>('PUT', `/statistics/user/${userId}/learning-progress`, progressData),
  updateAchievementStats: (userId: string, statsData: UpdateAchievementStatsDto) =>
    apiRequest<ApiResponse<Statistics>>('PUT', `/statistics/achievement/${userId}`, statsData),
  updateBadgeStats: (userId: string, statsData: UpdateBadgeStatsDto) =>
    apiRequest<ApiResponse<Statistics>>('PUT', `/statistics/badge/${userId}`, statsData),
  generateReport: (userId: string, reportData: GenerateReportDto) =>
    apiRequest<ApiResponse<Blob>>('POST', `/statistics/user/${userId}/report`, reportData), // Asumiendo que devuelve un Blob para el reporte
  generateQuickReport: (userId: string) =>
    apiRequest<ApiResponse<Blob>>('GET', `/statistics/reports/quick/${userId}`),
  updateCategoryProgress: (userId: string, categoryType: string, progressData: UpdateCategoryProgressDto) =>
    apiRequest<ApiResponse<Statistics>>('PUT', `/statistics/${userId}/category/${categoryType}/progress`, progressData),
  getCategoryMetrics: (userId: string, categoryType: string) =>
    apiRequest<ApiResponse<CategoryMetricsResponseDto>>('GET', `/statistics/${userId}/category/${categoryType}`),
  getLearningPath: (userId: string) =>
    apiRequest<ApiResponse<LearningPathDto>>('GET', `/statistics/${userId}/learning-path`),
  getAvailableCategories: (userId: string) =>
    apiRequest<ApiResponse<AvailableCategoryDto[]>>('GET', `/statistics/${userId}/available-categories`),
  getNextMilestones: (userId: string) =>
    apiRequest<ApiResponse<NextMilestoneDto[]>>('GET', `/statistics/${userId}/next-milestones`),
};
