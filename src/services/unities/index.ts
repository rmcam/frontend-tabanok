import { apiRequest } from '../_shared';
import type { Unity, CreateUnityDto, UpdateUnityDto, Topic, Content } from '../../types/api';

/**
 * Servicio para interactuar con los endpoints de Unidades.
 */
export const unitiesService = {
  /**
   * Obtiene una unidad específica con sus tópicos y contenido asociado.
   * @param id El ID de la unidad.
   * @returns Una promesa que resuelve con la unidad, incluyendo tópicos y contenido.
   */
  getUnityWithTopicsAndContent: async (id: string): Promise<Unity & { topics: (Topic & { content: Content[] })[] }> => {
    return apiRequest<Unity & { topics: (Topic & { content: Content[] })[] }>('GET', `/unity/${id}/with-topics-and-content`);
  },

  /**
   * Crea una nueva unidad.
   * @param data Los datos para crear la unidad.
   * @returns Una promesa que resuelve con la unidad creada.
   */
  createUnity: async (data: CreateUnityDto): Promise<Unity> => {
    return apiRequest<Unity>('POST', '/unity', data);
  },

  /**
   * Actualiza una unidad existente.
   * @param id El ID de la unidad a actualizar.
   * @param data Los datos para actualizar la unidad.
   * @returns Una promesa que resuelve con la unidad actualizada.
   */
  updateUnity: async (id: string, data: UpdateUnityDto): Promise<Unity> => {
    return apiRequest<Unity>('PATCH', `/unity/${id}`, data);
  },

  /**
   * Elimina una unidad.
   * @param id El ID de la unidad a eliminar.
   * @returns Una promesa que resuelve cuando la unidad ha sido eliminada.
   */
  deleteUnity: async (id: string): Promise<void> => {
    return apiRequest<void>('DELETE', `/unity/${id}`);
  },
};
