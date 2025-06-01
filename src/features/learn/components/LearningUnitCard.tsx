import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Lock } from "lucide-react";
import { Progress } from '@/components/ui/progress';
import type { LearningUnit } from '@/types/learning'; // Usar la interfaz global

interface LearningUnitCardProps {
  unit: LearningUnit;
  index: number;
}


const LearningUnitCard: React.FC<LearningUnitCardProps> = memo(({ unit }) => {
  const { t } = useTranslation();

  return (
    <Link 
      to={unit.isLocked ? '#' : unit.url} 
      className={`relative z-10 flex items-center w-full my-8 group justify-start`}
      onClick={(e) => unit.isLocked && e.preventDefault()}
    >
      {/* Conector a la línea del tiempo */}
      <div className={`absolute top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full border-2 z-20 
        ${unit.isCompleted ? 'bg-green-500 border-green-700' : unit.isLocked ? 'bg-gray-500 border-gray-700' : 'bg-primary border-primary-foreground'}
        right-0 -mr-3 md:-mr-3
      `}></div>

      <div className={
        `flex-shrink-0 flex items-center justify-center p-4 border rounded-full shadow-lg 
        ${unit.isCompleted ? 'bg-green-500 text-white' : unit.isLocked ? 'bg-gray-500 text-gray-200' : 'bg-card text-card-foreground group-hover:bg-accent group-hover:text-accent-foreground'} 
        transition-colors w-24 h-24 relative`
      }>
        <span className="text-5xl">{unit.icon || '📖'}</span>
        {unit.isCompleted && (
          <CheckCircle className="absolute top-0 right-0 h-6 w-6 text-white bg-green-600 rounded-full" />
        )}
        {unit.isLocked && !unit.isCompleted && (
          <Lock className="absolute top-0 right-0 h-6 w-6 text-white bg-gray-700 rounded-full" />
        )}
      </div>
      <div className={`p-2 text-left ml-4`}>
        <p className="font-medium text-lg">{unit.title}</p>
        <p className="text-sm text-muted-foreground">{unit.description}</p>
        {unit.progress !== undefined && (
          <div className="mt-2">
            <Progress value={unit.progress} className="h-2" />
            <span className="text-xs text-muted-foreground mt-1 block">
              {unit.progress}% {t("completado")}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
});

export default LearningUnitCard;
