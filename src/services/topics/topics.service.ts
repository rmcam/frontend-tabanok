import type {
  ApiResponse,
} from '../../types/common/common.d';
import type {
  Topic,
  CreateTopicDto,
  UpdateTopicDto,
} from '../../types/learning/learning.d';
import type { TopicQueryParams } from '../../types/topics/topics.d'; // Asumiendo que se creará este tipo

import { apiRequest } from '../_shared';

/**
 * Funciones específicas para los endpoints de temas.
 */
export const topicsService = {
  createTopic: (topicData: CreateTopicDto) =>
    apiRequest<ApiResponse<Topic>>('POST', '/topics', topicData),
  getAllTopics: (params?: TopicQueryParams) =>
    apiRequest<ApiResponse<Topic[]>>('GET', '/topics', params),
  getTopicById: (id: string) =>
    apiRequest<ApiResponse<Topic>>('GET', `/topics/${id}`),
  updateTopic: (id: string, topicData: UpdateTopicDto) =>
    apiRequest<ApiResponse<Topic>>('PATCH', `/topics/${id}`, topicData),
  deleteTopic: (id: string) =>
    apiRequest<ApiResponse<void>>('DELETE', `/topics/${id}`),
};
