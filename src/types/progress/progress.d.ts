// src/types/progress/progress.d.ts

/**
 * @interface SubmitExerciseDto
 * @description DTO para enviar la respuesta de un ejercicio.
 */
export interface SubmitExerciseDto {
  userAnswer: string | Record<string, unknown>; // Puede ser string o un objeto complejo
}

/**
 * @interface SubmitExerciseResponse
 * @description Interfaz para la respuesta del backend al enviar un ejercicio.
 */
export interface SubmitExerciseResponse {
  id: string;
  score: number;
  isCompleted: boolean;
  answers: Record<string, unknown>; // O puede ser string si userAnswer es siempre string
  exerciseId: string;
  userId: string;
  isCorrect: boolean;
  correctAnswers?: string | Record<string, unknown>; // Puede ser string o un objeto complejo
  message?: string; // Mensaje opcional para notificaciones
  details?: SubmitExerciseResponseDetails; // Mantener para feedback detallado si aplica
}

export interface AudioPronunciationDetails {
  expectedPhrase: string;
}

export interface FillInTheBlankDetails {
  blankResults: Array<{ id: string; isCorrect: boolean }>;
  correctBlanks: string[];
}

export interface MatchingDetails {
  correctPairs: Array<{ term: string; match: string }>;
}

export interface TranslationDetails {
  correctTranslation: string;
}

export type SubmitExerciseResponseDetails =
  | AudioPronunciationDetails
  | FillInTheBlankDetails
  | MatchingDetails
  | TranslationDetails;

/**
 * @interface SubmitExerciseRequestBody
 * @description Cuerpo de la solicitud para el nuevo endpoint POST /progress/submit-exercise.
 */
export interface SubmitExerciseRequestBody {
  userId: string;
  exerciseId: string;
  answers: Record<string, unknown>;
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
  answers: Record<string, unknown> | null;
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
  answers?: Record<string, unknown>;
  isCompleted?: boolean;
}

/**
 * @interface UpdateProgressCompletedDto
 * @description DTO para actualizar el progreso de un ejercicio como completado.
 */
export interface UpdateProgressCompletedDto {
  answers: Record<string, unknown>;
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
import { Module, Unity, Lesson, Topic } from "../learning/learning.d";

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
/**
 * @interface ExerciseUserProgress
 * @description Interfaz para el progreso de un ejercicio por usuario, anidada dentro del objeto Exercise.
 */
export interface ExerciseUserProgress {
  id: string;
  score: number | null;
  isCompleted: boolean;
  isActive: boolean;
}

/**
 * @interface UserExerciseProgressResponse
 * @description Interfaz para el progreso de un ejercicio por usuario, con información anidada del ejercicio.
 */
export interface UserExerciseProgressResponse {
  id: string;
  score: number | null;
  isCompleted: boolean;
  isActive: boolean; // Añadido para reflejar el estado activo del progreso
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
