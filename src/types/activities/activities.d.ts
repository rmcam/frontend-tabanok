// src/types/activities/activities.d.ts

/**
 * @interface Activity
 * @description Interfaz para el modelo de actividad.
 */
export interface Activity {
  id: string;
  lessonId: string;
  title: string;
  description?: string;
  type: string; // Ej: 'quiz', 'matching', 'fill-in-the-blank'
  content: any; // Contenido específico de la actividad
  order: number;
  points: number;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * @interface CreateActivityDto
 * @description DTO para crear una nueva actividad.
 */
export interface CreateActivityDto {
  lessonId: string;
  title: string;
  description?: string;
  type: string;
  content: any;
  order: number;
  points: number;
}

/**
 * @interface UpdateActivityDto
 * @description DTO para actualizar una actividad existente.
 */
export interface UpdateActivityDto {
  title?: string;
  description?: string;
  type?: string;
  content?: any;
  order?: number;
  points?: number;
  isCompleted?: boolean;
}

/**
 * @interface ActivityQueryParams
 * @description Interfaz para los parámetros de consulta al obtener actividades.
 */
export interface ActivityQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  lessonId?: string;
  type?: string;
  // Añadir otros parámetros de filtro si son necesarios
}
