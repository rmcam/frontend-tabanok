import type { ApiResponse } from '../../types/common/common.d';
import type { Unity, CreateUnityDto, UpdateUnityDto } from '../../types/learning/learning.d';
import type { Lesson } from '../../types/lessons/lessons.d';
import type { Topic } from '../../types/learning/learning.d'; // Importar Topic desde learning.d.ts
import type { UnityQueryParams } from '../../types/unities/unities.d'; // Asumiendo que se creará este tipo

import { apiRequest } from '../_shared';

/**
 * Funciones específicas para los endpoints de unidades de aprendizaje.
 */
export const unitiesService = {
  createUnity: (unityData: CreateUnityDto) =>
    apiRequest<Unity>('POST', '/unity', unityData),
  getAllUnities: (params?: UnityQueryParams) =>
    apiRequest<Unity[]>('GET', '/unity', params),
  getUnityById: (id: string) =>
    apiRequest<Unity>('GET', `/unity/${id}`),
  getDetailedUnityById: (id: string) =>
    apiRequest<Unity>('GET', `/unity/${id}?withTopicsAndContent=true`),
  updateUnity: (id: string, unityData: UpdateUnityDto) =>
    apiRequest<Unity>('PATCH', `/unity/${id}`, unityData),
  deleteUnity: (id: string) =>
    apiRequest<void>('DELETE', `/unity/${id}`),
  toggleUnityLock: (id: string) =>
    apiRequest<Unity>('PATCH', `/unity/${id}/toggle-lock`),
  updateUnityPoints: (id: string, points: number) =>
    apiRequest<Unity>('PATCH', `/unity/${id}/points`, { points }),

  /**
   * Obtiene una unidad específica con sus tópicos y contenido anidado
   * utilizando los endpoints existentes y reconstruyendo la jerarquía.
   * @param id El ID de la unidad.
   * @returns Una promesa que resuelve con la unidad y su contenido anidado.
   */
  getLessonsByUnityId: (id: string) => {
    return apiRequest<Lesson[]>('GET', `/unity/${id}/lessons`);
  },
  getTopicsByUnityId: (id: string) => {
    return apiRequest<Topic[]>('GET', `/unity/${id}/topics`);
  },
};
