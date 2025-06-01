import type {
  ApiError as IApiError,
} from '../types/api';

// No es necesario importar el store de autenticación aquí si el token se maneja con cookies.
// import { useAuthStore } from '../stores/authStore'; // Eliminar o comentar esta línea

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
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  } else {
    return response.text() as Promise<T>; // Asumir que es texto si no es JSON
  }
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

// Función genérica para realizar peticiones HTTP
export async function apiRequest<T>(
  method: string,
  endpoint: string,
  data?: unknown,
  headers?: HeadersInit,
  isFormData?: boolean // Nuevo parámetro para indicar si el cuerpo es FormData
): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  const finalHeaders: Record<string, string> = {
    ...(headers as Record<string, string>), // Convertir HeadersInit a Record<string, string>
  };

  // Si no es FormData, establecer Content-Type a application/json por defecto
  if (!isFormData && !finalHeaders['Content-Type']) {
    finalHeaders['Content-Type'] = 'application/json';
  }

  // Añadir el encabezado Authorization si hay un token de acceso en localStorage y no está ya presente
  const accessToken = localStorage.getItem('accessToken'); // Asumiendo que el token se guarda aquí
  if (accessToken && !finalHeaders['Authorization']) {
    finalHeaders['Authorization'] = `Bearer ${accessToken}`;
  }

  const config: RequestInit = {
    method,
    headers: finalHeaders,
    body: isFormData ? (data as FormData) : (data ? JSON.stringify(data) : undefined),
    credentials: 'include', // Incluir cookies en las solicitudes cross-origin
  };

  const response = await fetch(url, config);
  return handleApiResponse<T>(response);
}
