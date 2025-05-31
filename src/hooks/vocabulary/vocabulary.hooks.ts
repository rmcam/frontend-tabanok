import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { vocabularyService } from '../../services/vocabulary/vocabulary.service';
import { ApiError } from '../../services/_shared';
import type {
  ApiResponse,
  Vocabulary,
  CreateVocabularyDto,
  UpdateVocabularyDto,
} from '../../types/api';

/**
 * Hooks para los endpoints de vocabulario.
 */
export const useAllVocabulary = () => {
  return useQuery<Vocabulary[], ApiError>({
    queryKey: ['vocabulary'],
    queryFn: async () => (await vocabularyService.getAllVocabulary()).data,
  });
};

export const useVocabularyById = (id: string) => {
  return useQuery<Vocabulary, ApiError>({
    queryKey: ['vocabulary', id],
    queryFn: async () => (await vocabularyService.getVocabularyById(id)).data,
    enabled: !!id,
  });
};

export const useSearchVocabulary = (query: string) => {
  return useQuery<Vocabulary[], ApiError>({
    queryKey: ['vocabulary', 'search', query],
    queryFn: async () => (await vocabularyService.searchVocabulary(query)).data,
    enabled: !!query,
  });
};

export const useCreateVocabulary = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Vocabulary>, ApiError, CreateVocabularyDto>({
    mutationFn: vocabularyService.createVocabulary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vocabulary'] });
      toast.success('Vocabulario creado exitosamente.');
    },
    onError: (error) => {
      console.error('Error al crear vocabulario:', error.message, error.details);
    },
  });
};

export const useUpdateVocabulary = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Vocabulary>, ApiError, { id: string, vocabularyData: UpdateVocabularyDto }>({
    mutationFn: ({ id, vocabularyData }) => vocabularyService.updateVocabulary(id, vocabularyData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vocabulary', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['vocabulary'] });
      toast.success(data.message || 'Vocabulario actualizado exitosamente.');
    },
    onError: (error) => {
      console.error('Error al actualizar vocabulario:', error.message, error.details);
    },
  });
};

export const useDeleteVocabulary = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<void>, ApiError, string>({
    mutationFn: vocabularyService.deleteVocabulary,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['vocabulary', id] });
      queryClient.invalidateQueries({ queryKey: ['vocabulary'] });
      toast.success('Vocabulario eliminado exitosamente.');
    },
    onError: (error) => {
      console.error('Error al eliminar vocabulario:', error.message, error.details);
    },
  });
};
