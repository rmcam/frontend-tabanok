import { apiRequest } from '../_shared';
import type { Module, CreateModuleDto, UpdateModuleDto } from '../../types/api';

/**
 * Servicio para interactuar con los endpoints de Módulos.
 */
export const modulesService = {
  /**
   * Obtiene todos los módulos con su jerarquía completa (unidades, lecciones, etc.).
   * @returns Una promesa que resuelve con un array de módulos.
   */
  getAllModulesWithHierarchy: async (): Promise<Module[]> => {
    return apiRequest<Module[]>('GET', '/module/all-with-hierarchy');
  },

  /**
   * Obtiene un módulo específico con su jerarquía completa.
   * @param id El ID del módulo.
   * @returns Una promesa que resuelve con el módulo.
   */
  getModuleFullHierarchy: async (id: string): Promise<Module> => {
    return apiRequest<Module>('GET', `/module/${id}/full-hierarchy`);
  },

  /**
   * Obtiene las unidades de un módulo específico.
   * @param id El ID del módulo.
   * @returns Una promesa que resuelve con un array de unidades.
   */
  getUnitsByModuleId: async (id: string): Promise<Module[]> => {
    return apiRequest<Module[]>('GET', `/module/${id}/unities`);
  },

  /**
   * Crea un nuevo módulo.
   * @param data Los datos para crear el módulo.
   * @returns Una promesa que resuelve con el módulo creado.
   */
  createModule: async (data: CreateModuleDto): Promise<Module> => {
    return apiRequest<Module>('POST', '/module', data);
  },

  /**
   * Actualiza un módulo existente.
   * @param id El ID del módulo a actualizar.
   * @param data Los datos para actualizar el módulo.
   * @returns Una promesa que resuelve con el módulo actualizado.
   */
  updateModule: async (id: string, data: UpdateModuleDto): Promise<Module> => {
    return apiRequest<Module>('PATCH', `/module/${id}`, data);
  },

  /**
   * Elimina un módulo.
   * @param id El ID del módulo a eliminar.
   * @returns Una promesa que resuelve cuando el módulo ha sido eliminado.
   */
  deleteModule: async (id: string): Promise<void> => {
    return apiRequest<void>('DELETE', `/module/${id}`);
  },
};
