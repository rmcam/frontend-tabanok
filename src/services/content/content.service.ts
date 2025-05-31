import type {
  ApiResponse,
  Content, // Asumiendo que existe un tipo Content
} from '../../types/api';

import { apiRequest } from '../_shared';

/**
 * Funciones específicas para los endpoints de contenido.
 */
export const contentService = {
  getContentByUnityAndTopicId: (unityId: string, topicId: string) =>
    apiRequest<Content[]>('GET', `/content/unity/${unityId}/topic/${topicId}`),
};
