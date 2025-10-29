import type { ApiResponse } from '../../types/common/common.d';
import type { Lesson, CreateLessonDto, UpdateLessonDto, LessonQueryParams } from '../../types/lessons/lessons.d';
import type { Unity } from '../../types/learning/learning.d';

import { apiRequest } from '../_shared';

/**
 * Funciones específicas para los endpoints de lecciones.
 */
export const lessonsService = {
  createLesson: (lessonData: CreateLessonDto) =>
    apiRequest<ApiResponse<Lesson>>('POST', '/lesson', lessonData),

  getAllLessons: (params?: LessonQueryParams) =>
    apiRequest<ApiResponse<Lesson[]>>('GET', '/lesson', params),

  getFeaturedLessons: (params?: LessonQueryParams) =>
    apiRequest<ApiResponse<Lesson[]>>('GET', '/lesson/featured', params),

  getLessonById: (id: string) =>
    apiRequest<Lesson | null>("GET", `/lesson/${id}`),

  updateLesson: (id: string, lessonData: UpdateLessonDto) =>
    apiRequest<ApiResponse<Lesson>>('PATCH', `/lesson/${id}`, lessonData),

  deleteLesson: (id: string) =>
    apiRequest<ApiResponse<void>>('DELETE', `/lesson/${id}`),

  getLessonsByUnityId: (unityId: string, params?: LessonQueryParams) =>
    apiRequest<ApiResponse<Lesson[]>>('GET', `/lesson/unity/${unityId}`, params),

  toggleLessonLock: (id: string) =>
    apiRequest<ApiResponse<Lesson>>('PATCH', `/lesson/${id}/toggle-lock`),

  updateLessonPoints: (id: string, points: number) =>
    apiRequest<ApiResponse<Lesson>>('PATCH', `/lesson/${id}/points`, { points }),

  markLessonAsCompleted: (id: string) =>
    apiRequest<ApiResponse<Lesson>>('PATCH', `/lesson/${id}/complete`),

  getDailyLesson: (userId: string) =>
    apiRequest<ApiResponse<Lesson>>('GET', `/lesson/daily-lesson/${userId}`),

  getAllUnitsWithLessons: (params?: LessonQueryParams) =>
    apiRequest<ApiResponse<Unity[]>>('GET', `/unity/all-with-lessons`, params),
};
