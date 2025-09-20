import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import type { FillInTheBlankContentData } from '@/types/learning';
import { useSubmitExercise } from '@/hooks/progress/progress.hooks';
import { useHeartsStore } from '@/stores/heartsStore';

interface LearningFillInTheBlankProps {
  fillInTheBlank: FillInTheBlankContentData;
  onComplete?: (isCorrect: boolean, awardedPoints?: number) => void;
}

const LearningFillInTheBlank: React.FC<LearningFillInTheBlankProps> = ({ fillInTheBlank, onComplete }) => {
  const { t } = useTranslation();
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [blankStatus, setBlankStatus] = useState<Record<string, boolean | null>>({});

  const { decrementHeart } = useHeartsStore();
  const { mutate: submitExerciseMutation, isPending: isSubmitting } = useSubmitExercise();

  useEffect(() => {
    const initialAnswers: Record<string, string> = {};
    const initialStatus: Record<string, boolean | null> = {};
    fillInTheBlank.blanks.forEach(blank => {
      initialAnswers[blank.id] = '';
      initialStatus[blank.id] = null;
    });
    setUserAnswers(initialAnswers);
    setBlankStatus(initialStatus);
  }, [fillInTheBlank]);

  const handleInputChange = (blankId: string, value: string) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [blankId]: value }));
  };

  const handleSubmit = () => {
    const allBlanksFilled = fillInTheBlank.blanks.every(blank => userAnswers[blank.id]?.trim() !== '');
    if (!allBlanksFilled) {
      toast.error(t("Por favor, rellena todos los espacios en blanco antes de enviar."));
      return;
    }

    const submission = {
      exerciseId: fillInTheBlank.exerciseId,
      userAnswer: userAnswers,
    };

    submitExerciseMutation({
      id: fillInTheBlank.exerciseId,
      submission: submission,
    }, {
      onSuccess: (response) => {
        const correct = response.data.isCorrect;
        setIsCorrect(correct);
        setIsSubmitted(true);

        const newBlankStatus: Record<string, boolean | null> = {};
        fillInTheBlank.blanks.forEach(blank => {
          const userAnswer = userAnswers[blank.id]?.trim().toLowerCase();
          const correctAnswers = blank.correctAnswers.map(ans => ans.toLowerCase());
          newBlankStatus[blank.id] = correctAnswers.includes(userAnswer);
        });
        setBlankStatus(newBlankStatus);

        if (correct) {
          toast.success(t("¡Correcto! Has ganado {{points}} puntos.", { points: response.data.awardedPoints }));
        } else {
          toast.error(t("Incorrecto. Inténtalo de nuevo."));
          decrementHeart();
        }
        onComplete?.(correct, response.data.awardedPoints);
      },
      onError: (error) => {
        console.error('Error al enviar respuesta del ejercicio:', error);
        toast.error(t("Error al enviar respuesta del ejercicio."));
        setIsCorrect(false);
        setIsSubmitted(true);
        decrementHeart();
        onComplete?.(false);
      }
    });
  };

  const handleReset = () => {
    const initialAnswers: Record<string, string> = {};
    const initialStatus: Record<string, boolean | null> = {};
    fillInTheBlank.blanks.forEach(blank => {
      initialAnswers[blank.id] = '';
      initialStatus[blank.id] = null;
    });
    setUserAnswers(initialAnswers);
    setBlankStatus(initialStatus);
    setIsSubmitted(false);
    setIsCorrect(null);
  };

  const renderTextWithBlanks = () => {
    const currentText = fillInTheBlank.text;
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    // Usar un regex para encontrar marcadores de espacio en blanco como [BLANK_ID]
    const blankRegex = /\[BLANK_([a-zA-Z0-9-]+)\]/g;
    let match;

    while ((match = blankRegex.exec(currentText)) !== null) {
      const blankPlaceholder = match[0]; // e.g., "[BLANK_123]"
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
            className={`flex items-center justify-center p-4 rounded-md ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
            role="status"
            aria-live="polite"
          >
            {isCorrect ? <CheckCircle2 className="h-6 w-6 mr-2" /> : <XCircle className="h-6 w-6 mr-2" />}
            <p className="text-lg font-semibold">
              {isCorrect ? t("¡Respuesta Correcta!") : t("Respuesta Incorrecta.")}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleReset} disabled={isSubmitting}>
          <RefreshCw className="h-4 w-4 mr-2" /> {t("Reiniciar")}
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting || isSubmitted}>
          {isSubmitting ? t("Enviando...") : t("Enviar Respuesta")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LearningFillInTheBlank;
