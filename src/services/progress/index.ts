import { apiRequest } from '../_shared';
import type { ProgressDto, CreateProgressDto, UpdateProgressCompletedDto, UpdateProgressScoreDto } from '../../types/api';

/**
 * Servicio para interactuar con los endpoints de Progreso.
 */
export const progressService = {
  /**
   * Obtiene todos los registros de progreso de un usuario.
   * @param userId El ID del usuario.
   * @returns Una promesa que resuelve con un array de registros de progreso.
   */
  getUserProgress: async (userId: string): Promise<ProgressDto[]> => {
    return apiRequest<ProgressDto[]>('GET', `/progress/user/${userId}`);
  },

  /**
   * Crea un nuevo registro de progreso.
   * @param data Los datos para crear el progreso.
   * @returns Una promesa que resuelve con el registro de progreso creado.
   */
  createProgress: async (data: CreateProgressDto): Promise<ProgressDto> => {
    return apiRequest<ProgressDto>('POST', '/progress', data);
  },

  /**
   * Actualiza el progreso de un ejercicio como completado.
   * @param id El ID del registro de progreso.
   * @param data Los datos para actualizar el progreso.
   * @returns Una promesa que resuelve con el registro de progreso actualizado.
   */
  updateProgressCompleted: async (id: string, data: UpdateProgressCompletedDto): Promise<ProgressDto> => {
    return apiRequest<ProgressDto>('PATCH', `/progress/${id}/complete`, data);
  },

  /**
   * Actualiza el puntaje de un progreso de ejercicio.
   * @param id El ID del registro de progreso.
   * @param data Los datos para actualizar el puntaje.
   * @returns Una promesa que resuelve con el registro de progreso actualizado.
   */
  updateProgressScore: async (id: string, data: UpdateProgressScoreDto): Promise<ProgressDto> => {
    return apiRequest<ProgressDto>('PATCH', `/progress/${id}/score`, data);
  },

  /**
   * Elimina un registro de progreso.
   * @param id El ID del registro de progreso a eliminar.
   * @returns Una promesa que resuelve cuando el registro de progreso ha sido eliminado.
   */
  deleteProgress: async (id: string): Promise<void> => {
    return apiRequest<void>('DELETE', `/progress/${id}`);
  },
};
