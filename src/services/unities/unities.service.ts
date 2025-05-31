import type {
  ApiResponse,
  Unity,
  CreateUnityDto,
  UpdateUnityDto,
  Topic, // Importar tipo Topic
  Content, // Importar tipo Content
  DetailedUnity, // Importar DetailedUnity
} from '../../types/api';

import { apiRequest } from '../_shared';
import { topicsService } from '../topics/topics.service'; // Importar topicsService
import { contentService } from '../content/content.service'; // Importar contentService

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
  getUnityWithTopicsAndContent: async (id: string): Promise<DetailedUnity> => {
    try {
      // Utilizar el nuevo endpoint que devuelve la unidad con tópicos y ejercicios anidados
      const unity = await apiRequest<DetailedUnity>('GET', `/unity/${id}/with-topics-and-content`);

      return unity;

    } catch (error) {
      console.error('Error fetching unity with topics and content:', error);
      throw error; // Re-lanzar el error para que el hook lo maneje
    }
  },
};
