import React from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import type { QuizContent } from "@/types/learning/learning.d";
import { useHeartsStore } from "@/stores/heartsStore"; // Importar el store de vidas
import { useSubmitExerciseProgress } from "@/hooks/progress/progress.hooks"; // Importar useSubmitExerciseProgress

interface LearningQuizProps {
  exerciseId: string;
  quiz: QuizContent;
  onComplete?: (isCorrect: boolean, awardedPoints?: number) => void;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
}

const LearningQuiz: React.FC<LearningQuizProps> = ({
  exerciseId,
  quiz,
  onComplete,
  isSubmitting,
  setIsSubmitting,
}) => {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = React.useState<string | null>(
    null
  );
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null);

  const { decrementHeart } = useHeartsStore(); // Obtener la función para decrementar vidas

  const { mutate: submitExerciseProgressMutation, isPending } = useSubmitExerciseProgress();

  const handleSubmit = () => {
    if (selectedOption === null) {
      alert(t("Por favor, selecciona una opción."));
      return;
    }

    if (!exerciseId) {
      console.error("Exercise ID no disponible.");
      return;
    }

    setIsSubmitting(true); // Indicar que el envío ha comenzado

    submitExerciseProgressMutation(
      {
        exerciseId: exerciseId,
        answers: { userAnswer: selectedOption },
      },
      {
        onSuccess: (response) => {
          const correct = response?.isCorrect; // Acceder directamente a isCorrect
          console.log('Valor de correct en LearningQuiz.tsx:', correct);
          setIsCorrect(correct ?? false);
          setIsSubmitted(true);
          onComplete?.(correct ?? false, response?.score); // Usar response?.score
        },
        onError: (error) => {
          console.error("Error al enviar respuesta del ejercicio:", error);
          setIsCorrect(false); // Asumir incorrecto en caso de error de API
          setIsSubmitted(true);
          decrementHeart(); // Decrementar una vida si la respuesta es incorrecta
          onComplete?.(false);
        },
        onSettled: () => {
          // setIsSubmitting(false); // Esto se maneja en ExerciseModal
        },
      }
    );
  };

  const handleReset = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    setIsCorrect(null);
    setIsSubmitting(false); // Resetear el estado de envío en el padre también
  };

  return (
    <Card className="border-l-4 border-green-500 transition-all duration-300 ease-in-out">
      <CardHeader>
        <CardTitle>{quiz?.question || t("Cargando pregunta...")}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* {JSON.stringify(quiz)} */}{" "}
        {/* Comentado para evitar mostrar el objeto completo */}
        {quiz?.options && quiz.options.length > 0 ? (
          <RadioGroup
            onValueChange={setSelectedOption}
            value={selectedOption || ""}
            disabled={isSubmitted}
          >
            {quiz.options.map((option, index) => (
              <div
                key={index}
                className={`flex items-center space-x-2 p-3 rounded-md cursor-pointer transition-all duration-200 ease-in-out ${
                  selectedOption === option
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => !isSubmitted && setSelectedOption(option)}
              >
                <RadioGroupItem
                  value={option}
                  id={`option-${index}`}
                />
                <Label
                  htmlFor={`option-${index}`}
                  className="cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        ) : (
          <p className="text-muted-foreground">
            {t("Opciones no disponibles.")}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {!isSubmitted ? (
          <Button
            onClick={handleSubmit}
            disabled={isPending || selectedOption === null || isSubmitting}
            className="cursor-pointer transition-all duration-200 ease-in-out hover:scale-105"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("Enviar Respuesta")}
          </Button>
        ) : (
          <Button
            onClick={handleReset}
            variant="outline"
          >
            {t("Reintentar")}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default LearningQuiz;
