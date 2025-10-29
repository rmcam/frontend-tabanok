import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookOpen } from 'lucide-react';
import { useUnitProgress } from '@/hooks/learn/useUnitProgress';
import type { LearningUnitCardProps, LearningUnit } from '@/types/learning';

const LearningUnitCard: React.FC<LearningUnitCardProps> = ({ unit, userProgress, isPreviousUnitCompleted }) => {
  const { t } = useTranslation();
  const { unitProgress } = useUnitProgress(unit, userProgress);

  const isLocked = unit.isLocked || !isPreviousUnitCompleted;

  return (
    <Link to={isLocked ? "#" : `/learn/unit/${unit.id}`} className={isLocked ? 'cursor-not-allowed' : ''}>
      <Card className={`shadow-lg border-primary/20 h-full flex flex-col ${isLocked ? 'opacity-50' : 'hover:border-primary transition-colors'}`}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">{unit.title}</CardTitle>
          <CardDescription>{unit.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-end space-y-4">
          <div className="flex items-center justify-between text-lg text-muted-foreground">
            <span>{t("Puntos Requeridos")}: <span className="font-semibold text-primary">{unit.requiredPoints}</span></span>
            <span>{t("Progreso de la Unidad")}: <span className="font-semibold text-primary">{unitProgress}%</span></span>
          </div>
          <Progress value={unitProgress} className="w-full h-3" />
          {isLocked && (
            <p className="text-sm text-red-500 mt-2">{t("Esta unidad está bloqueada hasta que completes la anterior.")}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default LearningUnitCard;
