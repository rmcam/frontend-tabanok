import type {
  ApiResponse,
  CreateExerciseDto,
  UpdateExerciseDto,
  SubmitExerciseDto,
  SubmitExerciseResponse,
} from "../../types";
import type { Exercise } from "../../types/learning/learning.d";

import { apiRequest } from "../_shared";

interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Funciones específicas para los endpoints de ejercicios.
 */
export const exercisesService = {
  createExercise: (exerciseData: CreateExerciseDto) =>
    apiRequest<ApiResponse<Exercise>>("POST", "/exercises", exerciseData),
  getAllExercises: (pagination?: PaginationParams) => {
    const params = new URLSearchParams();
    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.limit) params.append('limit', pagination.limit.toString());
    const queryString = params.toString();
    return apiRequest<Exercise[]>("GET", `/exercises${queryString ? `?${queryString}` : ''}`);
  },
  getExerciseById: (id: string) =>
    apiRequest<Exercise>("GET", `/exercises/${id}`),
  updateExercise: (id: string, exerciseData: UpdateExerciseDto) =>
    apiRequest<ApiResponse<Exercise>>("PUT", `/exercises/${id}`, exerciseData),
  deleteExercise: (id: string) =>
    apiRequest<ApiResponse<void>>("DELETE", `/exercises/${id}`),

  getExercisesByTopicId: (topicId: string, pagination?: PaginationParams) => {
    const params = new URLSearchParams();
    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.limit) params.append('limit', pagination.limit.toString());
    const queryString = params.toString();
    return apiRequest<Exercise[]>("GET", `/exercises/by-topic/${topicId}${queryString ? `?${queryString}` : ''}`);
  },

  getExercisesByLessonId: (lessonId: string, pagination?: PaginationParams) => {
    const params = new URLSearchParams();
    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.limit) params.append('limit', pagination.limit.toString());
    const queryString = params.toString();
    return apiRequest<Exercise[]>("GET", `/exercises/by-lesson/${lessonId}${queryString ? `?${queryString}` : ''}`);
  },

};
