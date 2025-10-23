import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ChevronLeft, CheckCircle2, XCircle } from 'lucide-react'; // Importar CheckCircle2 y XCircle
import { useExerciseById, useSubmitExercise } from '@/hooks/exercises/exercises.hooks'; // Importar useExerciseById y useSubmitExercise
import { useProfile } from '@/hooks/auth/auth.hooks'; // Importar useProfile
import type { LearningQuizContent, LearningMatchingContent, LearningFillInTheBlankContent, LearningAudioPronunciationContent, LearningTranslationContent, LearningFunFactContent } from '@/types/learning'; // Importar todos los tipos de contenido de aprendizaje
import LearningQuiz from '../components/LearningQuiz';
import LearningMatching from '../components/LearningMatching';
import LearningFillInTheBlank from '../components/LearningFillInTheBlank';
import LearningAudioPronunciation from '../components/LearningAudioPronunciation';
import LearningTranslation from '../components/LearningTranslation';
import LearningFunFact from '../components/LearningFunFact';

const ExerciseDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { id: exerciseId } = useParams<{ id: string }>();

  const { data: userProfile } = useProfile();
  const userId = userProfile?.id;

  const { data: exercise, isLoading, error } = useExerciseById(exerciseId || '');
  // Eliminamos submitExerciseMutation y isSubmitting ya que la lógica de envío se maneja en los componentes de ejercicio
  // const { mutate: submitExerciseMutation, isPending: isSubmitting } = useSubmitExercise();

  const [isExerciseSubmitted, setIsExerciseSubmitted] = useState(false);
  const [exerciseIsCorrect, setExerciseIsCorrect] = useState<boolean | null>(null);
  const [awardedPoints, setAwardedPoints] = useState<number>(0);

  const handleExerciseComplete = (isCorrect: boolean, points?: number) => {
    setIsExerciseSubmitted(true);
    setExerciseIsCorrect(isCorrect);
    setAwardedPoints(points || 0);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <p className="text-lg">{t("Cargando ejercicio...")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-red-500 p-4">
        <p className="text-lg">{t("Error al cargar el ejercicio")}: {error.message}</p>
        <Button asChild className="mt-4">
          <Link to="/learn">
            <ChevronLeft className="mr-2 h-4 w-4" /> {t("Volver al Camino de Aprendizaje")}
          </Link>
        </Button>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-muted-foreground p-4">
        <p className="text-xl font-semibold mb-4">{t("Ejercicio no encontrado.")}</p>
        <Button asChild>
          <Link to="/learn">
            <ChevronLeft className="mr-2 h-4 w-4" /> {t("Volver al Camino de Aprendizaje")}
          </Link>
        </Button>
      </div>
    );
  }

  // Asegurarse de que exercise.content no sea nulo antes de pasarlo a los componentes
  if (!exercise.content) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-red-500 p-4">
        <p className="text-lg">{t("Error: Contenido del ejercicio no disponible.")}</p>
        <Button asChild className="mt-4">
          <Link to="/learn">
            <ChevronLeft className="mr-2 h-4 w-4" /> {t("Volver al Camino de Aprendizaje")}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-grow p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link to="/learn">
            <ChevronLeft className="mr-2 h-4 w-4" /> {t("Volver al Camino de Aprendizaje")}
          </Link>
        </Button>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-3 text-primary">
          {exercise.title}
        </h1>
        <div className="prose dark:prose-invert max-w-none">
          <p>{exercise.description}</p>

          {/* Renderizar contenido específico del ejercicio según su tipo */}
          {exercise.type === 'multiple-choice' && (
            <LearningQuiz
              exerciseId={exercise.id} // Pasar exercise.id como prop
              quiz={exercise.content as LearningQuizContent['content']}
              onComplete={handleExerciseComplete}
            />
          )}
          {exercise.type === 'matching' && (
            <LearningMatching
              exerciseId={exercise.id} // Pasar exercise.id como prop
              matching={exercise.content as LearningMatchingContent['content']}
              onComplete={handleExerciseComplete}
            />
          )}
          {exercise.type === 'fill-in-the-blank' && (
            <LearningFillInTheBlank
              exerciseId={exercise.id} // Pasar exercise.id como prop
              fillInTheBlank={exercise.content as LearningFillInTheBlankContent['content']}
              onComplete={handleExerciseComplete}
            />
          )}
          {exercise.type === 'audio-pronunciation' && (
            <LearningAudioPronunciation
              exerciseId={exercise.id} // Pasar exercise.id como prop
              audioPronunciation={exercise.content as LearningAudioPronunciationContent['content']}
              onComplete={handleExerciseComplete}
            />
          )}
          {exercise.type === 'translation' && (
            <LearningTranslation
              exerciseId={exercise.id} // Pasar exercise.id como prop
              translation={exercise.content as LearningTranslationContent['content']}
              onComplete={handleExerciseComplete}
            />
          )}
          {exercise.type === 'fun-fact' && (
            <LearningFunFact
              exerciseId={exercise.id} // Pasar exercise.id como prop
              funFact={exercise.content as LearningFunFactContent['content']}
              onComplete={handleExerciseComplete} // Pasar onComplete
            />
          )}

          {/* Mensaje de resultado general del ejercicio */}
          {isExerciseSubmitted && exerciseIsCorrect !== null && (
            <div
              className={`mt-6 p-4 rounded-md flex items-center justify-center space-x-2 ${exerciseIsCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
              role="status"
              aria-live="polite"
            >
              {exerciseIsCorrect ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
              <p className="text-lg font-semibold">
                {exerciseIsCorrect ? t("¡Ejercicio Completado Correctamente!") : t("Ejercicio Completado Incorrectamente.")}
              </p>
              {awardedPoints > 0 && (
                <p className="text-lg font-semibold ml-4">{t("Puntos Ganados")}: {awardedPoints}</p>
              )}
            </div>
          )}

          {/* Manejar tipos de ejercicio desconocidos */}
          {!['multiple-choice', 'matching', 'fill-in-the-blank', 'audio-pronunciation', 'translation', 'fun-fact'].includes(exercise.type) && (
            <div className="mt-8 p-4 rounded-md bg-yellow-100 text-yellow-800">
              <p className="font-semibold">{t('Tipo de ejercicio desconocido')}: {exercise.type}</p>
              <pre className="mt-2 text-sm bg-yellow-50 p-3 rounded-md overflow-auto">
                {JSON.stringify(exercise.content, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetailPage;
