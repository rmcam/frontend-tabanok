import { apiRequest } from '../_shared';
import type { Exercise, CreateExerciseDto, UpdateExerciseDto } from '../../types/api';

/**
 * Servicio para interactuar con los endpoints de Ejercicios.
 */
export const exercisesService = {
  /**
   * Obtiene un ejercicio específico por su ID.
   * @param id El ID del ejercicio.
   * @returns Una promesa que resuelve con el ejercicio.
   */
  getExerciseById: async (id: string): Promise<Exercise> => {
    return apiRequest<Exercise>('GET', `/exercise/${id}`);
  },

  /**
   * Crea un nuevo ejercicio.
   * @param data Los datos para crear el ejercicio.
   * @returns Una promesa que resuelve con el ejercicio creado.
   */
  createExercise: async (data: CreateExerciseDto): Promise<Exercise> => {
    return apiRequest<Exercise>('POST', '/exercise', data);
  },

  /**
   * Actualiza un ejercicio existente.
   * @param id El ID del ejercicio a actualizar.
   * @param data Los datos para actualizar el ejercicio.
   * @returns Una promesa que resuelve con el ejercicio actualizado.
   */
  updateExercise: async (id: string, data: UpdateExerciseDto): Promise<Exercise> => {
    return apiRequest<Exercise>('PATCH', `/exercise/${id}`, data);
  },

  /**
   * Elimina un ejercicio.
   * @param id El ID del ejercicio a eliminar.
   * @returns Una promesa que resuelve cuando el ejercicio ha sido eliminado.
   */
  deleteExercise: async (id: string): Promise<void> => {
    return apiRequest<void>('DELETE', `/exercise/${id}`);
  },
};
