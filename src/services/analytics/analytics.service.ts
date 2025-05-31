import type {
  ApiResponse,
} from '../../types/api';

import { apiRequest } from '../_shared';

/**
 * Funciones específicas para los endpoints de analíticas.
 */
export const analyticsService = {
  getVersioningMetrics: () =>
    apiRequest<ApiResponse<any>>('GET', '/analytics/versioning'), // Ajustar tipo de respuesta
  getContributorMetrics: () =>
    apiRequest<ApiResponse<any>>('GET', '/analytics/contributor'), // Ajustar tipo de respuesta
  getQualityMetrics: () =>
    apiRequest<ApiResponse<any>>('GET', '/analytics/quality'), // Ajustar tipo de respuesta
  getEngagementMetrics: () =>
    apiRequest<ApiResponse<any>>('GET', '/analytics/engagement'), // Ajustar tipo de respuesta
  getStudentProgress: () =>
    apiRequest<ApiResponse<any>>('GET', '/analytics/studentProgress'), // Ajustar tipo de respuesta
};
