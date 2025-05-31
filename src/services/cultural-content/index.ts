import { apiRequest } from '../_shared';
import type { CulturalContent, CreateCulturalContentDto, UpdateCulturalContentDto } from '../../types/api';

/**
 * Servicio para interactuar con los endpoints de Contenido Cultural.
 */
export const culturalContentService = {
  /**
   * Obtiene todo el contenido cultural disponible (con paginación).
   * @param page El número de página (opcional).
   * @param limit El límite de elementos por página (opcional).
   * @returns Una promesa que resuelve con un array de contenido cultural.
   */
  getAllCulturalContent: async (page?: number, limit?: number): Promise<CulturalContent[]> => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    return apiRequest<CulturalContent[]>('GET', `/cultural-content?${params.toString()}`);
  },

  /**
   * Filtra contenido cultural por categoría.
   * @param category La categoría del contenido cultural.
   * @returns Una promesa que resuelve con un array de contenido cultural.
   */
  getCulturalContentByCategory: async (category: string): Promise<CulturalContent[]> => {
    return apiRequest<CulturalContent[]>('GET', `/cultural-content/category/${category}`);
  },

  /**
   * Obtiene un contenido cultural específico por su ID.
   * @param id El ID del contenido cultural.
   * @returns Una promesa que resuelve con el contenido cultural.
   */
  getCulturalContentById: async (id: string): Promise<CulturalContent> => {
    return apiRequest<CulturalContent>('GET', `/cultural-content/${id}`);
  },

  /**
   * Crea un nuevo contenido cultural.
   * @param data Los datos para crear el contenido cultural.
   * @returns Una promesa que resuelve con el contenido cultural creado.
   */
  createCulturalContent: async (data: CreateCulturalContentDto): Promise<CulturalContent> => {
    return apiRequest<CulturalContent>('POST', '/cultural-content', data);
  },

  /**
   * Actualiza un contenido cultural existente.
   * @param id El ID del contenido cultural a actualizar.
   * @param data Los datos para actualizar el contenido cultural.
   * @returns Una promesa que resuelve con el contenido cultural actualizado.
   */
  updateCulturalContent: async (id: string, data: UpdateCulturalContentDto): Promise<CulturalContent> => {
    return apiRequest<CulturalContent>('PATCH', `/cultural-content/${id}`, data);
  },

  /**
   * Elimina un contenido cultural.
   * @param id El ID del contenido cultural a eliminar.
   * @returns Una promesa que resuelve cuando el contenido cultural ha sido eliminado.
   */
  deleteCulturalContent: async (id: string): Promise<void> => {
    return apiRequest<void>('DELETE', `/cultural-content/${id}`);
  },
};
