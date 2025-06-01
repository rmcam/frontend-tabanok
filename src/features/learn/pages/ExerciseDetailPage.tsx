import React, { useState } from 'react'; // Importar useState
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useActivityById, useSubmitExerciseAnswers } from '@/hooks/activities/activities.hooks'; // Importar el hook de actividades y el nuevo hook de mutación

const ExerciseDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { id: exerciseId } = useParams<{ id: string }>(); // El ID del ejercicio

  const { data: exercise, isLoading, error } = useActivityById(exerciseId || '');
  const { mutate: submitAnswers, isPending: isSubmitting, isSuccess, isError, data: submissionResult } = useSubmitExerciseAnswers(); // Usar el hook de mutación y capturar el resultado

  // Estado para almacenar las respuestas del usuario para el quiz
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  // Estado para controlar si el quiz ha sido enviado
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Manejar el cambio en las respuestas del quiz
  const handleQuizAnswerChange = (questionIndex: number, selectedOptionValue: string) => {
    // Solo permitir cambios si el quiz no ha sido enviado
    if (!quizSubmitted) {
      setQuizAnswers(prevAnswers => ({
        ...prevAnswers,
        [questionIndex]: selectedOptionValue,
      }));
    }
  };

  // Lógica para enviar las respuestas del quiz
  const handleSubmitQuiz = () => {
    if (!exerciseId) {
      console.error("No exercise ID available for submission.");
      return;
    }
    // Marcar el quiz como enviado
    setQuizSubmitted(true);
    // Llama a la función mutate del hook useSubmitExerciseAnswers
    submitAnswers({ id: exerciseId, answers: quizAnswers });
  };

  // Determinar si una opción es correcta (basado en el resultado de la sumisión)
  const isOptionCorrect = (questionIndex: number, optionValue: string): boolean | undefined => {
    if (!quizSubmitted || !submissionResult || !submissionResult.correctAnswers) {
      return undefined; // No hay resultado de sumisión o información de respuestas correctas
    }
    // Asumiendo que submissionResult.correctAnswers es un objeto { questionIndex: correctAnswerValue }
    return submissionResult.correctAnswers[questionIndex] === optionValue;
  };

  // Determinar si la respuesta del usuario para una pregunta es correcta
  const isUserAnswerCorrect = (questionIndex: number): boolean | undefined => {
    if (!quizSubmitted || !submissionResult || !submissionResult.correctAnswers) {
      return undefined;
    }
    const userAnswer = quizAnswers[questionIndex];
    const correctAnswer = submissionResult.correctAnswers[questionIndex];
    return userAnswer === correctAnswer;
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
          <p>{exercise.description}</p> {/* Mostrar la descripción del ejercicio */}
          {/* Renderizar contenido específico del ejercicio según su tipo */}
          {exercise.type === 'quiz' && (
            <div className="space-y-6"> {/* Mayor espacio entre preguntas */}
              {/* Lógica para renderizar un quiz */}
              {/* Se asume que exercise.content es un objeto con una propiedad 'questions' que es un array */}
              {/* Cada pregunta tiene 'text' y 'options' (un array de objetos con 'text' y 'value') */}
              {exercise.content && typeof exercise.content === 'object' && 'questions' in exercise.content && Array.isArray(exercise.content.questions) ? (
                exercise.content.questions.map((question: any, qIndex: number) => {
                  const userAnswer = quizAnswers[qIndex];
                  const isAnswerCorrect = isUserAnswerCorrect(qIndex);

                  return (
                    <div key={qIndex} className={`border rounded-md p-4 shadow-sm ${quizSubmitted ? (isAnswerCorrect ? 'border-green-500' : 'border-red-500') : ''}`}> {/* Añadir sombra y borde de feedback */}
                      <p className="font-semibold mb-3 text-lg">{`${qIndex + 1}. ${question.text}`}</p> {/* Numerar preguntas */}
                      {question.options && Array.isArray(question.options) ? (
                        <div className="space-y-2">
                          {question.options.map((option: any, oIndex: number) => {
                            const optionCorrect = isOptionCorrect(qIndex, option.value);
                            const isSelected = userAnswer === option.value;

                            let optionClass = '';
                            if (quizSubmitted) {
                              if (optionCorrect) {
                                optionClass = 'text-green-600 font-semibold'; // Opción correcta
                              } else if (isSelected) {
                                optionClass = 'text-red-600 line-through'; // Opción incorrecta seleccionada
                              }
                            }

                            return (
                              <div key={oIndex} className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  id={`q${qIndex}-o${oIndex}`}
                                  name={`question-${qIndex}`}
                                  value={option.value}
                                  checked={isSelected}
                                  onChange={() => handleQuizAnswerChange(qIndex, option.value)}
                                  className="form-radio text-primary disabled:opacity-50" // Estilo básico para radio button
                                  disabled={quizSubmitted || isSubmitting} // Deshabilitar después de enviar
                                />
                                <label htmlFor={`q${qIndex}-o${oIndex}`} className={`text-base cursor-pointer ${optionClass}`}>
                                  {option.text}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-red-500">Error: Opciones de pregunta no encontradas o inválidas.</p>
                      )}
                      {quizSubmitted && isAnswerCorrect !== undefined && (
                        <p className={`mt-2 text-sm font-semibold ${isAnswerCorrect ? 'text-green-600' : 'text-red-600'}`}>
                          {isAnswerCorrect ? t('¡Correcto!') : t('Incorrecto.')}
                          {/* Opcional: Mostrar la respuesta correcta si es incorrecto */}
                          {!isAnswerCorrect && submissionResult?.correctAnswers?.[qIndex] && (
                            <span> {t('La respuesta correcta era')}: {submissionResult.correctAnswers[qIndex]}</span>
                          )}
                        </p>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-red-500">Error: Contenido del quiz no encontrado o inválido.</p>
              )}
              {/* Botón para enviar respuestas del quiz */}
              {!quizSubmitted && (
                <Button onClick={handleSubmitQuiz} className="mt-4" disabled={isSubmitting || Object.keys(quizAnswers).length !== (exercise.content?.questions?.length || 0)}> {/* Deshabilitar si no todas las preguntas tienen respuesta */}
                  {isSubmitting ? t('Enviando...') : t('Enviar Respuestas')} {/* Cambiar texto durante el envío y traducir */}
                </Button>
              )}

              {/* Mostrar estado general de la sumisión */}
              {quizSubmitted && isSuccess && (
                <div className="mt-4 p-4 rounded-md bg-green-100 text-green-800">
                  <p className="font-semibold">{t('Sumisión completada.')}</p>
                  {/* Opcional: Mostrar puntaje u otro feedback general */}
                  {submissionResult?.isCorrect && <p>{t('¡Felicidades, has completado el ejercicio correctamente!')}</p>}
                  {!submissionResult?.isCorrect && <p>{t('Por favor, revisa tus respuestas marcadas en rojo.')}</p>}
                </div>
              )}
              {quizSubmitted && isError && (
                <div className="mt-4 p-4 rounded-md bg-red-100 text-red-800">
                  <p className="font-semibold">{t('Error al enviar respuestas.')}</p>
                  <p>{t('Por favor, inténtalo de nuevo.')}</p>
                </div>
              )}
            </div>
          )}
          {/* Añadir más tipos de ejercicio según sea necesario */}
          {exercise.type === 'mission' && (
            <div>
              {/* Lógica para renderizar una misión */}
              <p>{t('Renderizar Misión aquí')}</p> {/* Traducir */}
              {/* TODO: Implementar renderización para ejercicios de tipo 'mission' */}
              {/* Se necesitará conocer la estructura de exercise.content para este tipo */}
            </div>
          )}
          {/* Manejar tipos de ejercicio desconocidos */}
          {!['quiz', 'mission'].includes(exercise.type) && (
            <div>
              <p>{t('Tipo de ejercicio desconocido')}: {exercise.type}</p> {/* Traducir */}
              <pre>{JSON.stringify(exercise.content, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetailPage;
