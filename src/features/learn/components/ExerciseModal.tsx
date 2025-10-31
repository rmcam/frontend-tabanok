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
import { ChevronLeft, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import {
  useExerciseById,
  useSubmitExercise,
} from "@/hooks/exercises/exercises.hooks";
import type {
  QuizContent,
  MatchingContent,
  FillInTheBlankContent,
  AudioPronunciationContent,
  TranslationContent,
  FunFactContent,
} from "@/types/learning/learning.d";
import type { Exercise } from "@/types/exercises/exercises.d";
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

  const {
    data: exercise,
    isLoading,
    error,
    refetch,
  } = useExerciseById(exerciseId || "");

  // Logs de depuración eliminados
  // The submitExerciseMutation and isSubmitting are handled by child components,
  // so we just import the hook to ensure it's available in the context if needed.
  // The submitExerciseMutation and isSubmitting are handled by child components,
  // so we just import the hook to ensure it's available in the context if needed.
  useSubmitExercise();

  const [isExerciseSubmitted, setIsExerciseSubmitted] = useState(false);
  const [exerciseIsCorrect, setExerciseIsCorrect] = useState<boolean | null>(
    null
  );
  const [awardedPoints, setAwardedPoints] = useState<number>(0);
  const [showRetryOption, setShowRetryOption] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Nuevo estado para manejar el envío

  useEffect(() => {
    if (isOpen && exerciseId) {
      refetch(); // Refetch exercise data when modal opens with a new exerciseId
      setIsExerciseSubmitted(false);
      setExerciseIsCorrect(null);
      setAwardedPoints(0);
      setShowRetryOption(false);
      setIsSubmitting(false); // Resetear estado de envío
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
    setIsSubmitting(false); // Finalizar el estado de envío

    if (isCorrect) {
      // Esperar un momento antes de cerrar para que el usuario vea el mensaje de "Correcto"
      setTimeout(() => {
        onExerciseComplete(isCorrect, actualPoints); // Notify parent component
        onClose(); // Close modal only if correct
      }, 1500); // Cerrar después de 1.5 segundos
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
    setIsSubmitting(false); // Resetear estado de envío
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
              {exercise?.title || t("Ejercicio")}
              {exercise?.type && (
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
              {exercise?.description ||
                t("Descripción del ejercicio no disponible.")}
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

        {exercise && exercise.content && !isExerciseSubmitted && (
          <div className="prose dark:prose-invert max-w-none mt-4">
            {exercise.type === "quiz" && (
              <LearningQuiz
                exerciseId={exercise.id}
                quiz={exercise.content as QuizContent}
                onComplete={handleExerciseCompleteInternal}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting} // Pasar la función para actualizar el estado de envío
              />
            )}
            {exercise.type === "matching" && (
              <LearningMatching
                exerciseId={exercise.id}
                matching={exercise.content as MatchingContent}
                onComplete={handleExerciseCompleteInternal}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
              />
            )}
            {exercise.type === "fill-in-the-blank" && (
              <LearningFillInTheBlank
                exerciseId={exercise.id}
                fillInTheBlank={exercise.content as FillInTheBlankContent}
                onComplete={handleExerciseCompleteInternal}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
              />
            )}
            {exercise.type === "audio-pronunciation" && (
              <LearningAudioPronunciation
                exerciseId={exercise.id}
                audioPronunciation={
                  exercise.content as AudioPronunciationContent
                }
                onComplete={handleExerciseCompleteInternal}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
              />
            )}
            {exercise.type === "translation" && (
              <LearningTranslation
                exerciseId={exercise.id}
                translation={exercise.content as TranslationContent}
                onComplete={handleExerciseCompleteInternal}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
              />
            )}
            {exercise.type === "fun-fact" && (
              <LearningFunFact
                exerciseId={exercise.id}
                funFact={exercise.content as FunFactContent}
                onComplete={handleExerciseCompleteInternal}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
              />
            )}

            {/* Manejar tipos de ejercicio desconocidos */}
            {![
              "quiz",
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

        {isExerciseSubmitted && exerciseIsCorrect !== null && (
          <div
            className={`mt-6 p-6 rounded-lg flex flex-col items-center justify-center space-y-4 transition-all duration-500 ease-in-out transform ${
              exerciseIsCorrect
                ? "bg-green-50 border-green-200 text-green-800 shadow-lg scale-105"
                : "bg-red-50 border-red-200 text-red-800 shadow-lg scale-105"
            }`}
            role="status"
            aria-live="polite"
          >
            {exerciseIsCorrect ? (
              <CheckCircle2 className="h-16 w-16 text-green-600 animate-bounce" />
            ) : (
              <XCircle className="h-16 w-16 text-red-600 animate-shake" />
            )}
            <p className="text-3xl font-extrabold">
              {exerciseIsCorrect ? t("¡Correcto!") : t("Incorrecto.")}
            </p>
            {awardedPoints > 0 && (
              <p className="text-xl font-semibold">
                {t("Puntos obtenidos")}: {awardedPoints}
              </p>
            )}
            {!exerciseIsCorrect && (
              <p className="text-lg text-center">
                {t("Sigue practicando para mejorar.")}
              </p>
            )}
            {showRetryOption && (
              <Button
                onClick={handleRetry}
                className="mt-4 px-8 py-3 text-lg font-semibold cursor-pointer transition-all duration-200 ease-in-out hover:scale-105"
              >
                {t("Reintentar")}
              </Button>
            )}
          </div>
        )}

        {isSubmitting && (
          <div className="mt-6 p-6 rounded-lg flex flex-col items-center justify-center space-y-4 bg-blue-50 border-blue-200 text-blue-800 shadow-lg">
            <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
            <p className="text-xl font-bold">{t("Enviando respuesta...")}</p>
          </div>
        )}

        <DialogFooter className="mt-6 flex justify-between">
          <Button
            onClick={onClose}
            variant="outline"
            className="cursor-pointer"
            disabled={isSubmitting || (exercise?.userProgress?.isCompleted && !showRetryOption)}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> {t("Volver a la Lección")}
          </Button>
          {exercise?.userProgress?.isCompleted && !showRetryOption && (
            <div className="flex items-center text-green-600 font-semibold">
              <CheckCircle2 className="mr-2 h-5 w-5" />
              {t("Completado")}
              {exercise.userProgress.score !== null && (
                <span className="ml-2">({exercise.userProgress.score} {t("puntos")})</span>
              )}
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExerciseModal;
