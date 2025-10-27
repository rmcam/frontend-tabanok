import { apiRequest } from '../_shared';
import type { ProgressDto, CreateProgressDto, ApiResponse, UserLessonProgress, UserUnityProgress, SubmitExerciseDto, SubmitExerciseResponse } from '../../types/api';
import type { Exercise } from '../../types/api';

const ProgressService = {
  getProgressByUser: (userId: string) => {
    return apiRequest<ProgressDto[]>('GET', `/progress/user/${userId}`);
  },
  createProgress: (progressData: CreateProgressDto) => {
    return apiRequest<ProgressDto>('POST', '/progress', progressData);
  },
  getOrCreateProgress: async (userId: string, exerciseId: string): Promise<ProgressDto> => {
    const userProgresses = await apiRequest<ProgressDto[]>('GET', `/progress/user/${userId}`);
    let progress = userProgresses.find(p => p.exerciseId === exerciseId);

    if (!progress) {
      const newProgressData: CreateProgressDto = {
        userId,
        exerciseId,
        isCompleted: false,
        score: 0,
        answers: {},
      };
      progress = await apiRequest<ProgressDto>('POST', '/progress', newProgressData);
    }
    return progress;
  },
  markProgressAsCompleted: (progressId: string, data: { answers: Record<string, any> }) => {
    return apiRequest<ProgressDto>('PATCH', `/progress/${progressId}/complete`, data);
  },
  updateProgressScore: (progressId: string, data: { score: number }) => {
    return apiRequest<ProgressDto>('PATCH', `/progress/${progressId}/score`, data);
  },
  submitExercise: (id: string, submission: SubmitExerciseDto) => {
    return apiRequest<ApiResponse<SubmitExerciseResponse>>('POST', `/progress/${id}/submit-exercise`, submission);
  },

  // Nuevos métodos para progreso de lecciones y unidades
  getAllUserLessonProgress: (userId: string) => {
    return apiRequest<UserLessonProgress[]>('GET', `/user-lesson-progress/user/${userId}/all-lessons`);
  },
  getAllUserUnityProgress: (userId: string) => {
    return apiRequest<UserUnityProgress[]>('GET', `/user-unity-progress/user/${userId}/all-unities`);
  },
};

export default ProgressService;
