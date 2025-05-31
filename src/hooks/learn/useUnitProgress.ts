import React from 'react';
import type { LearningUnit, UserProgress } from '@/types/learning';

interface UnitProgressResult {
  totalExercises: number;
  completedExercises: number;
  unitProgress: number;
}

export const useUnitProgress = (unit: LearningUnit | undefined, userProgress: UserProgress | undefined): UnitProgressResult => {
  const { totalExercises, completedExercises, unitProgress } = React.useMemo(() => {
    if (!unit || !userProgress) {
      return { totalExercises: 0, completedExercises: 0, unitProgress: 0 };
    }

    const allExercises = new Set<string>();
    const completedExercisesSet = new Set<string>(userProgress.completedExerciseIds);

    // Recorrer lecciones y sus ejercicios
    unit.lessons?.forEach(lesson => {
      lesson.exercises?.forEach(exercise => {
        allExercises.add(exercise.id);
      });
    });

    // Recorrer tópicos y su contenido para encontrar ejercicios
    unit.topics?.forEach(topic => {
      topic.contents?.forEach(contentItem => {
        if (contentItem.type === 'exercise') {
          allExercises.add(String(contentItem.id)); // Asegurar que el ID sea string
        }
      });
    });

    const total = allExercises.size;
    let completed = 0; // 'completed' sí se reasigna en el bucle forEach

    allExercises.forEach(exerciseId => {
      if (completedExercisesSet.has(exerciseId)) {
        completed++;
      }
    });

    const progress = total > 0
      ? Math.round((completed / total) * 100)
      : 0;

    return { totalExercises: total, completedExercises: completed, unitProgress: progress };
  }, [unit, userProgress]);

  return { totalExercises, completedExercises, unitProgress };
};
