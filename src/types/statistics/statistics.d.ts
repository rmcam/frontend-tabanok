// src/types/statistics/statistics.d.ts

/**
 * @interface Statistics
 * @description Interfaz para el modelo de estadísticas de usuario.
 */
export interface Statistics {
  id: string;
  userId: string;
  totalPoints: number;
  lessonsCompleted: number;
  activitiesCompleted: number;
  // Añadir otros campos relevantes del modelo Statistics
}

/**
 * @interface CreateStatisticsDto
 * @description DTO para crear estadísticas de usuario.
 */
export interface CreateStatisticsDto {
  userId: string;
  totalPoints?: number;
  lessonsCompleted?: number;
  activitiesCompleted?: number;
}

/**
 * @interface GenerateReportDto
 * @description DTO para generar un reporte de estadísticas.
 */
export interface GenerateReportDto {
  startDate: string;
  endDate: string;
  // Otros parámetros para el reporte
}
