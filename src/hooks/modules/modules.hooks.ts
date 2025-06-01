import { useQuery } from '@tanstack/react-query';
import { modulesService } from '@/services/modules/modules.service';
import type { Module, Unity } from '@/types/api';

/**
 * Hook para obtener todos los módulos de aprendizaje.
 */
export const useAllModules = () => {
  return useQuery<Module[], Error>({
    queryKey: ['modules'],
    queryFn: async () => {
      const response = await modulesService.getAllModules();
      return response;
    },
  });
};

/**
 * Hook para obtener un módulo por su ID.
 */
export const useModuleById = (id: string) => {
  return useQuery<Module | null, Error>({ // Cambiar el tipo de retorno a Module | null
    queryKey: ['modules', id],
    queryFn: async () => {
      const response = await modulesService.getModuleById(id);
      return response || null;
    },
    enabled: !!id,
    // Eliminar la función select para devolver el objeto Module completo
  });
};

/**
 * Hook para obtener las unidades de un módulo específico.
 */
export const useUnitiesByModuleId = (moduleId: string) => {
  return useQuery<Unity[], Error>({
    queryKey: ['modules', moduleId, 'unities'],
    queryFn: async () => {
      const response = await modulesService.getUnitiesByModuleId(moduleId); // response es de tipo ModuleWithUnities
      return response.unities || [];
    },
    enabled: !!moduleId,
  });
};
