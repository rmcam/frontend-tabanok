// src/types/unities/unities.d.ts

/**
 * @interface UnityQueryParams
 * @description Interfaz para los parámetros de consulta al obtener unidades.
 */
export interface UnityQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  moduleId?: string;
  isLocked?: boolean;
  // Añadir otros parámetros de filtro si son necesarios
}
