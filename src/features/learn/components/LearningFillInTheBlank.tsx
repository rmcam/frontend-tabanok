import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import type { FillInTheBlankContent } from '@/types/learning/learning.d';
import type { SubmitExerciseResponse, FillInTheBlankDetails } from '@/types/progress/progress.d'; // Importar SubmitExerciseResponse y FillInTheBlankDetails
import { useHeartsStore } from '@/stores/heartsStore';
import { useSubmitExerciseProgress } from '@/hooks/progress/progress.hooks'; // Importar useSubmitExerciseProgress

interface LearningFillInTheBlankProps {
  exerciseId: string;
  fillInTheBlank: FillInTheBlankContent;
  onComplete?: (isCorrect: boolean, awardedPoints?: number) => void;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
}

const LearningFillInTheBlank: React.FC<LearningFillInTheBlankProps> = ({ exerciseId, fillInTheBlank, onComplete, isSubmitting, setIsSubmitting }) => {
  const { t } = useTranslation();
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [blankStatus, setBlankStatus] = useState<Record<string, boolean | null>>({});
  const [submissionResponse, setSubmissionResponse] = useState<SubmitExerciseResponse | null>(null); // Nuevo estado para la respuesta

  const { decrementHeart } = useHeartsStore();
  const { mutate: submitExerciseProgressMutation, isPending: isSubmittingHook } = useSubmitExerciseProgress();

  useEffect(() => {
    const initialAnswers: Record<string, string> = {};
    const initialStatus: Record<string, boolean | null> = {};
    if (fillInTheBlank.blanks) {
      fillInTheBlank.blanks.forEach(blank => {
        initialAnswers[blank.id] = '';
        initialStatus[blank.id] = null;
      });
    }
    setUserAnswers(initialAnswers);
    setBlankStatus(initialStatus);
  }, [fillInTheBlank]);

  const handleInputChange = (blankId: string, value: string) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [blankId]: value }));
  };

  const handleSubmit = () => {
    if (!fillInTheBlank.blanks) {
      toast.error(t("Contenido del ejercicio no disponible."));
      return;
    }
    const allBlanksFilled = fillInTheBlank.blanks.every(blank => userAnswers[blank.id]?.trim() !== '');
    if (!allBlanksFilled) {
      toast.error(t("Por favor, rellena todos los espacios en blanco antes de enviar."));
      return;
    }

    setIsSubmitting(true); // Indicar que el envío ha comenzado

    const submission = {
      exerciseId: exerciseId,
      answers: { userAnswer: userAnswers },
    };

    submitExerciseProgressMutation(submission, {
      onSuccess: (response) => {
        setSubmissionResponse(response); // Guardar la respuesta completa directamente
        const correct = response?.isCorrect; // Acceder directamente a isCorrect
        setIsCorrect(correct ?? false);
        setIsSubmitted(true);

        const newBlankStatus: Record<string, boolean | null> = {};
        // Si el backend devuelve detalles de cada blank, usarlos. De lo contrario, usar la lógica local.
        if (response?.details && 'blankResults' in response.details) {
          (response.details as FillInTheBlankDetails).blankResults.forEach((result: { id: string; isCorrect: boolean; }) => {
            newBlankStatus[result.id] = result.isCorrect;
          });
        } else if (fillInTheBlank.blanks) {
          fillInTheBlank.blanks.forEach(blank => {
            const userAnswer = userAnswers[blank.id]?.trim().toLowerCase();
            const correctAnswers = blank.correctAnswers.map(ans => ans.toLowerCase());
            newBlankStatus[blank.id] = correctAnswers.includes(userAnswer);
          });
        }
        setBlankStatus(newBlankStatus);

        if (correct) {
          toast.success(t("¡Correcto! Has ganado {{points}} puntos.", { points: response?.score })); // Usar response?.score
        } else {
          toast.error(t("Incorrecto. Inténtalo de nuevo."));
          decrementHeart();
        }
        onComplete?.(correct ?? false, response?.score); // Usar response?.score
      },
      onError: (error) => {
        console.error('Error al enviar respuesta del ejercicio:', error);
        toast.error(t("Error al enviar respuesta del ejercicio."));
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
    const initialAnswers: Record<string, string> = {};
    const initialStatus: Record<string, boolean | null> = {};
    if (fillInTheBlank.blanks) {
      fillInTheBlank.blanks.forEach(blank => {
        initialAnswers[blank.id] = '';
        initialStatus[blank.id] = null;
      });
    }
    setUserAnswers(initialAnswers);
    setBlankStatus(initialStatus);
    setIsSubmitted(false);
    setIsCorrect(null);
    setIsSubmitting(false); // Resetear el estado de envío en el padre también
  };

  const renderTextWithBlanks = () => {
    if (!fillInTheBlank.text || !fillInTheBlank.blanks) {
      return <p className="text-muted-foreground">{t("Contenido del ejercicio no disponible.")}</p>;
    }
    const currentText = fillInTheBlank.text;
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    // Usar un regex para encontrar marcadores de espacio en blanco como [BLANK_ID]
    const blankRegex = /\[BLANK_([a-zA-Z0-9-]+)\]/g;
    let match;

    while ((match = blankRegex.exec(currentText)) !== null) {
    const blankId = match[1]; // e.g., "123"

      // Añadir el texto antes del espacio en blanco
      if (match.index > lastIndex) {
        elements.push(<span key={`text-${lastIndex}`}>{currentText.substring(lastIndex, match.index)}</span>);
      }

      // Añadir el input para el espacio en blanco
      const status = blankStatus[blankId];
      const inputClass = isSubmitted
        ? status === true
          ? 'border-green-500 focus-visible:ring-green-500'
          : status === false
            ? 'border-red-500 focus-visible:ring-red-500'
            : ''
        : '';

      elements.push(
        <Input
          key={blankId}
          type="text"
          value={userAnswers[blankId] || ''}
          onChange={(e) => handleInputChange(blankId, e.target.value)}
          className={`inline-flex w-32 mx-1 text-center ${inputClass}`}
          disabled={isSubmitted}
          aria-label={`Espacio en blanco para ${blankId}`}
        />
      );
      lastIndex = blankRegex.lastIndex;
    }

    // Añadir cualquier texto restante
    if (lastIndex < currentText.length) {
      elements.push(<span key={`text-${lastIndex}`}>{currentText.substring(lastIndex)}</span>);
    }

    return <p className="text-lg leading-relaxed">{elements}</p>;
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">{t("Rellena los Espacios en Blanco")}</CardTitle>
        <CardDescription>{t("Completa la frase con las palabras correctas.")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 border rounded-md bg-muted">
          {renderTextWithBlanks()}
        </div>

        {isSubmitted && isCorrect !== null && (
          <div
            className={`mt-6 p-4 rounded-md flex flex-col items-center justify-center space-y-2 transition-all duration-300 ease-in-out transform ${isCorrect ? 'bg-green-100 text-green-700 scale-105' : 'bg-red-100 text-red-700 scale-105'}`}
            role="status"
            aria-live="polite"
          >
            {isCorrect ? (
              <CheckCircle2 className="h-10 w-10 text-green-600 animate-bounce" />
            ) : (
              <XCircle className="h-10 w-10 text-red-600 animate-shake" />
            )}
            <p className="text-xl font-bold">
              {isCorrect ? t("¡Respuesta Correcta!") : t("Respuesta Incorrecta.")}
            </p>
            {!isCorrect && submissionResponse?.details && 'correctBlanks' in submissionResponse.details && (
              <p className="text-md text-center">
                {t("Las respuestas correctas eran:")} <span className="font-semibold">{(submissionResponse.details as FillInTheBlankDetails).correctBlanks.join(', ')}</span>
              </p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleReset} disabled={isSubmittingHook}>
          <RefreshCw className="h-4 w-4 mr-2" /> {t("Reiniciar")}
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmittingHook || isSubmitted || isSubmitting}>
          {isSubmittingHook ? t("Enviando...") : t("Enviar Respuesta")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LearningFillInTheBlank;
