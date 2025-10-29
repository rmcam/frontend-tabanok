import { apiRequest } from '../_shared';
import type { ApiResponse } from '../../types/common/common.d';
import type { SubmitExerciseDto, SubmitExerciseResponse, ProgressDto, CreateProgressDto, UserLessonProgressResponse, UserUnityProgressResponse, UserExerciseProgressResponse } from '../../types/progress/progress.d';
import type { Exercise } from '../../types/learning/learning.d';

interface PaginationParams {
  page?: number;
  limit?: number;
}

const ProgressService = {
  getProgressByUser: (userId: string, pagination?: PaginationParams) => {
    const params = new URLSearchParams();
    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.limit) params.append('limit', pagination.limit.toString());
    const queryString = params.toString();
    // Cambiado a devolver ProgressDto[] para consistencia con getOrCreateProgress
    return apiRequest<ApiResponse<ProgressDto[]>>('GET', `/progress/user/${userId}${queryString ? `?${queryString}` : ''}`);
  },
  createProgress: (progressData: CreateProgressDto) => {
    return apiRequest<ApiResponse<ProgressDto>>('POST', '/progress', progressData);
  },
  getOrCreateProgress: async (userId: string, exerciseId: string, pagination?: PaginationParams): Promise<ApiResponse<ProgressDto>> => {
    const userProgressesResponse = await ProgressService.getProgressByUser(userId, pagination);
    const userProgresses = userProgressesResponse.data;

    const progress = userProgresses.find(p => p.exerciseId === exerciseId); // Buscar por exerciseId en ProgressDto

    if (!progress) {
      const newProgressData: CreateProgressDto = {
        userId,
        exerciseId,
        isCompleted: false,
        score: 0,
        answers: {},
      };
      const newProgressResponse = await apiRequest<ApiResponse<ProgressDto>>('POST', '/progress', newProgressData);
      return newProgressResponse;
    }
    return { data: progress };
  },
  markProgressAsCompleted: (progressId: string, data: { answers: Record<string, any> }) => {
    return apiRequest<ApiResponse<UserExerciseProgressResponse>>('PATCH', `/progress/${progressId}/complete`, data);
  },
  updateProgressScore: (progressId: string, data: { score: number }) => {
    return apiRequest<ApiResponse<UserExerciseProgressResponse>>('PATCH', `/progress/${progressId}/score`, data);
  },
  submitExercise: (id: string, submission: SubmitExerciseDto) => {
    return apiRequest<ApiResponse<SubmitExerciseResponse>>('POST', `/progress/${id}/submit-exercise`, submission);
  },

  // Nuevos métodos para progreso de lecciones y unidades
  getAllUserLessonProgress: (userId: string, pagination?: PaginationParams) => {
    const params = new URLSearchParams();
    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.limit) params.append('limit', pagination.limit.toString());
    const queryString = params.toString();
    return apiRequest<ApiResponse<UserLessonProgressResponse[]>>('GET', `/user-lesson-progress/user/${userId}/all-lessons${queryString ? `?${queryString}` : ''}`);
  },
  getAllUserUnityProgress: (userId: string, pagination?: PaginationParams) => {
    const params = new URLSearchParams();
    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.limit) params.append('limit', pagination.limit.toString());
    const queryString = params.toString();
    return apiRequest<ApiResponse<UserUnityProgressResponse[]>>('GET', `/user-unity-progress/user/${userId}/all-unities${queryString ? `?${queryString}` : ''}`);
  },
};

export default ProgressService;
