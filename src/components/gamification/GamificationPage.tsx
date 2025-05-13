import React from 'react';
import { Link } from 'react-router-dom'; // Importar Link para navegación
import Loading from '@/components/common/Loading'; // Importar componente de carga
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // Importar componentes Card
import { Button } from "@/components/ui/button"; // Importar componente Button
import { useGamificationData } from '@/hooks/useGamificationData';


const GamificationPage: React.FC = () => {
  const { summary, loading, error } = useGamificationData();

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-red-500 container mx-auto py-8">Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Gamificación</h1>
      {/* Contenido de la página principal de Gamificación */}
      {summary ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> {/* Usar grid para las tarjetas */}
          <Card>
            <CardHeader>
              <CardTitle>Total de Puntos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold">{summary.totalPoints}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Nivel</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold">{summary.level}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Racha</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold">{summary.streak}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Logros Desbloqueados</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold">{summary.achievementsUnlocked}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Misiones Completadas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold">{summary.missionsCompleted}</p>
            </CardContent>
          </Card>
          {/* Mostrar otros datos del resumen si están disponibles */}
        </div>
      ) : (
        <p>No se pudo cargar el resumen de gamificación.</p>
      )}

      <div className="mt-8"> {/* Aumentar margen superior */}
        <h2 className="text-xl font-semibold mb-4">Explorar:</h2> {/* Aumentar margen inferior */}
        <div className="flex gap-4"> {/* Usar flexbox para los enlaces */}
          <Link to="/gamification/leaderboard">
            <Button variant="default">Leaderboard</Button> {/* Usar componente Button */}
          </Link>
          <Link to="/gamification/achievements">
            <Button variant="default">Logros</Button> {/* Usar componente Button */}
          </Link>
          {/* Otros enlaces relacionados con gamificación */}
        </div>
      </div>
    </div>
  );
};

export default GamificationPage;
