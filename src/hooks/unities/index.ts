import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { unitiesService } from '../../services/unities';
import type { Unity, CreateUnityDto, UpdateUnityDto, Topic, Content } from '../../types/api';

/**
 * Claves de consulta para TanStack Query.
 */
export const unityQueryKeys = {
  all: ['unities'] as const,
  details: () => [...unityQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...unityQueryKeys.details(), id] as const,
};

/**
 * Hook para obtener una unidad específica con sus tópicos y contenido asociado.
 * @param unityId El ID de la unidad.
 * @returns Un objeto con los datos de la unidad, estado de carga y error.
 */
export const useUnityWithTopicsAndContent = (unityId: string) => {
  return useQuery<Unity & { topics: (Topic & { content: Content[] })[] }, Error>({
    queryKey: unityQueryKeys.detail(unityId),
    queryFn: () => unitiesService.getUnityWithTopicsAndContent(unityId),
    enabled: !!unityId, // Solo ejecuta la consulta si unityId existe
  });
};

/**
 * Hook para crear una nueva unidad.
 * Invalida las consultas de unidades después de una creación exitosa.
 * @returns Un objeto con la función de mutación, estado de carga y error.
 */
export const useCreateUnity = () => {
  const queryClient = useQueryClient();
  return useMutation<Unity, Error, CreateUnityDto>({
    mutationFn: unitiesService.createUnity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unityQueryKeys.all }); // Invalida todas las consultas de unidades
    },
  });
};

/**
 * Hook para actualizar una unidad existente.
 * Invalida las consultas de unidades y el detalle de la unidad después de una actualización exitosa.
 * @returns Un objeto con la función de mutación, estado de carga y error.
 */
export const useUpdateUnity = () => {
  const queryClient = useQueryClient();
  return useMutation<Unity, Error, { id: string; data: UpdateUnityDto }>({
    mutationFn: ({ id, data }) => unitiesService.updateUnity(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: unityQueryKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: unityQueryKeys.all });
    },
  });
};

/**
 * Hook para eliminar una unidad.
 * Invalida las consultas de unidades después de una eliminación exitosa.
 * @returns Un objeto con la función de mutación, estado de carga y error.
 */
export const useDeleteUnity = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: unitiesService.deleteUnity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unityQueryKeys.all });
    },
  });
};
