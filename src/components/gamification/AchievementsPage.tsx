import React from 'react';
import Loading from '@/components/common/Loading'; // Importar componente de carga

import { useGamificationData } from '@/hooks/useGamificationData';
import AchievementCard from './components/AchievementCard'; // Importar el nuevo componente

const AchievementsPage: React.FC = () => {
  const { achievements, loading, error } = useGamificationData();

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-red-500 container mx-auto py-8">Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Logros</h1>
      {achievements.length === 0 ? (
        <p>No hay logros disponibles en este momento.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> {/* Usar grid para las tarjetas */}
          {achievements.map(achievement => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AchievementsPage;
