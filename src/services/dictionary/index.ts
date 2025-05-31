import { apiRequest } from '../_shared';
import type { DictionaryEntryDto } from '../../types/api';

/**
 * Servicio para interactuar con los endpoints del Diccionario.
 */
export const dictionaryService = {
  /**
   * Busca palabras en el diccionario Kamëntsá.
   * @param query El término de búsqueda.
   * @returns Una promesa que resuelve con un array de entradas del diccionario.
   */
  searchDictionary: async (query: string): Promise<DictionaryEntryDto[]> => {
    const params = new URLSearchParams();
    params.append('query', query);
    return apiRequest<DictionaryEntryDto[]>('GET', `/dictionary/search?${params.toString()}`);
  },

  // Aunque el prompt no especifica endpoints para crear/actualizar/eliminar entradas del diccionario,
  // es común tenerlos. Si se necesitan, se añadirían aquí.
  // Por ejemplo, para obtener una entrada por ID:
  /*
  getDictionaryEntryById: async (id: string): Promise<DictionaryEntryDto> => {
    return apiRequest<DictionaryEntryDto>('GET', `/dictionary/${id}`);
  },
  */
};
