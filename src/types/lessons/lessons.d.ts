// src/types/lessons/lessons.d.ts

/**
 * @interface Lesson
 * @description Interfaz para el modelo de lección.
 */
export interface Lesson {
  id: string;
  unityId: string;
  title: string;
  description: string;
  guideContent?: string;
  order: number;
  isLocked: boolean;
  requiredPoints: number;
  isCompleted: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * @interface CreateLessonDto
 * @description DTO para crear una nueva lección.
 */
export interface CreateLessonDto {
  unityId: string;
  title: string;
  description: string;
  content: string;
  order: number;
  requiredPoints: number;
}

/**
 * @interface UpdateLessonDto
 * @description DTO para actualizar una lección existente.
 */
export interface UpdateLessonDto {
  title?: string;
  description?: string;
  content?: string;
  order?: number;
  isLocked?: boolean;
  requiredPoints?: number;
  isCompleted?: boolean;
}

/**
 * @interface LessonQueryParams
 * @description Interfaz para los parámetros de consulta al obtener lecciones.
 */
export interface LessonQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  unityId?: string;
  isLocked?: boolean;
  isCompleted?: boolean;
  // Añadir otros parámetros de filtro si son necesarios
}
