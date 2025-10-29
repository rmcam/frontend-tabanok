// src/types/cultural-content/cultural-content.d.ts

/**
 * @interface CulturalContent
 * @description Interfaz para el modelo de contenido cultural.
 */
export interface CulturalContent {
  id: string;
  category: string;
  title: string;
  description: string;
  contentUrl: string; // URL al contenido (video, artículo, etc.)
  // Añadir otros campos relevantes del modelo CulturalContent
}

/**
 * @interface CreateCulturalContentDto
 * @description DTO para crear nuevo contenido cultural.
 */
export interface CreateCulturalContentDto {
  category: string;
  title: string;
  description: string;
  contentUrl: string;
}

/**
 * @interface UpdateCulturalContentDto
 * @description DTO para actualizar contenido cultural existente.
 */
export interface UpdateCulturalContentDto {
  category?: string;
  title?: string;
  description?: string;
  contentUrl?: string;
}
