import React from "react";
import { useTranslation } from "react-i18next";
import type { LearningExercise } from "@/types/learning";

interface ExerciseDisplayItemProps {
  exercise: LearningExercise;
}

const ExerciseDisplayItem: React.FC<ExerciseDisplayItemProps> = ({
  exercise,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-foreground">
          {exercise.title}
        </h3>
        {exercise.description && (
          <p className="text-sm text-muted-foreground mt-1">
            {exercise.description}
          </p>
        )}
      </div>
      {exercise.points > 0 && (
        <span className="text-lg font-bold text-primary ml-4">
          {exercise.points} {t("pts")}
        </span>
      )}
    </div>
  );
};

export default ExerciseDisplayItem;
