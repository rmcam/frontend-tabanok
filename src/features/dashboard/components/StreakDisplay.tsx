import React from 'react';
import { useGamificationUserStats } from '@/hooks/gamification/gamification.hooks';
import { useUserStore } from '@/stores/userStore'; // Asumiendo que userStore tiene el userId
import { FlameIcon } from 'lucide-react'; // Icono de llama para la racha

const StreakDisplay: React.FC = () => {
  const { user } = useUserStore();
  const { data: userStats, isLoading, isError } = useGamificationUserStats(user?.id || '');

  if (isLoading) {
    return <div className="text-sm text-gray-500 dark:text-gray-400">Cargando racha...</div>;
  }

  if (isError) {
    return <div className="text-sm text-red-500">Error al cargar racha</div>;
  }

  return (
    <div className="flex items-center space-x-1 text-orange-500 dark:text-orange-400 font-bold">
      <FlameIcon className="w-5 h-5" />
      <span className="text-lg">{userStats?.streak || 0}</span>
    </div>
  );
};

export default StreakDisplay;
