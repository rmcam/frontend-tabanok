import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Lock, Circle } from "lucide-react";
import type { LearningExerciseItemProps } from '@/types/learning'; // Eliminar LearningExercise
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const LearningExerciseItem: React.FC<LearningExerciseItemProps> = memo(({ exercise, isCompleted, isLocked }) => {
  const { t } = useTranslation();

  // Usar la prop isLocked si se pasa, de lo contrario usar exercise.isLocked
  const effectiveIsLocked = isLocked ?? exercise.isLocked;

  // Determinar el icono y el color basado en el estado del ejercicio y la prop isCompleted
  const statusIcon = isCompleted ? (
    <CheckCircle2 className="h-5 w-5 text-green-500" />
  ) : effectiveIsLocked ? (
    <Lock className="h-5 w-5 text-gray-500" />
  ) : (
    <Circle className="h-5 w-5 text-blue-500" />
  );

  const linkClass = effectiveIsLocked ? 'pointer-events-none opacity-50' : '';

  return (
    <Link to={effectiveIsLocked ? '#' : exercise.url} className={`block ${linkClass}`}>
      <Card className={cn("hover:bg-muted transition-colors", {
        "border-l-4 border-green-500": isCompleted, // Borde verde si está completado
        "opacity-70": effectiveIsLocked, // Ligeramente opaco si está bloqueado
      })}>
        <CardContent className="flex items-center p-4">
          <div className="flex-shrink-0 mr-4">
            {statusIcon}
          </div>
          <div className="flex-grow">
            <p className="font-medium text-foreground">{exercise.title}</p>
            {exercise.description && <p className="text-sm text-muted-foreground">{exercise.description}</p>}
          </div>
          {exercise.points > 0 && (
            <div className="flex-shrink-0 text-sm text-primary font-semibold">
              {exercise.points} {t("pts")}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
});

export default LearningExerciseItem;
