import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadService } from '@/services/upload/upload.service';
import { toast } from 'sonner';

export const useUploadFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadService.uploadFile,
    onSuccess: (data) => {
      toast.success('Archivo subido exitosamente.');
      // Opcional: invalidar queries relacionadas si la subida afecta datos existentes
      // queryClient.invalidateQueries(['someQueryKey']);
    },
    onError: (error) => {
      console.error('Error al subir archivo:', error);
      toast.error(`Error al subir archivo: ${error.message}`);
    },
  });
};
