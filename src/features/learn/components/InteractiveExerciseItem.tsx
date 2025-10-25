import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Lock } from "lucide-react";
import ExerciseDisplayItem from "@/features/learn/components/ExerciseDisplayItem";
import type { LearningExercise } from "@/types/learning";

interface InteractiveExerciseItemProps {
  exercise: LearningExercise;
  isCompleted: boolean;
  isLocked: boolean;
  onOpenExercise: (exerciseId: string) => void;
}

const InteractiveExerciseItem: React.FC<InteractiveExerciseItemProps> = ({
  exercise,
  isCompleted,
  isLocked,
  onOpenExercise,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative p-4 rounded-lg shadow-md transition-all duration-300
        ${
          isCompleted
            ? "bg-green-500/10 border-green-500"
            : "bg-card border-border"
        }
        ${
          isLocked
            ? "opacity-60 cursor-not-allowed"
            : "hover:shadow-lg hover:border-primary cursor-pointer"
        }`}
      onClick={(e) => {
        if (!isLocked) {
          e.stopPropagation(); // Prevent any nested click handlers from firing
          onOpenExercise(exercise.id);
        }
      }}
    >
      {isCompleted && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 text-green-500"
        >
          <CheckCircle className="h-6 w-6" />
        </motion.div>
      )}
      {isLocked && (
        <div className="absolute top-2 right-2 text-muted-foreground">
          <Lock className="h-6 w-6" />
        </div>
      )}
      <ExerciseDisplayItem
        exercise={exercise}
        isCompleted={isCompleted}
        difficulty={exercise.difficulty}
        type={exercise.type}
      />
    </motion.div>
  );
};

export default InteractiveExerciseItem;
