import { useQuery } from '@tanstack/react-query';
import { badgesService } from '@/services/badges/badges.service';
import type { UserBadge } from '@/types/api';

/**
 * Hook para obtener las insignias de un usuario por su ID.
 * @param userId El ID del usuario.
 */
export const useUserBadges = (userId: string) => {
  return useQuery<UserBadge[], Error>({
    queryKey: ['userBadges', userId],
    queryFn: async () => {
      const response = await badgesService.getBadgesByUserId(userId);
      // Asegurarse de que response.data no sea undefined
      return response.data || [];
    },
    enabled: !!userId, // Solo ejecuta la query si userId está presente
  });
};
