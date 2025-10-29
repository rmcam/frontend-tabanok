import type {
  Module,
  CreateModuleDto,
  UpdateModuleDto,
  ApiResponse,
} from '../../types'; // Importar desde el índice de tipos
import type { Unity } from '../../types/learning/learning.d'; // Usar importación de solo tipo

import { apiRequest } from '../_shared';

/**
 * Funciones específicas para los endpoints de módulos de aprendizaje.
 */
export const modulesService = {
  createModule: (moduleData: CreateModuleDto) =>
    apiRequest<ApiResponse<Module>>('POST', '/module', moduleData),
  // Cambiado el tipo de retorno a Module[] directamente, según la respuesta real de la API
  getAllModules: () =>
    apiRequest<Module[]>('GET', '/module'), 
  // Cambiado el tipo de retorno a Module directamente, según la respuesta real de la API
  getModuleById: async (id: string) => {
    const response = await apiRequest<Module>('GET', `/module/${id}`);
    return response;
  },
  updateModule: (id: string, moduleData: UpdateModuleDto) =>
    apiRequest<ApiResponse<Module>>('PUT', `/module/${id}`, moduleData),
  deleteModule: (id: string) =>
    apiRequest<ApiResponse<void>>('DELETE', `/module/${id}`),
  getUnitiesByModuleId: async (id: string) => {
    const response = await apiRequest<Unity[]>('GET', `/module/${id}/unities`); 
    return response;
  },
};
