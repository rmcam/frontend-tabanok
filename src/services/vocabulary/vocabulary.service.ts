import type {
  ApiResponse,
  Vocabulary,
  CreateVocabularyDto,
  UpdateVocabularyDto,
} from '../../types/api';

import { apiRequest } from '../_shared';

/**
 * Funciones específicas para los endpoints de vocabulario.
 */
export const vocabularyService = {
  createVocabulary: (vocabularyData: CreateVocabularyDto) =>
    apiRequest<ApiResponse<Vocabulary>>('POST', '/vocabulary', vocabularyData),
  getAllVocabulary: () =>
    apiRequest<ApiResponse<Vocabulary[]>>('GET', '/vocabulary'),
  searchVocabulary: (query: string) =>
    apiRequest<ApiResponse<Vocabulary[]>>('GET', `/vocabulary/search?query=${query}`),
  getVocabularyById: (id: string) =>
    apiRequest<ApiResponse<Vocabulary>>('GET', `/vocabulary/${id}`),
  updateVocabulary: (id: string, vocabularyData: UpdateVocabularyDto) =>
    apiRequest<ApiResponse<Vocabulary>>('PATCH', `/vocabulary/${id}`, vocabularyData),
  deleteVocabulary: (id: string) =>
    apiRequest<ApiResponse<void>>('DELETE', `/vocabulary/${id}`),
  getVocabularyByTopic: (topicId: string) =>
    apiRequest<ApiResponse<Vocabulary[]>>('GET', `/vocabulary/topic/${topicId}`),
};
