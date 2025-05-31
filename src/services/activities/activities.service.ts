import type {
  ApiResponse, // Mantener ApiResponse si se usa en otros lugares, aunque no para los retornos directos de apiRequest
  Exercise, // Cambiar Activity a Exercise
  CreateExerciseDto, // Cambiar CreateActivityDto a CreateExerciseDto
  UpdateExerciseDto, // Cambiar UpdateActivityDto a UpdateExerciseDto
} from '../../types/api';

import { apiRequest } from '../_shared';

/**
 * Funciones específicas para los endpoints de actividades.
 */
export const activitiesService = {
  createActivity: (activityData: CreateExerciseDto) => // Usar CreateExerciseDto
    apiRequest<Exercise>('POST', '/activities', activityData), // Usar Exercise
  getAllActivities: () =>
    apiRequest<Exercise[]>('GET', '/activities'), // Usar Exercise[]
  getActivitiesByType: (type: string) =>
    apiRequest<Exercise[]>('GET', `/activities/type/${type}`), // Usar Exercise[]
  getActivitiesByDifficulty: (level: string) =>
    apiRequest<Exercise[]>('GET', `/activities/difficulty/${level}`), // Usar Exercise[]
  getActivityById: (id: string) =>
    apiRequest<Exercise>('GET', `/activities/${id}`), // Usar Exercise
  updateActivity: (id: string, activityData: UpdateExerciseDto) => // Usar UpdateExerciseDto
    apiRequest<Exercise>('PATCH', `/activities/${id}`, activityData), // Usar Exercise
  deleteActivity: (id: string) =>
    apiRequest<void>('DELETE', `/activities/${id}`),
  updateActivityPoints: (id: string, points: number) =>
    apiRequest<Exercise>('PATCH', `/activities/${id}/points`, { points }), // Usar Exercise

  /**
   * Envía las respuestas de un ejercicio para su evaluación.
   * @param id El ID del ejercicio.
   * @param answers Las respuestas del usuario. La estructura dependerá del tipo de ejercicio.
   * @returns La respuesta de la API, que podría incluir el resultado de la evaluación.
   */
  submitExerciseAnswers: (id: string, answers: any) => // Tipo 'any' para respuestas, ajustar si se define un tipo específico
    apiRequest<any>('POST', `/activities/${id}/submit`, { answers }), // Asumiendo endpoint /activities/{id}/submit
};
