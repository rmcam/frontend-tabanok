import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, CheckCircle2 } from 'lucide-react';
import type { Achievement } from '@/types/api';

interface AchievementCardProps {
  achievement: Achievement;
  isEarned: boolean;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, isEarned }) => {
  const { t } = useTranslation();

  return (
    <Card className={`shadow-lg transition-all duration-300 ${isEarned ? 'border-green-500' : 'border-gray-300 opacity-70'}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">{achievement.name}</CardTitle>
        {isEarned ? (
          <CheckCircle2 className="h-6 w-6 text-green-600" />
        ) : (
          <Award className="h-6 w-6 text-muted-foreground" />
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
        <p className="text-xs text-gray-500">{t("Criterios")}: {achievement.criteria}</p>
        {achievement.imageUrl && (
          <img src={achievement.imageUrl} alt={achievement.name} className="mt-4 h-24 w-auto object-contain mx-auto" />
        )}
      </CardContent>
    </Card>
  );
};

export default AchievementCard;
