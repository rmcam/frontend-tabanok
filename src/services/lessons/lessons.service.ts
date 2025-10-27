import type { ApiResponse, CreateLessonDto, UpdateLessonDto, Lesson, Unity } from '../../types/api';
import type { LearningLesson } from '../../types/learning'; // Mantener por si se usa en otros lugares

import { apiRequest } from '../_shared';

/**
 * Funciones específicas para los endpoints de lecciones.
 */
export const lessonsService = {
  createLesson: (lessonData: CreateLessonDto) =>
    apiRequest<ApiResponse<Lesson>>('POST', '/lesson', lessonData),
  getAllLessons: () =>
    apiRequest<Lesson[]>('GET', '/lesson'),
  getFeaturedLessons: () =>
    apiRequest<Lesson[]>('GET', '/lesson/featured'),
  getLessonById: (id: string) =>
    apiRequest<Lesson>('GET', `/lesson/${id}`), // Cambiado a Lesson para incluir ejercicios
  updateLesson: (id: string, lessonData: UpdateLessonDto) =>
    apiRequest<ApiResponse<Lesson>>('PATCH', `/lesson/${id}`, lessonData),
  deleteLesson: (id: string) =>
    apiRequest<ApiResponse<void>>('DELETE', `/lesson/${id}`),
  getLessonsByUnityId: (unityId: string) =>
    apiRequest<Lesson[]>('GET', `/lesson/unity/${unityId}`),
  toggleLessonLock: (id: string) =>
    apiRequest<ApiResponse<Lesson>>('PATCH', `/lesson/${id}/toggle-lock`),
  updateLessonPoints: (id: string, points: number) =>
    apiRequest<ApiResponse<Lesson>>('PATCH', `/lesson/${id}/points`, { points }),
  markLessonAsCompleted: (id: string) =>
    apiRequest<ApiResponse<Lesson>>('PATCH', `/lesson/${id}/complete`),
  getDailyLesson: (userId: string) =>
    apiRequest<Lesson>('GET', `/lesson/daily-lesson/${userId}`),
  getAllUnitsWithLessons: () =>
    apiRequest<Unity[]>('GET', '/unity/all-with-lessons'), // Nuevo endpoint para obtener unidades con lecciones
};
