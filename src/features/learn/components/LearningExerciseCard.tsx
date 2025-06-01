import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Lock } from "lucide-react";
import type { LearningExercise } from '@/types/learning'; // Usar la interfaz global

interface LearningExerciseCardProps {
  exercise: LearningExercise;
  unitIndex: number; // Para determinar la alineación
}

const LearningExerciseCard: React.FC<LearningExerciseCardProps> = memo(({ exercise }) => {
  const { t } = useTranslation();

  return (
    <Link 
      to={exercise.isLocked ? '#' : exercise.url} 
      key={exercise.id} 
      className={`relative z-10 flex items-center w-full my-2 group justify-start`}
      onClick={(e) => exercise.isLocked && e.preventDefault()}
    >
      {/* Conector a la línea del tiempo */}
      <div className={`absolute top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full border-2 z-20 
        ${exercise.isCompleted ? 'bg-blue-500 border-blue-700' : exercise.isLocked ? 'bg-gray-300 border-gray-500' : 'bg-muted border-muted-foreground'}
        right-0 -mr-[6px] md:-mr-[6px]
      `}></div>

      <div className={
        `flex-shrink-0 flex items-center justify-center p-1 border rounded-full shadow-sm 
        ${exercise.isCompleted ? 'bg-blue-500 text-white' : exercise.isLocked ? 'bg-gray-300 text-gray-50' : 'bg-muted text-muted-foreground group-hover:bg-muted/80'} 
        transition-colors w-12 h-12 relative`
      }>
        <span className="text-2xl">{exercise.type === 'quiz' ? '📝' : '🎮'}</span>
        {exercise.isCompleted && (
          <CheckCircle className="absolute top-0 right-0 h-3 w-3 text-white bg-blue-600 rounded-full" />
        )}
        {exercise.isLocked && !exercise.isCompleted && (
          <Lock className="absolute top-0 right-0 h-3 w-3 text-white bg-gray-400 rounded-full" />
        )}
      </div>
      <div className={`p-1 text-xs ml-4`}>
        <p className="font-medium">{exercise.type === 'quiz' ? t('Cuestionario') : t('Misión')}</p>
        <p className="text-xs text-muted-foreground">{exercise.description}</p>
        {/* Placeholder para el contenido del ejercicio */}
        <div className="mt-1 text-xs text-gray-500 italic">
          {t("Contenido del ejercicio aquí...")}
        </div>
      </div>
    </Link>
  );
});

export default LearningExerciseCard;
