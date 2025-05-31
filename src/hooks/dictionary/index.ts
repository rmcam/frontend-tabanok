import { useQuery } from '@tanstack/react-query';
import { dictionaryService } from '../../services/dictionary';
import type { DictionaryEntryDto } from '../../types/api';

/**
 * Claves de consulta para TanStack Query.
 */
export const dictionaryQueryKeys = {
  all: ['dictionary'] as const,
  search: (query: string) => [...dictionaryQueryKeys.all, 'search', query] as const,
};

/**
 * Hook para buscar palabras en el diccionario Kamëntsá.
 * @param query El término de búsqueda.
 * @returns Un objeto con los datos de las entradas del diccionario, estado de carga y error.
 */
export const useSearchDictionary = (query: string) => {
  return useQuery<DictionaryEntryDto[], Error>({
    queryKey: dictionaryQueryKeys.search(query),
    queryFn: () => dictionaryService.searchDictionary(query),
    enabled: !!query, // Solo ejecuta la consulta si hay un término de búsqueda
  });
};
