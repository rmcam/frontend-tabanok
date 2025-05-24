import type { ApiError as IApiError } from '../types/api';

export const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.error('VITE_API_URL no está definida en las variables de entorno.');
}

/**
 * Función auxiliar para manejar las respuestas de la API.
 * Lanza un error si la respuesta no es OK, de lo contrario, devuelve los datos JSON.
 * @param response La respuesta de la API.
 * @returns Los datos JSON de la respuesta.
 * @throws ApiError Si la respuesta no es exitosa.
 */
export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: IApiError;
    try {
      errorData = await response.json();
    } catch (jsonError) {
      // Si la respuesta no es JSON, crear un error genérico
      errorData = {
        message: `Error de red o servidor: ${response.statusText}`,
        statusCode: response.status,
        details: jsonError,
      };
    }
    throw new ApiError(errorData.message || `Error: ${response.statusText}`, response.status, errorData.details);
  }
  return response.json();
}

// Clase personalizada para errores de API
export class ApiError extends Error {
  statusCode: number;
  details: unknown;

  constructor(message: string, statusCode: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

// Ejemplo de función para obtener datos
export const fetchData = async <T>(endpoint: string): Promise<T> => {
  const response = await fetch(`${API_URL}${endpoint}`);
  return handleApiResponse<T>(response);
};
