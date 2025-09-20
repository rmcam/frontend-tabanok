import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import type { MatchingContentData } from '@/types/learning';
import { useSubmitExercise } from '@/hooks/progress/progress.hooks';
import { useHeartsStore } from '@/stores/heartsStore';

interface LearningMatchingProps {
  matching: MatchingContentData;
  onComplete?: (isCorrect: boolean, awardedPoints?: number) => void;
}

const LearningMatching: React.FC<LearningMatchingProps> = ({ matching, onComplete }) => {
  const { t } = useTranslation();
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [userPairs, setUserPairs] = useState<{ term: string; match: string }[]>([]);
  const [availableTerms, setAvailableTerms] = useState(matching.pairs.map(p => p.term));
  const [availableMatches, setAvailableMatches] = useState(matching.pairs.map(p => p.match).sort(() => Math.random() - 0.5)); // Mezclar matches
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const { decrementHeart } = useHeartsStore();
  const { mutate: submitExerciseMutation, isPending: isSubmitting } = useSubmitExercise();

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
    if (userPairs.length !== matching.pairs.length) {
      toast.error(t("Por favor, empareja todos los elementos antes de enviar."));
      return;
    }

    const submission = {
      exerciseId: matching.exerciseId,
      userAnswer: userPairs.map(p => ({ term: p.term, match: p.match })),
    };

    submitExerciseMutation({
      id: matching.exerciseId,
      submission: submission,
    }, {
      onSuccess: (response) => {
        const correct = response.data.isCorrect;
        setIsCorrect(correct);
        setIsSubmitted(true);
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
    setSelectedTerm(null);
    setSelectedMatch(null);
    setUserPairs([]);
    setAvailableTerms(matching.pairs.map(p => p.term));
    setAvailableMatches(matching.pairs.map(p => p.match).sort(() => Math.random() - 0.5));
    setIsSubmitted(false);
    setIsCorrect(null);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">{t("Emparejamiento")}</CardTitle>
        <CardDescription>{t("Empareja cada término con su definición o traducción correcta.")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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
        <Button onClick={handleSubmit} disabled={isSubmitting || isSubmitted || userPairs.length !== matching.pairs.length}>
          {isSubmitting ? t("Enviando...") : t("Enviar Respuesta")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LearningMatching;
