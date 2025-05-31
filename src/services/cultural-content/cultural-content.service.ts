import type {
  ApiResponse,
  CulturalContent,
  CreateCulturalContentDto,
  UpdateCulturalContentDto,
} from '../../types/api';

import { apiRequest } from '../_shared';

/**
 * Funciones específicas para los endpoints de contenido cultural.
 */
export const culturalContentService = {
  createCulturalContent: (contentData: CreateCulturalContentDto) =>
    apiRequest<ApiResponse<CulturalContent>>('POST', '/cultural-content', contentData),
  getAllCulturalContent: () =>
    apiRequest<ApiResponse<CulturalContent[]>>('GET', '/cultural-content'),
  getCulturalContentById: (id: string) =>
    apiRequest<ApiResponse<CulturalContent>>('GET', `/cultural-content/${id}`),
  updateCulturalContent: (id: string, contentData: UpdateCulturalContentDto) =>
    apiRequest<ApiResponse<CulturalContent>>('PUT', `/cultural-content/${id}`, contentData),
  deleteCulturalContent: (id: string) =>
    apiRequest<ApiResponse<void>>('DELETE', `/cultural-content/${id}`),
  getCulturalContentByCategory: (category: string) =>
    apiRequest<ApiResponse<CulturalContent[]>>('GET', `/cultural-content/category/${category}`),
};
