import type {
  ApiResponse,
} from "../../types/common/common.d";
import type {
  Exercise,
  CreateExerciseDto,
  UpdateExerciseDto,
} from "../../types/learning/learning.d";
import type { ExerciseQueryParams } from '../../types/exercises/exercises.d'; // Asumiendo que se creará este tipo

import { apiRequest } from "../_shared";

/**
 * Funciones específicas para los endpoints de ejercicios.
 */
export const exercisesService = {
  createExercise: (exerciseData: CreateExerciseDto) =>
    apiRequest<ApiResponse<Exercise>>("POST", "/exercises", exerciseData),
  getAllExercises: (params?: ExerciseQueryParams) =>
    apiRequest<ApiResponse<Exercise[]>>("GET", "/exercises", params),
  getExerciseById: (id: string) =>
    apiRequest<ApiResponse<Exercise>>("GET", `/exercises/${id}`),
  updateExercise: (id: string, exerciseData: UpdateExerciseDto) =>
    apiRequest<ApiResponse<Exercise>>("PUT", `/exercises/${id}`, exerciseData),
  deleteExercise: (id: string) =>
    apiRequest<ApiResponse<void>>("DELETE", `/exercises/${id}`),

  getExercisesByTopicId: (topicId: string, params?: ExerciseQueryParams) =>
    apiRequest<ApiResponse<Exercise[]>>("GET", `/exercises/by-topic/${topicId}`, params),

  getExercisesByLessonId: (lessonId: string, params?: ExerciseQueryParams) =>
    apiRequest<ApiResponse<Exercise[]>>("GET", `/exercises/by-lesson/${lessonId}`, params),
};
