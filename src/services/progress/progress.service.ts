import { apiRequest } from '../_shared';
import type { ApiResponse, SubmitExerciseDto, SubmitExerciseResponse, ProgressDto, CreateProgressDto } from '../../types';
import type { UserLessonProgressResponse, UserUnityProgressResponse, UserExerciseProgressResponse } from '../../types/progress/progress.d';
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
    return apiRequest<UserExerciseProgressResponse[]>('GET', `/progress/user/${userId}${queryString ? `?${queryString}` : ''}`);
  },
  createProgress: (progressData: CreateProgressDto) => {
    return apiRequest<UserExerciseProgressResponse>('POST', '/progress', progressData);
  },
  getOrCreateProgress: async (userId: string, exerciseId: string, pagination?: PaginationParams): Promise<UserExerciseProgressResponse> => {
    const userProgresses = await ProgressService.getProgressByUser(userId, pagination);
    let progress = userProgresses.find(p => p.exercise.id === exerciseId); // Acceder a p.exercise.id

    if (!progress) {
      const newProgressData: CreateProgressDto = {
        userId,
        exerciseId,
        isCompleted: false,
        score: 0,
        answers: {},
      };
      progress = await apiRequest<UserExerciseProgressResponse>('POST', '/progress', newProgressData);
    }
    return progress;
  },
  markProgressAsCompleted: (progressId: string, data: { answers: Record<string, any> }) => {
    return apiRequest<UserExerciseProgressResponse>('PATCH', `/progress/${progressId}/complete`, data);
  },
  updateProgressScore: (progressId: string, data: { score: number }) => {
    return apiRequest<UserExerciseProgressResponse>('PATCH', `/progress/${progressId}/score`, data);
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
    return apiRequest<UserLessonProgressResponse[]>('GET', `/user-lesson-progress/user/${userId}/all-lessons${queryString ? `?${queryString}` : ''}`);
  },
  getAllUserUnityProgress: (userId: string, pagination?: PaginationParams) => {
    const params = new URLSearchParams();
    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.limit) params.append('limit', pagination.limit.toString());
    const queryString = params.toString();
    return apiRequest<UserUnityProgressResponse[]>('GET', `/user-unity-progress/user/${userId}/all-unities${queryString ? `?${queryString}` : ''}`);
  },
};

export default ProgressService;
