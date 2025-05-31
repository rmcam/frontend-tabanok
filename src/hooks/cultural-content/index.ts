import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { culturalContentService } from '../../services/cultural-content';
import type { CulturalContent, CreateCulturalContentDto, UpdateCulturalContentDto } from '../../types/api';

/**
 * Claves de consulta para TanStack Query.
 */
export const culturalContentQueryKeys = {
  all: ['culturalContent'] as const,
  lists: (page?: number, limit?: number) => [...culturalContentQueryKeys.all, 'list', page, limit] as const,
  byCategory: (category: string) => [...culturalContentQueryKeys.all, 'byCategory', category] as const,
  details: () => [...culturalContentQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...culturalContentQueryKeys.details(), id] as const,
};

/**
 * Hook para obtener todo el contenido cultural disponible (con paginación).
 * @param page El número de página (opcional).
 * @param limit El límite de elementos por página (opcional).
 * @returns Un objeto con los datos del contenido cultural, estado de carga y error.
 */
export const useAllCulturalContent = (page?: number, limit?: number) => {
  return useQuery<CulturalContent[], Error>({
    queryKey: culturalContentQueryKeys.lists(page, limit),
    queryFn: () => culturalContentService.getAllCulturalContent(page, limit),
  });
};

/**
 * Hook para filtrar contenido cultural por categoría.
 * @param category La categoría del contenido cultural.
 * @returns Un objeto con los datos del contenido cultural, estado de carga y error.
 */
export const useCulturalContentByCategory = (category: string) => {
  return useQuery<CulturalContent[], Error>({
    queryKey: culturalContentQueryKeys.byCategory(category),
    queryFn: () => culturalContentService.getCulturalContentByCategory(category),
    enabled: !!category,
  });
};

/**
 * Hook para obtener un contenido cultural específico por su ID.
 * @param culturalContentId El ID del contenido cultural.
 * @returns Un objeto con los datos del contenido cultural, estado de carga y error.
 */
export const useCulturalContentById = (culturalContentId: string) => {
  return useQuery<CulturalContent, Error>({
    queryKey: culturalContentQueryKeys.detail(culturalContentId),
    queryFn: () => culturalContentService.getCulturalContentById(culturalContentId),
    enabled: !!culturalContentId,
  });
};

/**
 * Hook para crear un nuevo contenido cultural.
 * Invalida las consultas de contenido cultural después de una creación exitosa.
 * @returns Un objeto con la función de mutación, estado de carga y error.
 */
export const useCreateCulturalContent = () => {
  const queryClient = useQueryClient();
  return useMutation<CulturalContent, Error, CreateCulturalContentDto>({
    mutationFn: culturalContentService.createCulturalContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: culturalContentQueryKeys.all });
    },
  });
};

/**
 * Hook para actualizar un contenido cultural existente.
 * Invalida las consultas de contenido cultural y el detalle del contenido después de una actualización exitosa.
 * @returns Un objeto con la función de mutación, estado de carga y error.
 */
export const useUpdateCulturalContent = () => {
  const queryClient = useQueryClient();
  return useMutation<CulturalContent, Error, { id: string; data: UpdateCulturalContentDto }>({
    mutationFn: ({ id, data }) => culturalContentService.updateCulturalContent(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: culturalContentQueryKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: culturalContentQueryKeys.all });
    },
  });
};

/**
 * Hook para eliminar un contenido cultural.
 * Invalida las consultas de contenido cultural después de una eliminación exitosa.
 * @returns Un objeto con la función de mutación, estado de carga y error.
 */
export const useDeleteCulturalContent = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: culturalContentService.deleteCulturalContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: culturalContentQueryKeys.all });
    },
  });
};
