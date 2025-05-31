import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { unitiesService } from '../../services/unities/unities.service';
import { ApiError } from '../../services/_shared';
import type {
  ApiResponse,
  Unity,
  CreateUnityDto,
  UpdateUnityDto,
  DetailedUnity, // Importar DetailedUnity
} from '../../types/api';

/**
 * Hooks para los endpoints de unidades de aprendizaje.
 */
export const useAllUnities = () => {
  return useQuery<Unity[], ApiError>({
    queryKey: ['unities'],
    queryFn: async () => {
      const response = await unitiesService.getAllUnities();
      return response;
    },
  });
};

export const useUnityById = (id: string) => {
  return useQuery<Unity | null, ApiError>({ // Cambiar el tipo de retorno a Unity | null
    queryKey: ['unities', id],
    queryFn: async () => {
      const response = await unitiesService.getUnityById(id);
      return response || null;
    },
    enabled: !!id,
    // Eliminar la función select para devolver el objeto Unity completo
  });
};

/**
 * Hook para obtener una unidad específica con sus tópicos y contenido anidado.
 * @param id El ID de la unidad.
 * @returns Un objeto de TanStack Query con la unidad y su contenido anidado.
 */
export const useUnityWithTopicsAndContent = (id: string) => {
  return useQuery<DetailedUnity | null, ApiError>({
    queryKey: ['unities', id, 'with-topics-and-content'],
    queryFn: async () => {
      const response = await unitiesService.getUnityWithTopicsAndContent(id);
      return response || null;
    },
    enabled: !!id, // Solo ejecutar la query si el ID existe
  });
};

export const useCreateUnity = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Unity>, ApiError, CreateUnityDto>({
    mutationFn: unitiesService.createUnity,
    onSuccess: (data) => { // Acceder a data.data si la API devuelve ApiResponse
      queryClient.invalidateQueries({ queryKey: ['unities'] });
      // Si la API devuelve ApiResponse<Unity>, data.data contendrá la unidad creada
      // Si solo devuelve Unity, data será la unidad. Ajustar según la implementación real del servicio.
      // Por ahora, asumimos que el servicio devuelve ApiResponse<Unity> como se tipó en apiRequest.
      toast.success('Unidad creada exitosamente.');
    },
    onError: (error: ApiError) => {
      console.error('Error al crear unidad:', error.message, error.details);
    },
  });
};

export const useUpdateUnity = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Unity>, ApiError, { id: string, unityData: UpdateUnityDto }>({
    mutationFn: ({ id, unityData }) => unitiesService.updateUnity(id, unityData),
    onSuccess: (data) => { // Acceder a data.data si la API devuelve ApiResponse
      queryClient.invalidateQueries({ queryKey: ['unities', data.data.id] }); // Invalidate by updated unity ID
      queryClient.invalidateQueries({ queryKey: ['unities'] });
      toast.success('Unidad actualizada exitosamente.');
    },
    onError: (error: ApiError) => {
      console.error('Error al actualizar unidad:', error.message, error.details);
    },
  });
};

export const useDeleteUnity = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<void>, ApiError, string>({
    mutationFn: unitiesService.deleteUnity,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['unities', id] });
      queryClient.invalidateQueries({ queryKey: ['unities'] });
      toast.success('Unidad eliminada exitosamente.');
    },
    onError: (error: ApiError) => {
      console.error('Error al eliminar unidad:', error.message, error.details);
    },
  });
};
