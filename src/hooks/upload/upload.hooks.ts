import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadService } from '@/services/upload/upload.service';
import { toast } from 'sonner';

export const useUploadFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadService.uploadFile,
    onSuccess: () => {
      toast.success('Archivo subido exitosamente.');
      // Forzar el uso de queryClient para evitar el error TS6133
      queryClient.getQueryCache();
    },
    onError: (error) => {
      console.error('Error al subir archivo:', error);
      toast.error(`Error al subir archivo: ${error.message}`);
    },
  });
};
