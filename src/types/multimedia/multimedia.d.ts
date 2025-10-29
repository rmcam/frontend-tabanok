// src/types/multimedia/multimedia.d.ts

/**
 * @interface Multimedia
 * @description Interfaz para el modelo de archivo multimedia.
 */
export interface Multimedia {
  id: string; // Cambiado a string para consistencia con otros IDs (UUIDs)
  fileName: string;
  filePath: string;
  fileType: string;
  mimeType: string;
  size: number;
  userId?: string;
  uploadDate?: string;
  lesson?: string;
  // Añadir otros campos relevantes del modelo Multimedia
}

/**
 * @interface MultimediaQueryParams
 * @description Interfaz para los parámetros de consulta al obtener archivos multimedia.
 */
export interface MultimediaQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  fileType?: string;
  userId?: string;
  // Añadir otros parámetros de filtro si son necesarios
}
