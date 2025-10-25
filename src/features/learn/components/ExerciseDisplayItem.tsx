import React from "react";
import { useTranslation } from "react-i18next";
import type { LearningExercise } from "@/types/learning";

interface ExerciseDisplayItemProps {
  exercise: LearningExercise;
  isCompleted: boolean;
  difficulty: string;
  type: string;
}

const getDifficultyEmoji = (difficulty: string): string => {
  switch (difficulty) {
    case "easy":
      return "🟢 Facil";
    case "normal":
      return "🟡 Normal";
    case "hard":
      return "🔴 Dificil";
    default:
      return "⚪ Unknown";
  }
};

const ExerciseDisplayItem: React.FC<ExerciseDisplayItemProps> = ({
  exercise,
  isCompleted,
  difficulty,
  type,
}) => {
  const { t } = useTranslation();
  const difficultyEmoji = getDifficultyEmoji(difficulty);

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-foreground">
            {exercise.title}
          </h3>
          <span className="text-sm text-muted-foreground">
            ({difficultyEmoji} - {type})
          </span>
        </div>
        {exercise.description && (
          <p className="text-sm text-muted-foreground mt-1">
            {exercise.description}
          </p>
        )}
      </div>
      {isCompleted ? (
        <span className="text-lg font-bold text-green-500 ml-4">
          {t("COMPLETADO")}
        </span>
      ) : (
        exercise.points > 0 && (
          <span className="text-lg font-bold text-primary ml-4">
            {exercise.points} {t("pts")}
          </span>
        )
      )}
    </div>
  );
};

export default ExerciseDisplayItem;
