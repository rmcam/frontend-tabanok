// src/types/categories/categories.d.ts

/**
 * @interface CategoryMetricsResponseDto
 * @description DTO para las métricas de una categoría específica.
 */
export interface CategoryMetricsResponseDto {
  category: string;
  progress: number; // Porcentaje de progreso
  completedItems: number;
  totalItems: number;
  // Añadir otros campos relevantes
}

/**
 * @interface AvailableCategoryDto
 * @description DTO para una categoría disponible para el usuario.
 */
export interface AvailableCategoryDto {
  id: string;
  name: string;
  description: string;
  // Añadir otros campos relevantes
}
