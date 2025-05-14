import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Achievement } from '@/types/gamificationTypes';

interface AchievementCardProps {
  achievement: Achievement;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{achievement.name}</CardTitle>
        <CardDescription>{achievement.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">
          Estado: {achievement.unlocked ? 'Desbloqueado' : 'Bloqueado'}
        </p>
        {/* Agrega otros detalles del logro si es necesario */}
      </CardContent>
    </Card>
  );
};

export default AchievementCard;