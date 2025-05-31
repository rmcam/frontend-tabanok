import { apiRequest } from '../_shared';
import type { Lesson, CreateLessonDto, UpdateLessonDto } from '../../types/api';

/**
 * Servicio para interactuar con los endpoints de Lecciones.
 */
export const lessonsService = {
  /**
   * Obtiene una lista paginada de todas las lecciones.
   * @param page El número de página (opcional).
   * @param limit El límite de elementos por página (opcional).
   * @returns Una promesa que resuelve con un array de lecciones.
   */
  getAllLessons: async (page?: number, limit?: number): Promise<Lesson[]> => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    return apiRequest<Lesson[]>('GET', `/lesson?${params.toString()}`);
  },

  /**
   * Obtiene lecciones por una unidad específica.
   * @param unityId El ID de la unidad.
   * @returns Una promesa que resuelve con un array de lecciones.
   */
  getLessonsByUnityId: async (unityId: string): Promise<Lesson[]> => {
    return apiRequest<Lesson[]>('GET', `/lesson/unity/${unityId}`);
  },

  /**
   * Obtiene los detalles de una lección específica por su ID.
   * @param id El ID de la lección.
   * @returns Una promesa que resuelve con la lección.
   */
  getLessonById: async (id: string): Promise<Lesson> => {
    return apiRequest<Lesson>('GET', `/lesson/${id}`);
  },

  /**
   * Crea una nueva lección.
   * @param data Los datos para crear la lección.
   * @returns Una promesa que resuelve con la lección creada.
   */
  createLesson: async (data: CreateLessonDto): Promise<Lesson> => {
    return apiRequest<Lesson>('POST', '/lesson', data);
  },

  /**
   * Actualiza una lección existente.
   * @param id El ID de la lección a actualizar.
   * @param data Los datos para actualizar la lección.
   * @returns Una promesa que resuelve con la lección actualizada.
   */
  updateLesson: async (id: string, data: UpdateLessonDto): Promise<Lesson> => {
    return apiRequest<Lesson>('PATCH', `/lesson/${id}`, data);
  },

  /**
   * Elimina una lección.
   * @param id El ID de la lección a eliminar.
   * @returns Una promesa que resuelve cuando la lección ha sido eliminada.
   */
  deleteLesson: async (id: string): Promise<void> => {
    return apiRequest<void>('DELETE', `/lesson/${id}`);
  },
};
