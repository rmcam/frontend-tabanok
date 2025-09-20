import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { LearningQuizContent } from '@/types/learning';
import { useProfile } from '@/hooks/auth/auth.hooks';
import { useSubmitExercise } from '@/hooks/exercises/exercises.hooks'; // Importar useSubmitExercise
import { useHeartsStore } from '@/stores/heartsStore'; // Importar el store de vidas

interface LearningQuizProps {
  quiz: LearningQuizContent['content'];
  onComplete?: (isCorrect: boolean, awardedPoints?: number) => void; // Añadir awardedPoints
}

const LearningQuiz: React.FC<LearningQuizProps> = ({ quiz, onComplete }) => {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = React.useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null);

  const { data: userProfile } = useProfile();
  const userId = userProfile?.id;
  const { decrementHeart } = useHeartsStore(); // Obtener la función para decrementar vidas

  const { mutate: submitExerciseMutation, isPending } = useSubmitExercise();

  const handleSubmit = () => {
    if (selectedOption === null) {
      alert(t("Por favor, selecciona una opción."));
      return;
    }

    if (!userId || !quiz.exerciseId) {
      console.error("User ID o Exercise ID no disponibles.");
      return;
    }

    submitExerciseMutation({
      id: quiz.exerciseId,
      submission: { exerciseId: quiz.exerciseId, userAnswer: selectedOption },
    }, {
      onSuccess: (response) => {
        const correct = response.isCorrect;
        setIsCorrect(correct);
        setIsSubmitted(true);
        onComplete?.(correct, response.awardedPoints);
      },
      onError: (error) => {
        console.error('Error al enviar respuesta del ejercicio:', error);
        setIsCorrect(false); // Asumir incorrecto en caso de error de API
        setIsSubmitted(true);
        decrementHeart(); // Decrementar una vida si la respuesta es incorrecta
        onComplete?.(false);
      }
    });
  };

  const handleReset = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    setIsCorrect(null);
  };

  return (
    <Card className="border-l-4 border-green-500">
      <CardHeader>
        <CardTitle>{quiz.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup onValueChange={setSelectedOption} value={selectedOption || ""} disabled={isSubmitted}>
          {quiz.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
        {isSubmitted && isCorrect !== null && (
          <div className={`mt-4 p-3 rounded-md flex items-center ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {isCorrect ? <CheckCircle2 className="mr-2 h-5 w-5" /> : <XCircle className="mr-2 h-5 w-5" />}
            {isCorrect ? t("¡Correcto!") : t("Incorrecto. La respuesta correcta era:") + ` ${quiz.answer}`}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {!isSubmitted ? (
          <Button onClick={handleSubmit} disabled={isPending}>{t("Enviar Respuesta")}</Button>
        ) : (
          <Button onClick={handleReset} variant="outline">{t("Reintentar")}</Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default LearningQuiz;
