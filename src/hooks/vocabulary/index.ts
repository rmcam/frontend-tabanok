import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vocabularyService } from '../../services/vocabulary';
import type { Vocabulary, CreateVocabularyDto, UpdateVocabularyDto } from '../../types/api';

/**
 * Claves de consulta para TanStack Query.
 */
export const vocabularyQueryKeys = {
  all: ['vocabulary'] as const,
  lists: () => [...vocabularyQueryKeys.all, 'list'] as const,
  search: (query: string, page?: number, limit?: number) => [...vocabularyQueryKeys.all, 'search', query, page, limit] as const,
  byTopic: (topicId: string) => [...vocabularyQueryKeys.all, 'byTopic', topicId] as const,
  details: () => [...vocabularyQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...vocabularyQueryKeys.details(), id] as const,
};

/**
 * Hook para obtener la lista completa del vocabulario.
 * @returns Un objeto con los datos del vocabulario, estado de carga y error.
 */
export const useAllVocabulary = () => {
  return useQuery<Vocabulary[], Error>({
    queryKey: vocabularyQueryKeys.lists(),
    queryFn: vocabularyService.getAllVocabulary,
  });
};

/**
 * Hook para buscar palabras en el vocabulario Kamëntsá.
 * @param query El término de búsqueda.
 * @param page El número de página (opcional).
 * @param limit El límite de elementos por página (opcional).
 * @returns Un objeto con los datos del vocabulario, estado de carga y error.
 */
export const useSearchVocabulary = (query: string, page?: number, limit?: number) => {
  return useQuery<Vocabulary[], Error>({
    queryKey: vocabularyQueryKeys.search(query, page, limit),
    queryFn: () => vocabularyService.searchVocabulary(query, page, limit),
    enabled: !!query, // Solo ejecuta la consulta si hay un término de búsqueda
  });
};

/**
 * Hook para obtener entradas de vocabulario relacionadas con un tema específico.
 * @param topicId El ID del tema.
 * @returns Un objeto con los datos del vocabulario, estado de carga y error.
 */
export const useVocabularyByTopicId = (topicId: string) => {
  return useQuery<Vocabulary[], Error>({
    queryKey: vocabularyQueryKeys.byTopic(topicId),
    queryFn: () => vocabularyService.getVocabularyByTopicId(topicId),
    enabled: !!topicId,
  });
};

/**
 * Hook para crear una nueva entrada de vocabulario.
 * Invalida las consultas de vocabulario después de una creación exitosa.
 * @returns Un objeto con la función de mutación, estado de carga y error.
 */
export const useCreateVocabulary = () => {
  const queryClient = useQueryClient();
  return useMutation<Vocabulary, Error, CreateVocabularyDto>({
    mutationFn: vocabularyService.createVocabulary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vocabularyQueryKeys.all });
    },
  });
};

/**
 * Hook para actualizar una entrada de vocabulario existente.
 * Invalida las consultas de vocabulario y el detalle de la entrada después de una actualización exitosa.
 * @returns Un objeto con la función de mutación, estado de carga y error.
 */
export const useUpdateVocabulary = () => {
  const queryClient = useQueryClient();
  return useMutation<Vocabulary, Error, { id: string; data: UpdateVocabularyDto }>({
    mutationFn: ({ id, data }) => vocabularyService.updateVocabulary(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: vocabularyQueryKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: vocabularyQueryKeys.all });
    },
  });
};

/**
 * Hook para eliminar una entrada de vocabulario.
 * Invalida las consultas de vocabulario después de una eliminación exitosa.
 * @returns Un objeto con la función de mutación, estado de carga y error.
 */
export const useDeleteVocabulary = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: vocabularyService.deleteVocabulary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vocabularyQueryKeys.all });
    },
  });
};
