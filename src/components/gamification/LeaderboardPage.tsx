import React, { useEffect, useState } from 'react';
import * as gamificationService from '@/services/gamificationService'; // Importar el servicio de gamificación
import Loading from '@/components/common/Loading'; // Importar componente de carga

// Asumiendo que LeaderboardEntry está definido en gamificationService.ts o en types/gamificationTypes.ts
// Si no, necesitaríamos importarlo o definirlo aquí.
// Por ahora, asumiremos que está disponible a través de la importación del servicio.

const LeaderboardPage: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<gamificationService.LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const data = await gamificationService.getLeaderboard();
        setLeaderboardData(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Error al cargar el leaderboard.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-red-500 container mx-auto py-8">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Leaderboard</h1>
      {leaderboardData.length === 0 ? (
        <p>No hay datos disponibles para el leaderboard en este momento.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Posición</th>
              <th className="py-2 px-4 border-b">Usuario</th>
              <th className="py-2 px-4 border-b">Puntos Totales</th>
              <th className="py-2 px-4 border-b">Nivel</th>
              {/* Agrega otras columnas si es necesario */}
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((entry, index) => (
              <tr key={entry.userId} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                <td className="py-2 px-4 border-b">{index + 1}</td>
                <td className="py-2 px-4 border-b">{entry.username}</td>
                <td className="py-2 px-4 border-b">{entry.totalPoints}</td>
                <td className="py-2 px-4 border-b">{entry.level}</td>
                {/* Agrega otras celdas si es necesario */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LeaderboardPage;
