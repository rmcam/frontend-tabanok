import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { toast } from "sonner"; // Import toast
import { useNavigate } from 'react-router-dom'; // Import useNavigate

interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  // The correct answer should ideally not be in the frontend data
}

interface QuizData {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

const QuizActivity: React.FC<{ activityId: string; onActivityComplete?: () => void }> = ({ activityId, onActivityComplete }) => {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({}); // To store user's selected answers
  const [quizResults, setQuizResults] = useState<any>(null); // State to store quiz results from backend (using 'any' for flexibility for now)

  const navigate = useNavigate(); // Get navigate function


  useEffect(() => {
    const fetchQuizData = async () => {
      setLoading(true);
      setError(null);
      setQuizResults(null); // Clear previous results when fetching new quiz data
      try {
        // Assuming backend endpoint for quiz data is /activities/quiz/:id
        const data: QuizData = await api.get(`/activities/quiz/${activityId}`);
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
      // Assuming backend endpoint for submitting quiz answers is POST /activities/quiz/:id/submit
      const results = await api.post(`/activities/quiz/${activityId}/submit`, { answers: selectedAnswers });
      console.log("Resultados del quiz:", results);
      setQuizResults(results); // Store the results
      // TODO: Handle gamification updates based on results (e.g., points earned, badges unlocked)
      if (onActivityComplete) {
        onActivityComplete(); // Call the callback to refresh student data
      }
      toast.success("Quiz completado!", { // Display success message with score
        description: `Tu puntuación: ${results.score}`,
      });
      navigate('/dashboard'); // Redirect to dashboard after completion
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
        // Render quiz results if available
        <div>
          <h3>Resultados del Quiz</h3>
          <p>Tu puntuación: {quizResults.score}</p>
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
        </div>
      )}
    </div>
  );
};

export default QuizActivity;
