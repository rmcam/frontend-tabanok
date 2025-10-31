import type { ApiResponse } from "../../types/common/common.d";
import type {
  Exercise,
  ExerciseQueryParams,
  PaginatedExercisesResponse,
} from "../../types/exercises/exercises.d";
import type {
  CreateExerciseDto,
  UpdateExerciseDto,
} from "../../types/learning/learning.d"; // Mantener si Create/Update DTOs están en learning.d

import { apiRequest } from "../_shared";

/**
 * Funciones específicas para los endpoints de ejercicios.
 */
export const exercisesService = {
  createExercise: (exerciseData: CreateExerciseDto) =>
    apiRequest<ApiResponse<Exercise>>("POST", "/exercises", exerciseData),
  getAllExercises: (params?: ExerciseQueryParams) =>
    apiRequest<ApiResponse<PaginatedExercisesResponse>>(
      "GET",
      "/exercises",
      params || {} // Pasar un objeto vacío si params es undefined
    ),
  getExercisesWithProgress: (params?: Omit<ExerciseQueryParams, "lessonId">) =>
    apiRequest<ApiResponse<PaginatedExercisesResponse>>(
      "GET",
      "/exercises/with-progress",
      { ...(params || {}), withProgress: true } // Pasar un objeto vacío si params es undefined
    ),
  getExerciseById: (id: string) => {
    return apiRequest<Exercise>("GET", `/exercises/${id}`);
  },
  updateExercise: (id: string, exerciseData: UpdateExerciseDto) =>
    apiRequest<ApiResponse<Exercise>>("PUT", `/exercises/${id}`, exerciseData),
  deleteExercise: (id: string) =>
    apiRequest<ApiResponse<void>>("DELETE", `/exercises/${id}`),

  getExercisesByTopicId: (topicId: string, params?: ExerciseQueryParams) =>
    apiRequest<Exercise[]>( // Cambiado a Exercise[] directamente
      "GET",
      `/exercises/by-topic/${topicId}`,
      params || {} // Pasar un objeto vacío si params es undefined
    ),

  getExercisesByLessonId: (lessonId: string, params?: ExerciseQueryParams) =>
    apiRequest<Exercise[]>( // Cambiado a Exercise[] directamente
      "GET",
      `/exercises/by-lesson/${lessonId}`,
      params || {} // Pasar un objeto vacío si params es undefined
    ),
  getExercisesByLessonIdWithProgress: (
    lessonId: string,
    params?: Omit<ExerciseQueryParams, "lessonId">
  ) =>
    apiRequest<Exercise[]>( // Cambiado a Exercise[] directamente
      "GET",
      `/exercises/by-lesson/${lessonId}/with-progress`,
      { ...(params || {}), withProgress: true } // Pasar un objeto vacío si params es undefined
    ),
};
