import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target, CheckCircle2 } from 'lucide-react';
import type { MissionTemplate, UserMissionDto } from '@/types/api';

interface MissionCardProps {
  mission: MissionTemplate;
  userMission?: UserMissionDto; // La misión específica del usuario, si existe
}

const MissionCard: React.FC<MissionCardProps> = ({ mission, userMission }) => {
  const { t } = useTranslation();

  const isCompleted = userMission?.status === 'completed';
  const progress = userMission?.progress ?? 0;

  return (
    <Card className={`shadow-lg transition-all duration-300 ${isCompleted ? 'border-green-500' : 'border-primary/20'}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">{mission.name}</CardTitle>
        {isCompleted ? (
          <CheckCircle2 className="h-6 w-6 text-green-600" />
        ) : (
          <Target className="h-6 w-6 text-muted-foreground" />
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">{mission.description}</p>
        <p className="text-xs text-gray-500 mb-2">{t("Recompensa")}: {mission.rewardPoints} XP</p>
        
        <div className="mt-4">
          <h4 className="text-sm font-semibold mb-2">{t("Objetivos")}:</h4>
          <ul className="list-disc list-inside text-sm text-muted-foreground">
            {mission.objectives.map((objective, index) => (
              <li key={index}>{objective}</li>
            ))}
          </ul>
        </div>

        {userMission && (
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <span className="text-xs text-muted-foreground mt-1 block">
              {progress}% {t("completado")}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MissionCard;
