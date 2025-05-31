import type { ApiResponse, CreateLessonDto, UpdateLessonDto } from '../../types/api';
import type { LearningLesson } from '../../types/learning';

import { apiRequest } from '../_shared';

/**
 * Funciones específicas para los endpoints de lecciones.
 */
export const lessonsService = {
  createLesson: (lessonData: CreateLessonDto) =>
    apiRequest<ApiResponse<LearningLesson>>('POST', '/lesson', lessonData),
  getAllLessons: () =>
    apiRequest<LearningLesson[]>('GET', '/lesson'),
  getFeaturedLessons: () =>
    apiRequest<LearningLesson[]>('GET', '/lesson/featured'),
  getLessonById: (id: string) =>
    apiRequest<LearningLesson>('GET', `/lesson/${id}`),
  updateLesson: (id: string, lessonData: UpdateLessonDto) =>
    apiRequest<ApiResponse<LearningLesson>>('PATCH', `/lesson/${id}`, lessonData),
  deleteLesson: (id: string) =>
    apiRequest<ApiResponse<void>>('DELETE', `/lesson/${id}`),
  getLessonsByUnityId: (unityId: string) =>
    apiRequest<LearningLesson[]>('GET', `/lesson/unity/${unityId}`),
  toggleLessonLock: (id: string) =>
    apiRequest<ApiResponse<LearningLesson>>('PATCH', `/lesson/${id}/toggle-lock`),
  updateLessonPoints: (id: string, points: number) =>
    apiRequest<ApiResponse<LearningLesson>>('PATCH', `/lesson/${id}/points`, { points }),
  markLessonAsCompleted: (id: string) =>
    apiRequest<ApiResponse<LearningLesson>>('PATCH', `/lesson/${id}/complete`),
};
