// src/types/api.d.ts

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  details?: unknown;
}

// Puedes añadir más interfaces según los modelos de datos de tu API
