import { useQuery } from '@tanstack/react-query';
import { rootService } from '../../services/root/root.service';
import { ApiError } from '../../services/_shared';
import type {
  ApiResponse,
  HealthResponse,
  WelcomeResponse,
} from '../../types/api';

// Hook para obtener el estado de salud de la API
export const useHealthCheck = () => {
  return useQuery<ApiResponse<HealthResponse>, ApiError>({
    queryKey: ['healthCheck'],
    queryFn: rootService.getHealth,
    staleTime: 10 * 1000, // Considerar fresco por 10 segundos
    gcTime: 60 * 1000, // Mantener en caché por 1 minuto
    retry: 1, // Reintentar una vez en caso de fallo
  });
};

// Hook para obtener el mensaje de bienvenida de la API
export const useWelcomeMessage = () => {
  return useQuery<WelcomeResponse, ApiError>({
    queryKey: ['welcomeMessage'],
    queryFn: rootService.getWelcomeMessage,
    staleTime: Infinity, // No se espera que cambie, por lo que es infinito
    gcTime: Infinity, // Mantener en caché indefinidamente
    retry: 1,
  });
};
