import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import type { MatchingContent } from '@/types/learning/learning.d';
import type { SubmitExerciseResponse, MatchingDetails } from '@/types/progress/progress.d'; // Importar SubmitExerciseResponse y MatchingDetails
import { useHeartsStore } from '@/stores/heartsStore';
import { useSubmitExerciseProgress } from '@/hooks/progress/progress.hooks'; // Importar useSubmitExerciseProgress

interface LearningMatchingProps {
  exerciseId: string;
  matching: MatchingContent;
  onComplete?: (isCorrect: boolean, awardedPoints?: number) => void;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
}

const LearningMatching: React.FC<LearningMatchingProps> = ({ exerciseId, matching, onComplete, isSubmitting, setIsSubmitting }) => { // Aceptar exerciseId
  const { t } = useTranslation();
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [userPairs, setUserPairs] = useState<{ term: string; match: string }[]>([]);
  const [availableTerms, setAvailableTerms] = useState(matching.pairs ? matching.pairs.map(p => p.term) : []);
  const [availableMatches, setAvailableMatches] = useState(matching.pairs ? matching.pairs.map(p => p.match).sort(() => Math.random() - 0.5) : []); // Mezclar matches
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [submissionResponse, setSubmissionResponse] = useState<SubmitExerciseResponse | null>(null); // Nuevo estado para la respuesta

  const { decrementHeart } = useHeartsStore();
  const { mutate: submitExerciseProgressMutation, isPending: isSubmittingHook } = useSubmitExerciseProgress();

  const handleTermClick = (term: string) => {
    if (isSubmitted) return;
    setSelectedTerm(term);
    if (selectedMatch) {
      handlePairSelection(term, selectedMatch);
    }
  };

  const handleMatchClick = (match: string) => {
    if (isSubmitted) return;
    setSelectedMatch(match);
    if (selectedTerm) {
      handlePairSelection(selectedTerm, match);
    }
  };

  const handlePairSelection = (term: string, match: string) => {
    setUserPairs(prev => [...prev, { term, match }]);
    setAvailableTerms(prev => prev.filter(t => t !== term));
    setAvailableMatches(prev => prev.filter(m => m !== match));
    setSelectedTerm(null);
    setSelectedMatch(null);
  };

  const handleSubmit = () => {
    if (!matching.pairs || userPairs.length !== matching.pairs.length) {
      toast.error(t("Por favor, empareja todos los elementos antes de enviar."));
      return;
    }

    setIsSubmitting(true); // Indicar que el envío ha comenzado

    const submission = {
      exerciseId: exerciseId,
      answers: { userAnswer: userPairs.map(p => ({ term: p.term, match: p.match })) },
    };

    submitExerciseProgressMutation(submission, {
      onSuccess: (response) => {
        setSubmissionResponse(response); // Guardar la respuesta completa directamente
        const correct = response?.isCorrect; // Acceder directamente a isCorrect
        setIsCorrect(correct ?? false);
        setIsSubmitted(true);
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
    setSelectedTerm(null);
    setSelectedMatch(null);
    setUserPairs([]);
    setAvailableTerms(matching.pairs ? matching.pairs.map(p => p.term) : []);
    setAvailableMatches(matching.pairs ? matching.pairs.map(p => p.match).sort(() => Math.random() - 0.5) : []);
    setIsSubmitted(false);
    setIsCorrect(null);
    setIsSubmitting(false); // Resetear el estado de envío en el padre también
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">{t("Emparejamiento")}</CardTitle>
        <CardDescription>{t("Empareja cada término con su definición o traducción correcta.")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {matching.pairs && matching.pairs.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-2">
              <h3 className="text-lg font-semibold">{t("Términos")}</h3>
              {availableTerms.map((term, index) => (
                <Button
                  key={index}
                  variant={selectedTerm === term ? "default" : "outline"}
                  onClick={() => handleTermClick(term)}
                  disabled={isSubmitted}
                  className="justify-start"
                  aria-label={t("Seleccionar término: {{term}}", { term })}
                >
                  {term}
                </Button>
              ))}
            </div>
            <div className="flex flex-col space-y-2">
              <h3 className="text-lg font-semibold">{t("Coincidencias")}</h3>
              {availableMatches.map((match, index) => (
                <Button
                  key={index}
                  variant={selectedMatch === match ? "default" : "outline"}
                  onClick={() => handleMatchClick(match)}
                  disabled={isSubmitted}
                  className="justify-start"
                  aria-label={t("Seleccionar coincidencia: {{match}}", { match })}
                >
                  {match}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">{t("Pares de emparejamiento no disponibles.")}</p>
        )}

        {userPairs.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">{t("Tus Emparejamientos")}</h3>
            <div className="space-y-2">
              {userPairs.map((pair, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded-md bg-muted" aria-label={t("Emparejamiento: {{term}} con {{match}}", { term: pair.term, match: pair.match })}>
                  <span>{pair.term}</span>
                  <span>{pair.match}</span>
                </div>
              ))}
            </div>
          </div>
        )}

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
            {!isCorrect && submissionResponse?.details && 'correctPairs' in submissionResponse.details && (
              <p className="text-md text-center">
                {t("Los pares correctos eran:")} <span className="font-semibold">{(submissionResponse.details as MatchingDetails).correctPairs.map((p: { term: string; match: string }) => `${p.term} - ${p.match}`).join(', ')}</span>
              </p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleReset} disabled={isSubmittingHook}>
          <RefreshCw className="h-4 w-4 mr-2" /> {t("Reiniciar")}
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmittingHook || isSubmitted || !matching.pairs || userPairs.length !== matching.pairs.length || isSubmitting}>
          {isSubmittingHook ? t("Enviando...") : t("Enviar Respuesta")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LearningMatching;
