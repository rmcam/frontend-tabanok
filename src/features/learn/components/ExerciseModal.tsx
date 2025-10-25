import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChevronLeft, CheckCircle2, XCircle } from "lucide-react";
import {
  useExerciseById,
  useSubmitExercise,
} from "@/hooks/exercises/exercises.hooks";
import { useProfile } from "@/hooks/auth/auth.hooks";
import type {
  LearningQuizContent,
  LearningMatchingContent,
  LearningFillInTheBlankContent,
  LearningAudioPronunciationContent,
  LearningTranslationContent,
  LearningFunFactContent,
} from "@/types/learning";
import LearningQuiz from "./LearningQuiz";
import LearningMatching from "./LearningMatching";
import LearningFillInTheBlank from "./LearningFillInTheBlank";
import LearningAudioPronunciation from "./LearningAudioPronunciation";
import LearningTranslation from "./LearningTranslation";
import LearningFunFact from "./LearningFunFact";
import { Skeleton } from "@/components/ui/skeleton";

interface ExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseId: string | null;
  onExerciseComplete: (isCorrect: boolean, points: number) => void;
}

const ExerciseModal: React.FC<ExerciseModalProps> = ({
  isOpen,
  onClose,
  exerciseId,
  onExerciseComplete,
}) => {
  const { t } = useTranslation();
  const { data: userProfile } = useProfile();
  const userId = userProfile?.id;

  const {
    data: exercise,
    isLoading,
    error,
    refetch,
  } = useExerciseById(exerciseId || "");
  // The submitExerciseMutation and isSubmitting are handled by child components,
  // so we just import the hook to ensure it's available in the context if needed.
  useSubmitExercise();

  const [isExerciseSubmitted, setIsExerciseSubmitted] = useState(false);
  const [exerciseIsCorrect, setExerciseIsCorrect] = useState<boolean | null>(
    null
  );
  const [awardedPoints, setAwardedPoints] = useState<number>(0);
  const [showRetryOption, setShowRetryOption] = useState(false);

  useEffect(() => {
    if (isOpen && exerciseId) {
      refetch(); // Refetch exercise data when modal opens with a new exerciseId
      setIsExerciseSubmitted(false);
      setExerciseIsCorrect(null);
      setAwardedPoints(0);
      setShowRetryOption(false);
    }
  }, [isOpen, exerciseId, refetch]);

  const handleExerciseCompleteInternal = (
    isCorrect: boolean,
    points?: number
  ) => {
    setIsExerciseSubmitted(true);
    setExerciseIsCorrect(isCorrect);
    const actualPoints = points || 0;
    setAwardedPoints(actualPoints);

    if (isCorrect) {
      onExerciseComplete(isCorrect, actualPoints); // Notify parent component
      onClose(); // Close modal only if correct
    } else {
      setShowRetryOption(true); // Show retry option if incorrect
      // Do not close modal
    }
  };

  const handleRetry = () => {
    setIsExerciseSubmitted(false);
    setExerciseIsCorrect(null);
    setAwardedPoints(0);
    setShowRetryOption(false);
    // Optionally, trigger a reset on the child exercise component if it supports it
    // For now, refetching the exercise will reset the child components as well
    refetch();
  };

  if (!exerciseId || !isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          {isLoading ? (
            <Skeleton className="h-8 w-3/4 mb-2" />
          ) : error ? (
            <DialogTitle className="text-red-500">
              {t("Error al cargar el ejercicio")}
            </DialogTitle>
          ) : (
            <DialogTitle className="text-3xl font-bold text-primary">
              {exercise?.title && exercise.title !== "undefined"
                ? exercise.title
                : t("Ejercicio")}
              {exercise?.type && exercise.type !== "undefined" && (
                <span className="text-xl font-semibold text-secondary-foreground ml-2">
                  ({t(exercise.type)})
                </span>
              )}
            </DialogTitle>
          )}
          {isLoading ? (
            <Skeleton className="h-4 w-full" />
          ) : (
            <DialogDescription className="text-muted-foreground">
              {exercise?.description && exercise.description !== "undefined"
                ? exercise.description
                : t("Descripción del ejercicio no disponible.")}
            </DialogDescription>
          )}
        </DialogHeader>

        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-1/2" />
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center p-4">
            <p>{t("No se pudo cargar el ejercicio.")}</p>
            <Button
              onClick={onClose}
              className="mt-4 cursor-pointer"
            >
              {t("Cerrar")}
            </Button>
          </div>
        )}

        {exercise && exercise.content && (
          <div className="prose dark:prose-invert max-w-none mt-4">
            {exercise.type === "multiple-choice" && (
              <LearningQuiz
                exerciseId={exercise.id}
                quiz={exercise.content as LearningQuizContent["content"]}
                onComplete={handleExerciseCompleteInternal}
              />
            )}
            {exercise.type === "matching" && (
              <LearningMatching
                exerciseId={exercise.id}
                matching={
                  exercise.content as LearningMatchingContent["content"]
                }
                onComplete={handleExerciseCompleteInternal}
              />
            )}
            {exercise.type === "fill-in-the-blank" && (
              <LearningFillInTheBlank
                exerciseId={exercise.id}
                fillInTheBlank={
                  exercise.content as LearningFillInTheBlankContent["content"]
                }
                onComplete={handleExerciseCompleteInternal}
              />
            )}
            {exercise.type === "audio-pronunciation" && (
              <LearningAudioPronunciation
                exerciseId={exercise.id}
                audioPronunciation={
                  exercise.content as LearningAudioPronunciationContent["content"]
                }
                onComplete={handleExerciseCompleteInternal}
              />
            )}
            {exercise.type === "translation" && (
              <LearningTranslation
                exerciseId={exercise.id}
                translation={
                  exercise.content as LearningTranslationContent["content"]
                }
                onComplete={handleExerciseCompleteInternal}
              />
            )}
            {exercise.type === "fun-fact" && (
              <LearningFunFact
                exerciseId={exercise.id}
                funFact={exercise.content as LearningFunFactContent["content"]}
                onComplete={handleExerciseCompleteInternal}
              />
            )}

            {/* Mensaje de resultado general del ejercicio */}
            {isExerciseSubmitted && exerciseIsCorrect !== null && (
              <Alert
                className={`mt-6 ${
                  exerciseIsCorrect
                    ? "bg-green-100 text-green-700 border-green-500"
                    : "bg-red-100 text-red-700 border-red-500"
                }`}
                role="status"
                aria-live="polite"
              >
                <div className="flex items-center space-x-2">
                  {exerciseIsCorrect ? (
                    <CheckCircle2 className="h-6 w-6" />
                  ) : (
                    <XCircle className="h-6 w-6" />
                  )}
                  <AlertDescription className="text-lg font-semibold">
                    {exerciseIsCorrect
                      ? t("¡Ejercicio Completado Correctamente!")
                      : t("Ejercicio Completado Incorrectamente.")}
                  </AlertDescription>
                </div>
                {awardedPoints > 0 && (
                  <p className="text-lg font-semibold ml-4 mt-2">
                    {t("Puntos Ganados")}: {awardedPoints}
                  </p>
                )}
              </Alert>
            )}

            {/* Manejar tipos de ejercicio desconocidos */}
            {![
              "multiple-choice",
              "matching",
              "fill-in-the-blank",
              "audio-pronunciation",
              "translation",
              "fun-fact",
            ].includes(exercise.type) && (
              <div className="mt-8 p-4 rounded-md bg-yellow-100 text-yellow-800">
                <p className="font-semibold">
                  {t("Tipo de ejercicio desconocido")}: {exercise.type}
                </p>
                <pre className="mt-2 text-sm bg-yellow-50 p-3 rounded-md overflow-auto">
                  {JSON.stringify(exercise.content, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="mt-6 flex justify-between">
          <Button
            onClick={onClose}
            variant="outline"
            className="cursor-pointer"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> {t("Volver a la Lección")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExerciseModal;
