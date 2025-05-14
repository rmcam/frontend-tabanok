import React from 'react';
import Loading from '@/components/common/Loading'; // Importar componente de carga

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow, // Re-incluir TableRow para el encabezado
} from "@/components/ui/table"; // Importar componentes Table
import { useGamificationData } from '@/hooks/useGamificationData';
import LeaderboardRow from './components/LeaderboardRow'; // Importar el nuevo componente

const LeaderboardPage: React.FC = () => {
  const { leaderboard, loading, error } = useGamificationData();

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-red-500 container mx-auto py-8">Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Leaderboard</h1>
      {leaderboard.length === 0 ? (
        <p>No hay datos disponibles para el leaderboard en este momento.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Posición</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Puntos Totales</TableHead>
              <TableHead>Nivel</TableHead>
              {/* Agrega otras columnas si es necesario */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboard.map((entry, index) => (
              <LeaderboardRow key={entry.userId} entry={entry} index={index} />
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default LeaderboardPage;
