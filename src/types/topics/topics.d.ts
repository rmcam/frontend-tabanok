// src/types/topics/topics.d.ts

/**
 * @interface TopicQueryParams
 * @description Interfaz para los parámetros de consulta al obtener temas.
 */
export interface TopicQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  unityId?: string;
  isActive?: boolean;
  // Añadir otros parámetros de filtro si son necesarios
}
