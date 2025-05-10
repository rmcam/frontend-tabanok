import React, { useEffect, useState } from 'react';
import * as gamificationService from '@/services/gamificationService'; // Importar el servicio de gamificación
import Loading from '@/components/common/Loading'; // Importar componente de carga

// Asumiendo que Achievement está definido en gamificationService.ts o en types/gamificationTypes.ts
// Si no, necesitaríamos importarlo o definirlo aquí.
// Por ahora, asumiremos que está disponible a través de la importación del servicio.

const AchievementsPage: React.FC = () => {
  const [achievementsData, setAchievementsData] = useState<gamificationService.Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAchievementsData = async () => {
      try {
        const data = await gamificationService.getAchievements();
        setAchievementsData(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Error al cargar los logros.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAchievementsData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-red-500 container mx-auto py-8">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Logros</h1>
      {achievementsData.length === 0 ? (
        <p>No hay logros disponibles en este momento.</p>
      ) : (
        <ul>
          {achievementsData.map(achievement => (
            <li key={achievement.id} className="mb-4 p-4 border rounded shadow">
              <h2 className="text-xl font-semibold">{achievement.name}</h2>
              <p className="text-gray-700">{achievement.description}</p>
              <p className="text-sm text-gray-500">
                Estado: {achievement.unlocked ? 'Desbloqueado' : 'Bloqueado'}
              </p>
              {/* Agrega otros detalles del logro si es necesario */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AchievementsPage;
