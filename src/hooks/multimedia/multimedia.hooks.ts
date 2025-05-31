import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { multimediaService } from '../../services/multimedia/multimedia.service';
import { ApiError } from '../../services/_shared';
import type {
  ApiResponse,
  Multimedia,
} from '../../types/api';

/**
 * Hooks para los endpoints de multimedia.
 */
export const useAllMultimedia = () => {
  return useQuery<Multimedia[], ApiError>({
    queryKey: ['multimedia'],
    queryFn: async () => (await multimediaService.getAllMultimedia()).data,
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
    },
  });
};
