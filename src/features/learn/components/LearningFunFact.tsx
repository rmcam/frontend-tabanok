import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, CheckCircle2 } from 'lucide-react'; // Añadir CheckCircle2
import type { FunFactContent } from '@/types/learning/learning.d';
import { toast } from 'sonner'; // Importar toast
import { Button } from '@/components/ui/button'; // Importar Button
import { CardFooter } from '@/components/ui/card'; // Importar CardFooter
import { useSubmitExerciseProgress } from '@/hooks/progress/progress.hooks'; // Importar useSubmitExerciseProgress

interface LearningFunFactProps {
  exerciseId: string;
  funFact: FunFactContent;
  onComplete?: (isCorrect: boolean, awardedPoints?: number) => void;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
}

const LearningFunFact: React.FC<LearningFunFactProps> = ({ exerciseId, funFact, onComplete, isSubmitting, setIsSubmitting }) => { // Aceptar exerciseId y onComplete
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [awardedPoints, setAwardedPoints] = React.useState<number>(0);

  const { mutate: submitExerciseProgressMutation, isPending: isSubmittingHook } = useSubmitExerciseProgress();

  const handleComplete = () => {
    if (!exerciseId) {
      console.error("Exercise ID no disponible.");
      return;
    }

    setIsSubmitting(true); // Indicar que el envío ha comenzado

    submitExerciseProgressMutation({
      exerciseId: exerciseId,
      answers: { userAnswer: "fun_fact_viewed" }, // Placeholder para indicar que se vio el fun-fact
    }, {
      onSuccess: (response) => {
        setIsSubmitted(true);
        setAwardedPoints(response?.score ?? 0); // Usar response?.score
        toast.success(t("¡Dato curioso completado! Has ganado {{points}} puntos.", { points: response?.score ?? 0 })); // Usar response?.score
        onComplete?.(true, response?.score ?? 0); // Usar response?.score
      },
      onError: (error) => {
        console.error('Error al completar dato curioso:', error);
        toast.error(t("Error al completar dato curioso."));
        onComplete?.(false);
      },
      onSettled: () => {
        // setIsSubmitting(false); // Esto se maneja en ExerciseModal
      },
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-l-4 border-yellow-500">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-yellow-700 flex items-center">
          <Lightbulb className="h-6 w-6 mr-2" /> {t("Dato Curioso")}
        </CardTitle>
        <CardDescription>{t("Aprende algo interesante sobre la cultura Kamentsá.")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {funFact.fact ? (
          <p className="text-lg text-foreground">{funFact.fact}</p>
        ) : (
          <p className="text-muted-foreground">{t("Dato curioso no disponible.")}</p>
        )}
        {funFact.imageUrl && (
          <div className="mt-4 flex justify-center">
            <img src={funFact.imageUrl} alt={t("Imagen de dato curioso")} className="max-h-64 w-auto object-contain rounded-md shadow-md" />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        {!isSubmitted ? (
          <Button onClick={handleComplete} disabled={isSubmittingHook || !funFact.fact || isSubmitting}>
            {isSubmittingHook ? t("Completando...") : t("Entendido")}
          </Button>
        ) : (
          <div
            className="p-3 rounded-md flex items-center bg-green-100 text-green-700"
            role="status"
            aria-live="polite"
          >
            <CheckCircle2 className="h-5 w-5 mr-2" />
            <p className="font-semibold">{t("¡Dato Curioso Completado!")}</p>
            {awardedPoints > 0 && (
              <p className="font-semibold ml-2">{t("Puntos")}: {awardedPoints}</p>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default LearningFunFact;
