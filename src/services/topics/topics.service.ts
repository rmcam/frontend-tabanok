import type {
  ApiResponse,
  Topic,
  CreateTopicDto,
  UpdateTopicDto,
} from '../../types/api';

import { apiRequest } from '../_shared';

/**
 * Funciones específicas para los endpoints de temas.
 */
export const topicsService = {
  createTopic: (topicData: CreateTopicDto) =>
    apiRequest<ApiResponse<Topic>>('POST', '/topics', topicData),
  getAllTopics: () =>
    apiRequest<ApiResponse<Topic[]>>('GET', '/topics'),
  getTopicById: (id: string) =>
    apiRequest<ApiResponse<Topic>>('GET', `/topics/${id}`),
  updateTopic: (id: string, topicData: UpdateTopicDto) =>
    apiRequest<ApiResponse<Topic>>('PATCH', `/topics/${id}`, topicData),
  deleteTopic: (id: string) =>
    apiRequest<ApiResponse<void>>('DELETE', `/topics/${id}`),
};
