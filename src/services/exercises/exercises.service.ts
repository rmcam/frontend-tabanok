import type {
  ApiResponse,
  Exercise,
  CreateExerciseDto,
  UpdateExerciseDto,
  SubmitExerciseDto,
  SubmitExerciseResponse,
} from '../../types/api';

import { apiRequest } from '../_shared';

/**
 * Funciones específicas para los endpoints de ejercicios.
 */
export const exercisesService = {
  createExercise: (exerciseData: CreateExerciseDto) =>
    apiRequest<ApiResponse<Exercise>>('POST', '/exercises', exerciseData),
  getAllExercises: () =>
    apiRequest<ApiResponse<Exercise[]>>('GET', '/exercises'),
  getExerciseById: (id: string) =>
    apiRequest<Exercise>('GET', `/exercises/${id}`), // Cambiado a Exercise directamente
  updateExercise: (id: string, exerciseData: UpdateExerciseDto) =>
    apiRequest<ApiResponse<Exercise>>('PUT', `/exercises/${id}`, exerciseData),
  deleteExercise: (id: string) =>
    apiRequest<ApiResponse<void>>('DELETE', `/exercises/${id}`),

  getExercisesByTopicId: (topicId: string) =>
    apiRequest<Exercise[]>('GET', `/exercises/by-topic/${topicId}`),

  getExercisesByLessonId: (lessonId: string) =>
    apiRequest<Exercise[]>('GET', `/exercises/by-lesson/${lessonId}`),

  submitExercise: async (id: string, submission: SubmitExerciseDto) => {
    // Asegurarse de que el exerciseId esté en el cuerpo de la solicitud
    const submissionData: SubmitExerciseDto = {
      ...submission,
      exerciseId: id,
    };
    // Cambiar el tipo esperado de apiRequest a SubmitExerciseResponse directamente
    return apiRequest<SubmitExerciseResponse>('POST', `/exercises/${id}/submit`, submissionData);
  },
};
