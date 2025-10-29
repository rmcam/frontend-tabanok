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
  // Añadir otros parámetros de filtro si son necesarios
}
