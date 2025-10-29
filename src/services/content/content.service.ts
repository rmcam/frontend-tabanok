import type {
  Content,
  CreateContentDto,
  UpdateContentDto,
  ContentQueryParams,
} from '../../types/content/content.d';
import type { ApiResponse } from '../../types/common/common.d';
import { apiRequest } from '../_shared';

/**
 * Funciones específicas para los endpoints de contenido.
 */
export const contentService = {
  createContent: (data: CreateContentDto) =>
    apiRequest<ApiResponse<Content>>('POST', '/content', data),

  getAllContent: (params?: ContentQueryParams) =>
    apiRequest<ApiResponse<Content[]>>('GET', '/content', params),

  getContentById: (id: string) =>
    apiRequest<ApiResponse<Content>>('GET', `/content/${id}`),

  updateContent: (id: string, data: UpdateContentDto) =>
    apiRequest<ApiResponse<Content>>('PATCH', `/content/${id}`, data),

  deleteContent: (id: string) =>
    apiRequest<ApiResponse<void>>('DELETE', `/content/${id}`),

  getContentByUnityAndTopicId: (unityId: string, topicId: string) =>
    apiRequest<ApiResponse<Content[]>>('GET', `/content/unity/${unityId}/topic/${topicId}`),
};
