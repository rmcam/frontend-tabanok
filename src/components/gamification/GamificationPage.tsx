import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Importar Link para navegación
import * as gamificationService from '@/services/gamificationService'; // Importar el servicio de gamificación
import { GamificationSummary } from '@/types/gamificationTypes'; // Importar el tipo GamificationSummary
import Loading from '@/components/common/Loading'; // Importar componente de carga

const GamificationPage: React.FC = () => {
  const [gamificationSummary, setGamificationSummary] = useState<GamificationSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGamificationSummary = async () => {
      try {
        const data = await gamificationService.getGamificationSummary();
        setGamificationSummary(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Error al cargar el resumen de gamificación.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGamificationSummary();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-red-500 container mx-auto py-8">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Gamificación</h1>
      {/* Contenido de la página principal de Gamificación */}
      {gamificationSummary ? (
        <div>
          <p>Total de Puntos: {gamificationSummary.totalPoints}</p>
          <p>Nivel: {gamificationSummary.level}</p>
          <p>Racha: {gamificationSummary.streak}</p>
          <p>Logros Desbloqueados: {gamificationSummary.achievementsUnlocked}</p>
          <p>Misiones Completadas: {gamificationSummary.missionsCompleted}</p>
          {/* Mostrar otros datos del resumen si están disponibles */}
        </div>
      ) : (
        <p>No se pudo cargar el resumen de gamificación.</p>
      )}

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Explorar:</h2>
        <ul>
          <li>
            <Link to="/gamification/leaderboard" className="text-blue-600 hover:underline">Leaderboard</Link>
          </li>
          <li>
            <Link to="/gamification/achievements" className="text-blue-600 hover:underline">Logros</Link>
          </li>
          {/* Otros enlaces relacionados con gamificación */}
        </ul>
      </div>
    </div>
  );
};

export default GamificationPage;
