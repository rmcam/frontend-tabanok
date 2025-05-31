import { apiRequest } from '../_shared';
import type { NotificationResponseDto } from '../../types/api';

const NotificationsService = {
  getNotificationsByUser: (userId: string) => {
    return apiRequest<NotificationResponseDto[]>('GET', `/notifications/user/${userId}`);
  },
  markNotificationAsRead: (notificationId: string) => {
    return apiRequest<void>('PATCH', `/notifications/${notificationId}/read`);
  },
};

export default NotificationsService;
