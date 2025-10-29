// src/types/common/common.d.ts

/**
 * @interface HealthResponse
 * @description Interfaz para la respuesta del endpoint /healthz.
 */
export interface HealthResponse {
  status: string;
  message: string;
}

/**
 * @interface WelcomeResponse
 * @description Interfaz para la respuesta del endpoint /.
 */
export type WelcomeResponse = string;

/**
 * @interface ApiResponse
 * @description Interfaz genérica para las respuestas de la API.
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode?: number;
}

/**
 * @interface ApiError
 * @description Interfaz para la estructura de errores de la API.
 */
export interface ApiError {
  message: string;
  statusCode: number;
  details?: unknown;
}
