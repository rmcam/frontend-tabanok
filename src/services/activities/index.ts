import { apiRequest } from '../_shared';
import type { Activity, CreateActivityDto, UpdateActivityDto } from '../../types/api';

/**
 * Servicio para interactuar con los endpoints de Actividades.
 * Nota: Los endpoints específicos para actividades no fueron detallados en el prompt inicial,
 * pero se infieren de los errores 404 y la existencia de tipos Activity.
 */
export const activitiesService = {
  /**
   * Obtiene una actividad específica por su ID.
   * @param id El ID de la actividad.
   * @returns Una promesa que resuelve con la actividad.
   */
  getActivityById: async (id: string): Promise<Activity> => {
    return apiRequest<Activity>('GET', `/activities/${id}`);
  },

  /**
   * Crea una nueva actividad.
   * @param data Los datos para crear la actividad.
   * @returns Una promesa que resuelve con la actividad creada.
   */
  createActivity: async (data: CreateActivityDto): Promise<Activity> => {
    return apiRequest<Activity>('POST', '/activities', data);
  },

  /**
   * Actualiza una actividad existente.
   * @param id El ID de la actividad a actualizar.
   * @param data Los datos para actualizar la actividad.
   * @returns Una promesa que resuelve con la actividad actualizada.
   */
  updateActivity: async (id: string, data: UpdateActivityDto): Promise<Activity> => {
    return apiRequest<Activity>('PATCH', `/activities/${id}`, data);
  },

  /**
   * Elimina una actividad.
   * @param id El ID de la actividad a eliminar.
   * @returns Una promesa que resuelve cuando la actividad ha sido eliminada.
   */
  deleteActivity: async (id: string): Promise<void> => {
    return apiRequest<void>('DELETE', `/activities/${id}`);
  },
};
