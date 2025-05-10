import React, { useEffect, useState } from 'react';
import { toast } from "sonner"; // Import toast
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import * as activityService from '@/services/activityService'; // Importar el servicio de actividades
import { Activity } from '@/types/activityTypes'; // Importar el tipo Activity

// Definir interfaces específicas para los datos del quiz si son diferentes del tipo Activity general
interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  // The correct answer should ideally not be in the frontend data
}

// Extender el tipo Activity si es necesario para incluir detalles específicos del quiz
interface QuizData extends Activity {
  questions: QuizQuestion[];
  // Asegurarse de que las propiedades de Activity (id, title, description, type) también estén aquí
}


export interface QuizResult { // Exportar la interfaz
  score: number;
  feedback?: string;
  questionResults?: { questionId: string; isCorrect: boolean; correctAnswer?: string }[];
  pointsEarned?: number; // Added for gamification
  unlockedBadges?: { id: string; name: string }[]; // Added for gamification
}

const QuizActivity: React.FC<{ activityId: string; onActivityComplete?: () => void }> = ({ activityId, onActivityComplete }) => {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({}); // To store user's selected answers
  const [quizResults, setQuizResults] = useState<QuizResult | null>(null); // Updated state type

  const navigate = useNavigate(); // Get navigate function


  useEffect(() => {
    const fetchQuizData = async () => {
      setLoading(true);
      setError(null);
      setQuizResults(null); // Clear previous results when fetching new quiz data
      try {
        // Usar el nuevo servicio activityService para obtener los detalles de la actividad
        const data: QuizData = await activityService.getActivityById(activityId) as QuizData; // Cast to QuizData
        // Verificar si la actividad obtenida es realmente un quiz
        if (data.type !== 'quiz') {
           throw new Error(`La actividad ${activityId} no es un quiz.`);
        }
        setQuizData(data);
      } catch (err: unknown) {
        setError(
          "Error al obtener los datos del quiz: " +
            (err instanceof Error ? err.message : String(err))
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [activityId]); // Refetch when activityId changes

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answer,
    });
  };

  const handleSubmitQuiz = async () => {
    setLoading(true); // Indicate loading while submitting
    setError(null); // Clear previous errors
    try {
      // Usar la nueva función submitQuizAnswers del servicio activityService
      const results: QuizResult = await activityService.submitQuizAnswers(activityId, selectedAnswers);
      console.log("Resultados del quiz:", results);
      setQuizResults(results); // Store the results
      // TODO: Handle gamification updates based on results (e.g., points earned, badges unlocked) - Now displaying in UI
      if (onActivityComplete) {
        onActivityComplete(); // Call the callback to refresh student data
      }
      toast.success("Quiz completado!", { // Display success message with score
        description: `Tu puntuación: ${results.score}`,
      });
      // navigate('/dashboard'); // Decide whether to redirect immediately or let user see results
    } catch (err: unknown) {
      setError(
        "Error al enviar las respuestas del quiz: " +
          (err instanceof Error ? err.message : String(err))
      );
      console.error("Error submitting quiz:", err);
    } finally {
      setLoading(false); // End loading
    }
  };

  if (loading) {
    return <div>Cargando quiz...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!quizData) {
    return <div>No se encontraron datos para este quiz.</div>;
  }

  return (
    <div>
      <h3>{quizData.title}</h3>
      {/* Render quiz questions if results are not available */}
      {!quizResults ? (
        <>
          {quizData.questions.map(question => (
            <div key={question.id}>
              <p>{question.text}</p>
              <ul>
                {question.options.map(option => (
                  <li key={option}>
                    <label>
                      <input
                        type="radio"
                        name={question.id}
                        value={option}
                        checked={selectedAnswers[question.id] === option}
                        onChange={() => handleAnswerSelect(question.id, option)}
                      />
                      {option}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <button onClick={handleSubmitQuiz} disabled={loading}>Enviar Respuestas</button>
        </>
      ) : (
        // Render quiz results if available, including gamification updates
        <div>
          <h3>Resultados del Quiz</h3>
          <p>Tu puntuación: {quizResults.score}</p>

          {/* Display gamification updates */}
          {quizResults.pointsEarned !== undefined && (
            <p>Puntos ganados: {quizResults.pointsEarned}</p>
          )}
          {quizResults.unlockedBadges && quizResults.unlockedBadges.length > 0 && (
            <div>
              <h4>Insignias desbloqueadas:</h4>
              <ul>
                {quizResults.unlockedBadges.map(badge => (
                  <li key={badge.id}>{badge.name}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Display general feedback if provided */}
          {quizResults.feedback && (
            <div>
              <h4>Feedback General:</h4>
              <p>{quizResults.feedback}</p>
            </div>
          )}
          {/* Display feedback on individual questions if provided */}
          {quizResults.questionResults && (
            <div>
              <h4>Resultados por Pregunta:</h4>
              <ul>
                {quizResults.questionResults.map(qr => (
                  <li key={qr.questionId}>
                    Pregunta {qr.questionId}: {qr.isCorrect ? 'Correcta' : 'Incorrecta'}
                    {!qr.isCorrect && qr.correctAnswer && (
                      <span> (Respuesta correcta: {qr.correctAnswer})</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
           <button onClick={() => navigate('/dashboard')}>Volver al Dashboard</button> {/* Button to return to dashboard */}
        </div>
      )}
    </div>
  );
};

export default QuizActivity;
