import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import type { TranslationContent } from "@/types/learning/learning.d";
import type { SubmitExerciseResponse, TranslationDetails } from '@/types/progress/progress.d'; // Importar SubmitExerciseResponse y TranslationDetails
import { useHeartsStore } from "@/stores/heartsStore";
import { useSubmitExerciseProgress } from "@/hooks/progress/progress.hooks"; // Importar useSubmitExerciseProgress

interface LearningTranslationProps {
  exerciseId: string;
  translation: TranslationContent;
  onComplete?: (isCorrect: boolean, awardedPoints?: number) => void;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
}

const LearningTranslation: React.FC<LearningTranslationProps> = ({
  exerciseId,
  translation,
  onComplete,
  setIsSubmitting,
}) => {
  // Aceptar exerciseId
  const { t } = useTranslation();
  const [userAnswer, setUserAnswer] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [submissionResponse, setSubmissionResponse] = useState<SubmitExerciseResponse | null>(null); // Nuevo estado para la respuesta

  const { decrementHeart } = useHeartsStore();
  const { mutate: submitExerciseProgressMutation, isPending: isSubmittingHook } =
    useSubmitExerciseProgress();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isSubmitted) return;
    setUserAnswer(e.target.value);
  };

  const handleSubmit = () => {
    if (userAnswer.trim() === "") {
      toast.error(t("Por favor, escribe tu traducción antes de enviar."));
      return;
    }

    setIsSubmitting(true); // Indicar que el envío ha comenzado

    const submission = {
      exerciseId: exerciseId,
      answers: { userAnswer: userAnswer.trim() },
    };

    submitExerciseProgressMutation(submission, {
      onSuccess: (response) => {
        setSubmissionResponse(response); // Guardar la respuesta completa directamente
        const correct = response?.isCorrect; // Acceder directamente a isCorrect
        setIsCorrect(correct ?? false);
        setIsSubmitted(true);
        if (correct) {
          toast.success(
            t("¡Traducción correcta! Has ganado {{points}} puntos.", {
              points: response?.score, // Usar response?.score
            })
          );
        } else {
          toast.error(
            t(
              "Traducción incorrecta. La respuesta correcta era: {{correctTranslation}}",
              {
                correctTranslation:
                  (response?.details && 'correctTranslation' in response.details) // Acceder directamente a details
                    ? (response.details as TranslationDetails).correctTranslation
                    : translation.correctTranslation,
              }
            )
          );
          decrementHeart();
        }
        onComplete?.(correct ?? false, response?.score); // Usar response?.score
      },
      onError: (error) => {
        console.error("Error al enviar traducción:", error);
        toast.error(t("Error al enviar traducción."));
        setIsCorrect(false);
        setIsSubmitted(true);
        decrementHeart();
        onComplete?.(false);
      },
      onSettled: () => {
        // setIsSubmitting(false); // Esto se maneja en ExerciseModal
      },
    });
  };

  const handleReset = () => {
    setUserAnswer("");
    setIsSubmitted(false);
    setIsCorrect(null);
    setIsSubmitting(false); // Resetear el estado de envío en el padre también
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">
          {t("Traducción")}
        </CardTitle>
        <CardDescription>
          {translation.targetLanguage ? t("Traduce la siguiente frase al {{targetLanguage}}.", {
            targetLanguage:
              translation.targetLanguage === "es"
                ? t("español")
                : t("Kamentsá"),
          }) : t("Traduce la siguiente frase.")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {translation.sourceText ? (
          <div className="p-4 border rounded-md bg-muted">
            <p className="text-xl font-semibold text-foreground">
              {translation.sourceText}
            </p>
          </div>
        ) : (
          <p className="text-muted-foreground">{t("Frase a traducir no disponible.")}</p>
        )}

        <Textarea
          placeholder={t("Escribe tu traducción aquí...")}
          value={userAnswer}
          onChange={handleInputChange}
          disabled={isSubmitted}
          rows={4}
          className="w-full"
          aria-label={t("Campo de texto para tu traducción")}
        />

        {isSubmitted && isCorrect !== null && (
          <div
            className={`mt-6 p-4 rounded-md flex flex-col items-center justify-center space-y-2 transition-all duration-300 ease-in-out transform ${
              isCorrect
                ? "bg-green-100 text-green-700 scale-105"
                : "bg-red-100 text-red-700 scale-105"
            }`}
            role="status"
            aria-live="polite"
          >
            {isCorrect ? (
              <CheckCircle2 className="h-10 w-10 text-green-600 animate-bounce" />
            ) : (
              <XCircle className="h-10 w-10 text-red-600 animate-shake" />
            )}
            <p className="text-xl font-bold">
              {isCorrect
                ? t("¡Traducción Correcta!")
                : t("Traducción Incorrecta.")}
            </p>
            {!isCorrect &&
              submissionResponse?.details &&
              'correctTranslation' in submissionResponse.details && (
                <p className="text-md text-center">
                  {t("La respuesta correcta era:")}{" "}
                  <span className="font-semibold">
                    {(submissionResponse.details as TranslationDetails).correctTranslation}
                  </span>
                </p>
              )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={isSubmittingHook}
          className="cursor-pointer"
        >
          <RefreshCw className="h-4 w-4 mr-2" /> {t("Reiniciar")}
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmittingHook || isSubmitted || userAnswer.trim() === "" || !translation.sourceText}
          className="cursor-pointer"
        >
          {isSubmittingHook ? t("Enviando...") : t("Enviar Traducción")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LearningTranslation;
