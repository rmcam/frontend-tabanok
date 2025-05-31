import { apiRequest } from '../_shared';
import type { Content, CreateContentDto, UpdateContentDto } from '../../types/api';

/**
 * Servicio para interactuar con los endpoints de Contenido.
 */
export const contentService = {
  /**
   * Obtiene un contenido educativo específico por su ID.
   * @param id El ID del contenido.
   * @returns Una promesa que resuelve con el contenido.
   */
  getContentById: async (id: string): Promise<Content> => {
    return apiRequest<Content>('GET', `/content/${id}`);
  },

  /**
   * Obtiene contenido por una unidad y un tema específicos.
   * @param unityId El ID de la unidad.
   * @param topicId El ID del tema.
   * @returns Una promesa que resuelve con un array de contenido.
   */
  getContentByUnityAndTopic: async (unityId: string, topicId: string): Promise<Content[]> => {
    return apiRequest<Content[]>('GET', `/content/unity/${unityId}/topic/${topicId}`);
  },

  /**
   * Crea un nuevo contenido.
   * @param data Los datos para crear el contenido.
   * @returns Una promesa que resuelve con el contenido creado.
   */
  createContent: async (data: CreateContentDto): Promise<Content> => {
    return apiRequest<Content>('POST', '/content', data);
  },

  /**
   * Actualiza un contenido existente.
   * @param id El ID del contenido a actualizar.
   * @param data Los datos para actualizar el contenido.
   * @returns Una promesa que resuelve con el contenido actualizado.
   */
  updateContent: async (id: string, data: UpdateContentDto): Promise<Content> => {
    return apiRequest<Content>('PATCH', `/content/${id}`, data);
  },

  /**
   * Elimina un contenido.
   * @param id El ID del contenido a eliminar.
   * @returns Una promesa que resuelve cuando el contenido ha sido eliminado.
   */
  deleteContent: async (id: string): Promise<void> => {
    return apiRequest<void>('DELETE', `/content/${id}`);
  },
};
