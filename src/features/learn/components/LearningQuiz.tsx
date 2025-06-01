import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { LearningQuizContent } from '@/types/learning';
import { useProfile } from '@/hooks/auth/auth.hooks'; // Importar useProfile
import { useCreateProgress } from '@/hooks/progress/progress.hooks'; // Importar hooks de progreso

interface LearningQuizProps {
  quiz: LearningQuizContent['content'];
  onComplete?: (isCorrect: boolean) => void;
}

const LearningQuiz: React.FC<LearningQuizProps> = ({ quiz, onComplete }) => {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = React.useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null);

  const { data: userProfile } = useProfile();
  const userId = userProfile?.id;

  const { mutate: createProgress } = useCreateProgress();

  const handleSubmit = () => {
    if (selectedOption === null) {
      alert(t("Por favor, selecciona una opción."));
      return;
    }
    const correct = selectedOption === quiz.correctAnswerId;
    setIsCorrect(correct);
    setIsSubmitted(true);

    if (userId && quiz.exerciseId) {
      // Asumiendo que quiz.exerciseId es el ID del ejercicio al que pertenece este quiz
      // Primero, intentar marcar como completado si ya existe un progreso para este ejercicio
      // Si no existe, se debería crear uno y luego marcarlo como completado.
      // Por simplicidad, aquí se asume que ya existe un "progreso" para el ejercicio
      // o que la API de markProgressAsCompleted puede manejar la creación si no existe.
      // Una implementación más robusta podría requerir una query para obtener el progressId
      // o un endpoint de API que cree/actualice el progreso en un solo paso.

      // Para este ejemplo, asumimos que el exerciseId es suficiente para la API
      // o que el backend puede encontrar/crear el progreso por exerciseId y userId.
      // Si la API requiere un `progressId` específico, necesitaríamos un hook para obtenerlo.
      // Por ahora, se usará el exerciseId como un identificador para la mutación.
      // Nota: La interfaz `useMarkProgressAsCompleted` espera `progressId`.
      // Si `progressId` no es directamente `exerciseId`, se necesitaría una lógica adicional.
      // Por simplicidad, asumiré que `progressId` puede ser el `exerciseId` para este contexto.
      // Si no, se necesitaría un `useQuery` para obtener el `progressId` antes de mutar.

      // Para que funcione con la firma actual de useMarkProgressAsCompleted,
      // necesitamos un progressId. Si el backend lo maneja por exerciseId y userId,
      // entonces la llamada a la mutación debería ser diferente o el hook debería ser más inteligente.
      // Por ahora, voy a simular que el exerciseId es el progressId para la llamada.
      // En un escenario real, se buscaría el progressId existente o se crearía uno.

      // Opción 1: Si la API permite marcar por exerciseId y userId directamente
      // markCompleted({ exerciseId: quiz.exerciseId, userId: userId, data: { answers: { [quiz.question]: selectedOption } } });

      // Opción 2: Si la API requiere un progressId existente (más común)
      // Esto requeriría un paso adicional para obtener o crear el progressId.
      // Por ahora, voy a usar createProgress si no hay un progressId existente,
      // y luego markCompleted. Esto es una simplificación.

      // Lógica simplificada: crear progreso si no existe, luego marcar como completado
      createProgress({
        userId: userId,
        exerciseId: quiz.exerciseId,
        isCompleted: correct, // Marcar como completado si la respuesta es correcta
        score: correct ? 100 : 0, // Asignar puntaje
        answers: { [quiz.question]: selectedOption }
      }, {
        onSuccess: (data) => {
          console.log('Progreso creado/actualizado:', data);
          // Si el quiz es correcto, también se podría llamar a markCompleted si la API lo requiere
          // markCompleted({ progressId: data.id, data: { answers: { [quiz.question]: selectedOption } } });
        },
        onError: (err) => {
          console.error('Error al registrar progreso del quiz:', err);
        }
      });
    }

    onComplete?.(correct);
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
          {quiz.options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem value={option.id} id={`option-${option.id}`} />
              <Label htmlFor={`option-${option.id}`}>{option.text}</Label>
            </div>
          ))}
        </RadioGroup>
        {isSubmitted && isCorrect !== null && (
          <div className={`mt-4 p-3 rounded-md flex items-center ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {isCorrect ? <CheckCircle2 className="mr-2 h-5 w-5" /> : <XCircle className="mr-2 h-5 w-5" />}
            {isCorrect ? t("¡Correcto!") : t("Incorrecto. La respuesta correcta era:") + ` ${quiz.options.find(opt => opt.id === quiz.correctAnswerId)?.text}`}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {!isSubmitted ? (
          <Button onClick={handleSubmit}>{t("Enviar Respuesta")}</Button>
        ) : (
          <Button onClick={handleReset} variant="outline">{t("Reintentar")}</Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default LearningQuiz;
