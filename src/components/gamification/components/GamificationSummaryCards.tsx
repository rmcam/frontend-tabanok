import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { GamificationSummary } from '@/types/gamificationTypes';

interface GamificationSummaryCardsProps {
  summary: GamificationSummary;
}

const GamificationSummaryCards: React.FC<GamificationSummaryCardsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
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
  );
};

export default GamificationSummaryCards;