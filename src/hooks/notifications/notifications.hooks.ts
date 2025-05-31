import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import NotificationsService from '../../services/notifications/notifications.service';
import type { NotificationResponseDto } from '../../types/api'; // Asegúrate de que este tipo exista

const NOTIFICATIONS_QUERY_KEY = 'notifications';

export const useGetNotificationsByUser = (userId: string) => {
  return useQuery<NotificationResponseDto[], Error>({
    queryKey: [NOTIFICATIONS_QUERY_KEY, userId],
    queryFn: () => NotificationsService.getNotificationsByUser(userId),
    enabled: !!userId, // Solo ejecutar si userId existe
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (notificationId: string) => NotificationsService.markNotificationAsRead(notificationId),
    onSuccess: () => {
      // Invalidar la caché de notificaciones para que se refetch
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
    },
  });
};
