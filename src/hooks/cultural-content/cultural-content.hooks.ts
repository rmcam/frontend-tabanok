import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { culturalContentService } from '../../services/cultural-content/cultural-content.service';
import { ApiError } from '../../services/_shared';
import type {
  ApiResponse,
  CulturalContent,
  CreateCulturalContentDto,
  UpdateCulturalContentDto,
} from '../../types/api';

/**
 * Hooks para los endpoints de contenido cultural.
 */
export const useAllCulturalContent = () => {
  return useQuery<CulturalContent[], ApiError>({
    queryKey: ['culturalContent'],
    queryFn: async () => (await culturalContentService.getAllCulturalContent()).data,
  });
};

export const useCulturalContentById = (id: string) => {
  return useQuery<CulturalContent, ApiError>({
    queryKey: ['culturalContent', id],
    queryFn: async () => (await culturalContentService.getCulturalContentById(id)).data,
    enabled: !!id,
  });
};

export const useCreateCulturalContent = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<CulturalContent>, ApiError, CreateCulturalContentDto>({
    mutationFn: culturalContentService.createCulturalContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['culturalContent'] });
      toast.success('Contenido cultural creado exitosamente.');
    },
    onError: (error) => {
      console.error('Error al crear contenido cultural:', error.message, error.details);
    },
  });
};

export const useUpdateCulturalContent = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<CulturalContent>, ApiError, { id: string, contentData: UpdateCulturalContentDto }>({
    mutationFn: ({ id, contentData }) => culturalContentService.updateCulturalContent(id, contentData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['culturalContent', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['culturalContent'] });
      toast.success(data.message || 'Contenido cultural actualizado exitosamente.');
    },
    onError: (error) => {
      console.error('Error al actualizar contenido cultural:', error.message, error.details);
    },
  });
};

export const useDeleteCulturalContent = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<void>, ApiError, string>({
    mutationFn: culturalContentService.deleteCulturalContent,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['culturalContent', id] });
      queryClient.invalidateQueries({ queryKey: ['culturalContent'] });
      toast.success('Contenido cultural eliminado exitosamente.');
    },
    onError: (error) => {
      console.error('Error al eliminar contenido cultural:', error.message, error.details);
    },
  });
};
