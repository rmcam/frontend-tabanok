import React from 'react';
import Loading from '@/components/common/Loading'; // Importar componente de carga

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Importar componentes Table
import { useGamificationData } from '@/hooks/useGamificationData';

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
              <TableRow key={entry.userId}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{entry.username}</TableCell>
                <TableCell>{entry.totalPoints}</TableCell>
                <TableCell>{entry.level}</TableCell>
                {/* Agrega otras celdas si es necesario */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default LeaderboardPage;
