import { useQuery } from '@tanstack/react-query';
import { multimediaService } from '../../services/multimedia';
import type { Multimedia } from '../../types/api';

/**
 * Claves de consulta para TanStack Query.
 */
export const multimediaQueryKeys = {
  all: ['multimedia'] as const,
  details: () => [...multimediaQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...multimediaQueryKeys.details(), id] as const,
};

/**
 * Hook para obtener los metadatos de un archivo multimedia específico por su ID.
 * @param multimediaId El ID del archivo multimedia.
 * @returns Un objeto con los datos de los metadatos, estado de carga y error.
 */
export const useMultimediaMetadata = (multimediaId: string) => {
  return useQuery<Multimedia, Error>({
    queryKey: multimediaQueryKeys.detail(multimediaId),
    queryFn: () => multimediaService.getMultimediaMetadata(multimediaId),
    enabled: !!multimediaId,
  });
};

/**
 * Función auxiliar para obtener la URL de un archivo multimedia.
 * No es un hook de TanStack Query ya que no realiza una petición asíncrona.
 * @param multimediaId El ID del archivo multimedia.
 * @returns La URL completa del archivo multimedia.
 */
export const getMultimediaUrl = (multimediaId: string): string => {
  return multimediaService.getMultimediaFileUrl(multimediaId);
};
