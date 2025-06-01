import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Lock } from "lucide-react";
import { Progress } from '@/components/ui/progress'; // Importar Progress
import type { LearningLessonCardProps } from '@/types/learning'; // Usar la interfaz global y UserProgress

const LearningLessonCard: React.FC<LearningLessonCardProps> = memo(({ lesson, userProgress, isPreviousLessonCompleted }) => {
  const { t } = useTranslation();

  // Determinar si la lección está bloqueada
  const isLocked = lesson.isLocked || !isPreviousLessonCompleted;

  // Calcular el progreso de la lección
  const lessonProgress = React.useMemo(() => {
    if (!lesson.exercises || lesson.exercises.length === 0 || !userProgress) {
      return 0;
    }
    const totalExercises = lesson.exercises.length;
    const completedExercises = lesson.exercises.filter(exercise =>
      userProgress.completedExerciseIds?.includes(exercise.id)
    ).length;

    return totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;
  }, [lesson.exercises, userProgress]);

  // Determinar si la lección está completada
  const isLessonCompleted = lessonProgress === 100;

  return (
    <Link 
      to={isLocked ? '#' : lesson.url} 
      className={`relative z-10 flex items-center w-full my-4 group justify-start ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={(e) => isLocked && e.preventDefault()}
    >
      {/* Conector a la línea del tiempo */}
      <div className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full border-2 z-20 
        ${isLessonCompleted ? 'bg-green-500 border-green-700' : isLocked ? 'bg-gray-400 border-gray-600' : 'bg-secondary border-secondary-foreground'}
        right-0 -mr-2 md:-mr-2
      `}></div>

      <div className={
        `flex-shrink-0 flex items-center justify-center p-2 border rounded-full shadow-md 
        ${isLessonCompleted ? 'bg-green-500 text-white' : isLocked ? 'bg-gray-400 text-gray-100' : 'bg-secondary text-secondary-foreground group-hover:bg-secondary/80'} 
        transition-colors w-16 h-16 relative`
      }>
        <span className="text-3xl">📚</span>
        {isLessonCompleted && (
          <CheckCircle className="absolute top-0 right-0 h-4 w-4 text-white bg-green-600 rounded-full" />
        )}
        {isLocked && !isLessonCompleted && (
          <Lock className="absolute top-0 right-0 h-4 w-4 text-white bg-gray-500 rounded-full" />
        )}
      </div>
      <div className={`p-1 text-sm ml-4 flex-grow`}>
        <p className="font-medium">{lesson.title}</p>
        <p className="text-xs text-muted-foreground">{lesson.description}</p>
        {/* Mostrar el progreso de la lección con barra de progreso */}
        <div className="mt-2">
          <Progress value={lessonProgress} className="h-2 w-full" />
          <div className="text-xs text-primary font-semibold mt-1">
            {t("Progreso")}: {lessonProgress}%
          </div>
        </div>
      </div>
    </Link>
  );
});

export default LearningLessonCard;
