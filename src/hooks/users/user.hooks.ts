import { useQuery } from '@tanstack/react-query';
import { usersService } from '@/services/users/users.service';
import type { UserProfile } from '@/types/api';

/**
 * Hook para obtener el perfil de un usuario por su ID.
 * @param userId El ID del usuario.
 */
export const useUserProfile = (userId: string) => {
  return useQuery<UserProfile, Error>({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      const response = await usersService.getUserById(userId);
      // Asumiendo que la respuesta de getUserById es directamente UserProfile
      return response;
    },
    enabled: !!userId, // Solo ejecuta la query si userId está presente
  });
};
