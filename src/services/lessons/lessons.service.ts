import type { ApiResponse, CreateLessonDto, UpdateLessonDto } from '../../types';
import type { Lesson, Unity } from '../../types/learning/learning.d';

import { apiRequest } from '../_shared';

interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Funciones específicas para los endpoints de lecciones.
 */
export const lessonsService = {
  createLesson: (lessonData: CreateLessonDto) =>
    apiRequest<ApiResponse<Lesson>>('POST', '/lesson', lessonData),
  getAllLessons: (pagination?: PaginationParams) => {
    const params = new URLSearchParams();
    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.limit) params.append('limit', pagination.limit.toString());
    const queryString = params.toString();
    return apiRequest<Lesson[]>('GET', `/lesson${queryString ? `?${queryString}` : ''}`);
  },
  getFeaturedLessons: (pagination?: PaginationParams) => {
    const params = new URLSearchParams();
    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.limit) params.append('limit', pagination.limit.toString());
    const queryString = params.toString();
    return apiRequest<Lesson[]>('GET', `/lesson/featured${queryString ? `?${queryString}` : ''}`);
  },
  getLessonById: (id: string) =>
    apiRequest<Lesson>("GET", `/lesson/${id}`),
  updateLesson: (id: string, lessonData: UpdateLessonDto) =>
    apiRequest<ApiResponse<Lesson>>('PATCH', `/lesson/${id}`, lessonData),
  deleteLesson: (id: string) =>
    apiRequest<ApiResponse<void>>('DELETE', `/lesson/${id}`),
  getLessonsByUnityId: (unityId: string, pagination?: PaginationParams) => {
    const params = new URLSearchParams();
    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.limit) params.append('limit', pagination.limit.toString());
    const queryString = params.toString();
    return apiRequest<Lesson[]>('GET', `/lesson/unity/${unityId}${queryString ? `?${queryString}` : ''}`);
  },
  toggleLessonLock: (id: string) =>
    apiRequest<ApiResponse<Lesson>>('PATCH', `/lesson/${id}/toggle-lock`),
  updateLessonPoints: (id: string, points: number) =>
    apiRequest<ApiResponse<Lesson>>('PATCH', `/lesson/${id}/points`, { points }),
  markLessonAsCompleted: (id: string) =>
    apiRequest<ApiResponse<Lesson>>('PATCH', `/lesson/${id}/complete`),
  getDailyLesson: (userId: string) =>
    apiRequest<Lesson>('GET', `/lesson/daily-lesson/${userId}`),
  getAllUnitsWithLessons: (pagination?: PaginationParams) => {
    const params = new URLSearchParams();
    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.limit) params.append('limit', pagination.limit.toString());
    const queryString = params.toString();
    return apiRequest<Unity[]>('GET', `/unity/all-with-lessons${queryString ? `?${queryString}` : ''}`);
  },
};
