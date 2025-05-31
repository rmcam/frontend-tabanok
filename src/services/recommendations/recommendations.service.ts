import type {
  ApiResponse,
} from '../../types/api';

import { apiRequest } from '../_shared';

/**
 * Funciones específicas para los endpoints de recomendaciones.
 */
export const recommendationsService = {
  getRecommendationsByUserId: (userId: string) =>
    apiRequest<ApiResponse<any[]>>('GET', `/recommendations/users/${userId}`), // Ajustar tipo de respuesta
  getRecommendations: (userId: string) =>
    apiRequest<ApiResponse<any[]>>('GET', `/recommendations/${userId}`), // Ajustar tipo de respuesta
};
