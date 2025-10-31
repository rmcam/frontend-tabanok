import type {
  ApiError as IApiError,
} from '../types/common/common';


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
  if (response.status === 204) { // No Content
    return null as T;
  }
  if (contentType && contentType.includes('application/json')) {
    const jsonResponse = await response.json();
    console.log('API Response - JSON:', jsonResponse); // Log de la respuesta JSON
    return jsonResponse;
  } else {
    // Si la respuesta es OK pero no es JSON, y no es 204 No Content,
    // asumimos que no hay un cuerpo de datos relevante para el tipo esperado (T).
    // Devolver null es la opción más segura para evitar errores de tipo.
    console.log('API Response - Non-JSON or 204:', null); // Log para respuestas no JSON o 204
    return null as T;
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
  isFormData?: boolean // Nuevo parámetro para indicar si si el cuerpo es FormData
): Promise<T> {
  let requestUrl = `${API_URL}${endpoint}`;
  const config: RequestInit = {
    method,
    credentials: 'include', // Incluir cookies en las solicitudes cross-origin
  };

  const finalHeaders: Record<string, string> = {
    ...(headers as Record<string, string>), // Convertir HeadersInit a Record<string, string>
  };

  if (method === 'GET' || method === 'HEAD') {
    if (data) {
      const queryParams = new URLSearchParams(data as Record<string, string>).toString();
      requestUrl = `${requestUrl}?${queryParams}`;
    }
    // No body for GET/HEAD requests
  } else {
    // Para otros métodos (POST, PUT, DELETE, etc.), incluir el cuerpo
    if (!isFormData && !finalHeaders['Content-Type']) {
      finalHeaders['Content-Type'] = 'application/json';
    }
    config.body = isFormData ? (data as FormData) : (data ? JSON.stringify(data) : undefined);
  }

  config.headers = finalHeaders;

  console.log('API Request - URL:', requestUrl);
  console.log('API Request - Config:', config);

  const response = await fetch(requestUrl, config);
  return handleApiResponse<T>(response);
}
