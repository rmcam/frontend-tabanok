// src/types/progress/progress.d.ts

/**
 * @interface SubmitExerciseDto
 * @description DTO para enviar la respuesta de un ejercicio.
 */
export interface SubmitExerciseDto {
  userAnswer: string | Record<string, any>; // Puede ser string o un objeto complejo
}

/**
 * @interface SubmitExerciseResponse
 * @description Interfaz para la respuesta del backend al enviar un ejercicio.
 */
export interface SubmitExerciseResponse {
  isCorrect: boolean;
  score: number;
  awardedPoints: number;
  message?: string; // Mensaje opcional para notificaciones
  exerciseTitle?: string; // Opcional, si el backend lo envía
  details?: any; // Añadido para el feedback detallado
  userAnswer?: string; // Añadido si el backend devuelve la respuesta del usuario
  userId?: string; // Añadido para el progreso del usuario
  exerciseId?: string; // Añadido para el progreso del ejercicio
}

/**
 * @interface ProgressDto
 * @description DTO para el progreso de un ejercicio por usuario.
 */
export interface ProgressDto {
  id: string;
  userId: string;
  exerciseId: string;
  contentId?: string; // Añadido para el progreso de contenido/lecciones
  score: number | null;
  answers: Record<string, any> | null;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  // Añadir otros campos relevantes del modelo Progress
}

/**
 * @interface CreateProgressDto
 * @description DTO para crear un nuevo progreso de ejercicio.
 */
export interface CreateProgressDto {
  userId: string;
  exerciseId?: string; // Opcional si es progreso de contenido
  contentId?: string; // Opcional si es progreso de ejercicio
  score?: number;
  answers?: Record<string, any>;
  isCompleted?: boolean;
}

/**
 * @interface UpdateProgressCompletedDto
 * @description DTO para actualizar el progreso de un ejercicio como completado.
 */
export interface UpdateProgressCompletedDto {
  answers: Record<string, any>;
}

/**
 * @interface UpdateProgressScoreDto
 * @description DTO para actualizar el puntaje de un progreso de ejercicio.
 */
export interface UpdateProgressScoreDto {
  score: number;
}

/**
 * @interface UpdateLearningProgressDto
 * @description DTO para actualizar el progreso de aprendizaje.
 */
export interface UpdateLearningProgressDto {
  lessonsCompleted?: number;
  activitiesCompleted?: number;
  // Otros campos de progreso
}

/**
 * @interface UpdateCategoryProgressDto
 * @description DTO para actualizar el progreso de una categoría.
 */
export interface UpdateCategoryProgressDto {
  progress: number;
  completedItems?: number;
}

/**
 * @interface UserProgress
 * @description Interfaz para el progreso general de un usuario.
 */
import { Module, Unity, Lesson, Topic, Exercise } from "../learning/learning.d";

/**
 * @interface UserTopicProgressResponse
 * @description Interfaz para el progreso de un tema, extendiendo la interfaz Topic.
 */
export interface UserTopicProgressResponse extends Topic {
  isLocked: boolean;
  requiredPoints: number;
  isActive: boolean;
}

/**
 * @interface UserLessonProgressResponse
 * @description Interfaz para el progreso de una lección, extendiendo la interfaz Lesson y anidando temas.
 */
export interface UserLessonProgressResponse extends Lesson {
  isLocked: boolean;
  isCompleted: boolean;
  isFeatured: boolean;
  requiredPoints: number;
  isActive: boolean;
  topics: UserTopicProgressResponse[];
}

/**
 * @interface UserUnityProgressResponse
 * @description Interfaz para el progreso de una unidad, extendiendo la interfaz Unity y anidando lecciones.
 */
export interface UserUnityProgressResponse extends Unity {
  isLocked: boolean;
  requiredPoints: number;
  isActive: boolean;
  lessons: UserLessonProgressResponse[];
}

/**
 * @interface UserModuleProgressResponse
 * @description Interfaz para el progreso de un módulo, extendiendo la interfaz Module y anidando unidades.
 */
export interface UserModuleProgressResponse extends Module {
  isLocked: boolean;
  points: number;
  unities: UserUnityProgressResponse[];
}

/**
 * @interface UserExerciseProgressResponse
 * @description Interfaz para el progreso de un ejercicio por usuario, con información anidada del ejercicio.
 */
export interface UserExerciseProgressResponse {
  id: string;
  score: number | null;
  isCompleted: boolean;
  exercise: {
    id: string;
    title: string;
    type: string;
    difficulty: string;
  };
}

/**
 * @interface GetUserProgressFilters
 * @description Interfaz para los parámetros de consulta del endpoint de progreso del usuario.
 */
export interface GetUserProgressFilters {
  page?: number;
  limit?: number;
  moduleId?: string;
  unityId?: string;
  lessonId?: string;
  exerciseId?: string;
  includeExercises?: boolean;
  includeModules?: boolean;
}

/**
 * @interface UserProgressResponse
 * @description Interfaz para un elemento de progreso del usuario, que puede ser un módulo, unidad, lección o ejercicio.
 */
export interface UserProgressResponse {
  id: string;
  userId: string;
  moduleId?: string;
  unityId?: string;
  lessonId?: string;
  exerciseId?: string;
  score?: number;
  isCompleted: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  // Podríamos anidar la información del módulo/unidad/lección/ejercicio aquí si el backend la devuelve
  module?: UserModuleProgressResponse;
  unity?: UserUnityProgressResponse;
  lesson?: UserLessonProgressResponse;
  exercise?: UserExerciseProgressResponse;
}

/**
 * @interface PaginatedUserProgressResponse
 * @description Interfaz para la respuesta paginada del progreso del usuario.
 */
export interface PaginatedUserProgressResponse {
  data: UserProgressResponse[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}
