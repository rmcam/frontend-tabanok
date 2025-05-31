import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { modulesService } from '../../services/modules';
import type { Module, CreateModuleDto, UpdateModuleDto } from '../../types/api';

/**
 * Claves de consulta para TanStack Query.
 */
export const moduleQueryKeys = {
  all: ['modules'] as const,
  lists: () => [...moduleQueryKeys.all, 'list'] as const,
  details: () => [...moduleQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...moduleQueryKeys.details(), id] as const,
  units: (moduleId: string) => [...moduleQueryKeys.all, 'units', moduleId] as const,
};

/**
 * Hook para obtener todos los módulos con su jerarquía completa.
 * @returns Un objeto con los datos de los módulos, estado de carga y error.
 */
export const useAllModulesWithHierarchy = () => {
  return useQuery<Module[], Error>({
    queryKey: moduleQueryKeys.lists(),
    queryFn: modulesService.getAllModulesWithHierarchy,
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
  });
};

/**
 * Hook para obtener un módulo específico con su jerarquía completa.
 * @param moduleId El ID del módulo.
 * @returns Un objeto con los datos del módulo, estado de carga y error.
 */
export const useModuleFullHierarchy = (moduleId: string) => {
  return useQuery<Module, Error>({
    queryKey: moduleQueryKeys.detail(moduleId),
    queryFn: () => modulesService.getModuleFullHierarchy(moduleId),
    enabled: !!moduleId, // Solo ejecuta la consulta si moduleId existe
  });
};

/**
 * Hook para obtener las unidades de un módulo específico.
 * @param moduleId El ID del módulo.
 * @returns Un objeto con los datos de las unidades, estado de carga y error.
 */
export const useUnitsByModuleId = (moduleId: string) => {
  return useQuery<Module[], Error>({
    queryKey: moduleQueryKeys.units(moduleId),
    queryFn: () => modulesService.getUnitsByModuleId(moduleId),
    enabled: !!moduleId,
  });
};

/**
 * Hook para crear un nuevo módulo.
 * Invalida las consultas de módulos después de una creación exitosa.
 * @returns Un objeto con la función de mutación, estado de carga y error.
 */
export const useCreateModule = () => {
  const queryClient = useQueryClient();
  return useMutation<Module, Error, CreateModuleDto>({
    mutationFn: modulesService.createModule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: moduleQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: moduleQueryKeys.all }); // Invalida todas las consultas de módulos
    },
  });
};

/**
 * Hook para actualizar un módulo existente.
 * Invalida las consultas de módulos y el detalle del módulo después de una actualización exitosa.
 * @returns Un objeto con la función de mutación, estado de carga y error.
 */
export const useUpdateModule = () => {
  const queryClient = useQueryClient();
  return useMutation<Module, Error, { id: string; data: UpdateModuleDto }>({
    mutationFn: ({ id, data }) => modulesService.updateModule(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: moduleQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: moduleQueryKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: moduleQueryKeys.all });
    },
  });
};

/**
 * Hook para eliminar un módulo.
 * Invalida las consultas de módulos después de una eliminación exitosa.
 * @returns Un objeto con la función de mutación, estado de carga y error.
 */
export const useDeleteModule = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: modulesService.deleteModule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: moduleQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: moduleQueryKeys.all });
    },
  });
};
