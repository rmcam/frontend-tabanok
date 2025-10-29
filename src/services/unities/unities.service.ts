import type {
  ApiResponse,
  Unity,
  CreateUnityDto,
  UpdateUnityDto,
} from '../../types'; // Importar desde el índice de tipos
import type { Lesson, Topic } from '../../types/learning/learning.d'; // Usar importación de solo tipo

import { apiRequest } from '../_shared';

/**
 * Funciones específicas para los endpoints de unidades de aprendizaje.
 */
export const unitiesService = {
  createUnity: (unityData: CreateUnityDto) =>
    apiRequest<ApiResponse<Unity>>('POST', '/unity', unityData), // Mantener ApiResponse<Unity>
  getAllUnities: () =>
    apiRequest<Unity[]>('GET', '/unity'),
  getUnityById: (id: string) =>
    apiRequest<Unity>('GET', `/unity/${id}`),
  updateUnity: (id: string, unityData: UpdateUnityDto) =>
    apiRequest<ApiResponse<Unity>>('PATCH', `/unity/${id}`, unityData), // Mantener ApiResponse<Unity>
  deleteUnity: (id: string) =>
    apiRequest<ApiResponse<void>>('DELETE', `/unity/${id}`), // Mantener ApiResponse<void>
  toggleUnityLock: (id: string) =>
    apiRequest<ApiResponse<Unity>>('PATCH', `/unity/${id}/toggle-lock`), // Mantener ApiResponse<Unity>
  updateUnityPoints: (id: string, points: number) =>
    apiRequest<ApiResponse<Unity>>('PATCH', `/unity/${id}/points`, { points }), // Mantener ApiResponse<Unity>

  /**
   * Obtiene una unidad específica con sus tópicos y contenido anidado
   * utilizando los endpoints existentes y reconstruyendo la jerarquía.
   * @param id El ID de la unidad.
   * @returns Una promesa que resuelve con la unidad y su contenido anidado.
   */
  getLessonsByUnityId: async (id: string) => {
    const response = await apiRequest<Lesson[]>('GET', `/unity/${id}/lessons`);
    return response;
  },
  getTopicsByUnityId: async (id: string) => {
    const response = await apiRequest<Topic[]>('GET', `/unity/${id}/topics`);
    return response;
  },
};
