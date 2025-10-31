// src/types/exercises/exercises.d.ts

/**
 * @interface ExerciseQueryParams
 * @description Interfaz para los parámetros de consulta al obtener ejercicios.
 */
export interface ExerciseQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  topicId?: string;
  lessonId?: string;
  withProgress?: boolean; // Añadido para solicitar el progreso del usuario
  // Añadir otros parámetros de filtro si son necesarios
}

/**
 * @interface Exercise
 * @description Interfaz base para un ejercicio.
 */
import type {
  QuizContent,
  MatchingContent,
  FillInTheBlankContent,
  AudioPronunciationContent,
  TranslationContent,
  FunFactContent,
} from "../learning/learning.d"; // Importar los tipos de contenido específicos

/**
 * @interface Exercise
 * @description Interfaz base para un ejercicio, con un tipo discriminado para el contenido.
 */
export type Exercise = {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  topicId: string;
  lessonId: string;
  createdAt: string;
  updatedAt: string;
  userProgress?: ExerciseUserProgress | null; // Progreso del usuario para este ejercicio
} & (
  | { type: "quiz"; content: QuizContent }
  | { type: "fill-in-the-blank"; content: FillInTheBlankContent }
  | { type: "matching"; content: MatchingContent }
  | { type: "translation"; content: TranslationContent }
  | { type: "audio-pronunciation"; content: AudioPronunciationContent }
  | { type: "fun-fact"; content: FunFactContent }
);

/**
 * @interface PaginatedExercisesResponse
 * @description Interfaz para la respuesta paginada de ejercicios.
 */
export interface PaginatedExercisesResponse {
  data: Exercise[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

// Reexportar Exercise para que pueda ser importado desde otros módulos
export type { Exercise };
