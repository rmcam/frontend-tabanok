import { apiRequest } from '../_shared';
import type { Vocabulary, CreateVocabularyDto, UpdateVocabularyDto } from '../../types/api';

/**
 * Servicio para interactuar con los endpoints de Vocabulario.
 */
export const vocabularyService = {
  /**
   * Obtiene la lista completa del vocabulario.
   * @returns Una promesa que resuelve con un array de vocabulario.
   */
  getAllVocabulary: async (): Promise<Vocabulary[]> => {
    return apiRequest<Vocabulary[]>('GET', '/vocabulary');
  },

  /**
   * Permite buscar palabras en el vocabulario Kamëntsá.
   * @param query El término de búsqueda.
   * @param page El número de página (opcional).
   * @param limit El límite de elementos por página (opcional).
   * @returns Una promesa que resuelve con un array de vocabulario.
   */
  searchVocabulary: async (query: string, page?: number, limit?: number): Promise<Vocabulary[]> => {
    const params = new URLSearchParams();
    params.append('query', query);
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    return apiRequest<Vocabulary[]>('GET', `/vocabulary/search?${params.toString()}`);
  },

  /**
   * Obtiene entradas de vocabulario relacionadas con un tema específico.
   * @param topicId El ID del tema.
   * @returns Una promesa que resuelve con un array de vocabulario.
   */
  getVocabularyByTopicId: async (topicId: string): Promise<Vocabulary[]> => {
    return apiRequest<Vocabulary[]>('GET', `/vocabulary/topic/${topicId}`);
  },

  /**
   * Crea una nueva entrada de vocabulario.
   * @param data Los datos para crear la entrada de vocabulario.
   * @returns Una promesa que resuelve con la entrada de vocabulario creada.
   */
  createVocabulary: async (data: CreateVocabularyDto): Promise<Vocabulary> => {
    return apiRequest<Vocabulary>('POST', '/vocabulary', data);
  },

  /**
   * Actualiza una entrada de vocabulario existente.
   * @param id El ID de la entrada de vocabulario a actualizar.
   * @param data Los datos para actualizar la entrada de vocabulario.
   * @returns Una promesa que resuelve con la entrada de vocabulario actualizada.
   */
  updateVocabulary: async (id: string, data: UpdateVocabularyDto): Promise<Vocabulary> => {
    return apiRequest<Vocabulary>('PATCH', `/vocabulary/${id}`, data);
  },

  /**
   * Elimina una entrada de vocabulario.
   * @param id El ID de la entrada de vocabulario a eliminar.
   * @returns Una promesa que resuelve cuando la entrada de vocabulario ha sido eliminada.
   */
  deleteVocabulary: async (id: string): Promise<void> => {
    return apiRequest<void>('DELETE', `/vocabulary/${id}`);
  },
};
