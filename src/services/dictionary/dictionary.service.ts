import type {
  ApiResponse,
  DictionaryEntryDto,
} from '../../types/api';

import { apiRequest } from '../_shared';

/**
 * Funciones específicas para los endpoints del diccionario.
 */
export const dictionaryService = {
  searchDictionary: (query: string) =>
    apiRequest<ApiResponse<DictionaryEntryDto[]>>('GET', `/dictionary/search?query=${query}`),
};
