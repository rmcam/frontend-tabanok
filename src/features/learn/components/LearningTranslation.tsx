import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import type { TranslationContentData } from '@/types/learning';
import { useSubmitExercise } from '@/hooks/progress/progress.hooks';
import { useHeartsStore } from '@/stores/heartsStore';

interface LearningTranslationProps {
  translation: TranslationContentData;
  onComplete?: (isCorrect: boolean, awardedPoints?: number) => void;
}

const LearningTranslation: React.FC<LearningTranslationProps> = ({ translation, onComplete }) => {
  const { t } = useTranslation();
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const { decrementHeart } = useHeartsStore();
  const { mutate: submitExerciseMutation, isPending: isSubmitting } = useSubmitExercise();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isSubmitted) return;
    setUserAnswer(e.target.value);
  };

  const handleSubmit = () => {
    if (userAnswer.trim() === '') {
      toast.error(t("Por favor, escribe tu traducción antes de enviar."));
      return;
    }

    const submission = {
      exerciseId: translation.exerciseId,
      userAnswer: userAnswer.trim(),
    };

    submitExerciseMutation({
      id: translation.exerciseId,
      submission: submission,
    }, {
      onSuccess: (response) => {
        const correct = response.data.isCorrect;
        setIsCorrect(correct);
        setIsSubmitted(true);
        if (correct) {
          toast.success(t("¡Traducción correcta! Has ganado {{points}} puntos.", { points: response.data.awardedPoints }));
        } else {
          toast.error(t("Traducción incorrecta. La respuesta correcta era: {{correctTranslation}}", { correctTranslation: translation.correctTranslation }));
          decrementHeart();
        }
        onComplete?.(correct, response.data.awardedPoints);
      },
      onError: (error) => {
        console.error('Error al enviar traducción:', error);
        toast.error(t("Error al enviar traducción."));
        setIsCorrect(false);
        setIsSubmitted(true);
        decrementHeart();
        onComplete?.(false);
      }
    });
  };

  const handleReset = () => {
    setUserAnswer('');
    setIsSubmitted(false);
    setIsCorrect(null);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">{t("Traducción")}</CardTitle>
        <CardDescription>{t("Traduce la siguiente frase al {{targetLanguage}}.", { targetLanguage: translation.targetLanguage === 'es' ? t("español") : t("Kamentsá") })}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 border rounded-md bg-muted">
          <p className="text-xl font-semibold text-foreground">{translation.sourceText}</p>
        </div>

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
            className={`flex items-center justify-center p-4 rounded-md ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
            role="status"
            aria-live="polite"
          >
            {isCorrect ? <CheckCircle2 className="h-6 w-6 mr-2" /> : <XCircle className="h-6 w-6 mr-2" />}
            <p className="text-lg font-semibold">
              {isCorrect ? t("¡Traducción Correcta!") : t("Traducción Incorrecta.")}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleReset} disabled={isSubmitting}>
          <RefreshCw className="h-4 w-4 mr-2" /> {t("Reiniciar")}
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting || isSubmitted || userAnswer.trim() === ''}>
          {isSubmitting ? t("Enviando...") : t("Enviar Traducción")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LearningTranslation;
