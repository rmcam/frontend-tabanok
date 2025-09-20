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


const LearningUnitCard: React.FC<LearningUnitCardProps> = memo(({ unit, index }) => {
  const { t } = useTranslation();
  const isEven = index % 2 === 0;

  return (
    <div className={`relative flex items-center ${isEven ? 'justify-start' : 'justify-end'}`}>
      <div className={`w-5/12 ${isEven ? 'order-1' : 'order-3'}`}>
        <Link 
          to={unit.isLocked ? '#' : unit.url} 
          className="block p-4 border rounded-lg shadow-lg bg-card hover:bg-accent transition-colors"
          onClick={(e) => unit.isLocked && e.preventDefault()}
        >
          <div className="flex items-center">
            <div className={
              `flex-shrink-0 flex items-center justify-center p-3 border rounded-full shadow-md 
              ${unit.isCompleted ? 'bg-green-500 text-white' : unit.isLocked ? 'bg-gray-500 text-gray-200' : 'bg-primary text-primary-foreground'} 
              transition-colors w-16 h-16 relative`
            }>
              <span className="text-3xl">{unit.icon || '📖'}</span>
              {unit.isCompleted && (
                <CheckCircle className="absolute -top-1 -right-1 h-5 w-5 text-white bg-green-600 rounded-full" />
              )}
              {unit.isLocked && !unit.isCompleted && (
                <Lock className="absolute -top-1 -right-1 h-5 w-5 text-white bg-gray-700 rounded-full" />
              )}
            </div>
            <div className="ml-4">
              <p className="font-bold text-lg">{unit.title}</p>
              <p className="text-sm text-muted-foreground">{unit.description}</p>
            </div>
          </div>
          {unit.progress !== undefined && (
            <div className="mt-3">
              <Progress value={unit.progress} className="h-2" />
              <span className="text-xs text-muted-foreground mt-1 block">
                {unit.progress}% {t("completado")}
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Conector a la línea del tiempo */}
      <div className={`order-2 w-1/12 flex justify-center`}>
        <div className={`w-4 h-4 rounded-full border-2 z-10 
          ${unit.isCompleted ? 'bg-green-500 border-green-700' : unit.isLocked ? 'bg-gray-500 border-gray-700' : 'bg-primary border-primary-foreground'}
        `}></div>
      </div>
    </div>
  );
});

export default LearningUnitCard;
