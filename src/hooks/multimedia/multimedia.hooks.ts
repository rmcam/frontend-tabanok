import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { multimediaService } from '@/services/multimedia/multimedia.service';
import { ApiError } from '@/services/_shared';
import type { Multimedia, MultimediaQueryParams } from '@/types/multimedia/multimedia.d';
import type { ApiResponse } from '@/types/common/common.d';

/**
 * Hooks para los endpoints de multimedia.
 */
export const useAllMultimedia = (params?: MultimediaQueryParams) => {
  return useQuery<Multimedia[], ApiError>({
    queryKey: ['multimedia', params],
    queryFn: async () => (await multimediaService.getAllMultimedia(params)).data,
  });
};

export const useMultimediaById = (id: string) => {
  return useQuery<Multimedia, ApiError>({
    queryKey: ['multimedia', id],
    queryFn: async () => (await multimediaService.getMultimediaById(id)).data,
    enabled: !!id,
  });
};

export const useUploadFile = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Multimedia>, ApiError, FormData>({
    mutationFn: multimediaService.uploadFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['multimedia'] });
      toast.success('Archivo multimedia subido exitosamente.');
    },
    onError: (error) => {
      console.error('Error al subir archivo multimedia:', error.message, error.details);
      toast.error('Error al subir archivo multimedia.');
    },
  });
};

export const useDeleteMultimedia = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<void>, ApiError, string>({
    mutationFn: multimediaService.deleteMultimedia,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['multimedia', id] });
      queryClient.invalidateQueries({ queryKey: ['multimedia'] });
      toast.success('Archivo multimedia eliminado exitosamente.');
    },
    onError: (error) => {
      console.error('Error al eliminar archivo multimedia:', error.message, error.details);
      toast.error('Error al eliminar archivo multimedia.');
    },
  });
};

/**
 * Hook para descargar un archivo multimedia por ID.
 */
export function useDownloadMultimedia(id: string) {
  return useQuery<Blob, ApiError>({
    queryKey: ['multimediaFile', id],
    queryFn: async () => (await multimediaService.getMultimediaFile(id)).data,
    enabled: !!id,
    staleTime: Infinity, // Los archivos no cambian, así que se pueden cachear indefinidamente
    gcTime: Infinity, // Usar gcTime en lugar de cacheTime
  });
}
