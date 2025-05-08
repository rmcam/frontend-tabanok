import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { toast } from "sonner"; // Import toast
import { useNavigate } from 'react-router-dom'; // Import useNavigate

interface Blank {
  id: string;
  // The correct answer should ideally not be in the frontend data
}

interface FillInTheBlanksActivityData {
  id: string;
  title: string;
  text: string; // Text with placeholders for blanks
  blanks: Blank[]; // Information about the blanks
}

interface BlankResult {
  blankId: string;
  isCorrect: boolean;
  correctAnswer?: string; // Optional: backend might provide the correct answer
}

interface FillInTheBlanksResultsData {
  score: number; // Assuming a score for the activity
  blankResults?: BlankResult[]; // Optional: feedback per blank
  // Add other relevant results fields
}


const FillInTheBlanksActivity: React.FC<{ activityId: string; onActivityComplete?: () => void }> = ({ activityId, onActivityComplete }) => {
  const [activityData, setActivityData] = useState<FillInTheBlanksActivityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({}); // To store user's answers for each blank
  const [results, setResults] = useState<FillInTheBlanksResultsData | null>(null); // State to store results from backend

  const navigate = useNavigate(); // Get navigate function


  useEffect(() => {
    const fetchActivityData = async () => {
      setLoading(true);
      setError(null);
      setResults(null); // Clear previous results
      try {
        // Assuming backend endpoint for fill-in-the-blanks activity data is /activities/fill-in-the-blanks/:id
        const data: FillInTheBlanksActivityData = await api.get(`/activities/fill-in-the-blanks/${activityId}`);
        setActivityData(data);
        // Initialize user answers state based on the blanks
        const initialAnswers: Record<string, string> = {};
        data.blanks.forEach(blank => {
          initialAnswers[blank.id] = '';
        });
        setUserAnswers(initialAnswers);
      } catch (err: unknown) {
        setError(
          "Error al obtener los datos de la actividad de completar espacios en blanco: " +
            (err instanceof Error ? err.message : String(err))
        );
      } finally {
        setLoading(false);
      }
    };

    fetchActivityData();
  }, [activityId]); // Refetch when activityId changes

  const handleInputChange = (blankId: string, value: string) => {
    setUserAnswers({
      ...userAnswers,
      [blankId]: value,
    });
  };

  const handleSubmit = async () => {
    setLoading(true); // Indicate loading while submitting
    setError(null); // Clear previous errors
    try {
      // Assuming backend endpoint for completing fill-in-the-blanks activity is POST /activities/fill-in-the-blanks/:id/complete
      const finalResults = await api.post(`/activities/fill-in-the-blanks/${activityId}/complete`, { answers: userAnswers });
      console.log("Resultados finales de la actividad de completar espacios en blanco:", finalResults);
      setResults(finalResults); // Store the final results
      // TODO: Handle gamification updates based on final results (e.g., points earned, badges unlocked)
      if (onActivityComplete) {
        onActivityComplete(); // Call the callback to refresh student data
      }
      toast.success("Actividad completada!", { // Display success message
        description: `Puntuación: ${finalResults.score}`, // Assuming score is available in results
      });
      navigate('/dashboard'); // Redirect to dashboard after completion
    } catch (err: unknown) {
      setError(
        "Error al completar la actividad de completar espacios en blanco: " +
        (err instanceof Error ? err.message : String(err))
      );
      console.error("Error completing fill-in-the-blanks activity:", err);
      toast.error("Error al completar la actividad.");
    } finally {
      setLoading(false); // End loading
    }
  };


  if (loading) {
    return <div>Cargando actividad de completar espacios en blanco...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!activityData) {
    return <div>No se encontraron datos para esta actividad de completar espacios en blanco.</div>;
  }

  // Function to render the text with input fields for blanks
  const renderTextWithBlanks = () => {
    let renderedText = activityData.text;
    activityData.blanks.forEach(blank => {
      const input = `<input type="text" value="${userAnswers[blank.id] || ''}" onChange={(e) => handleInputChange('${blank.id}', e.target.value)} />`;
      // Assuming blanks are represented by a specific placeholder in the text, e.g., [BLANK_${blank.id}]
      renderedText = renderedText.replace(`[BLANK_${blank.id}]`, input);
    });
    // Using dangerouslySetInnerHTML for rendering HTML from string. Be cautious with this.
    return <div dangerouslySetInnerHTML={{ __html: renderedText }} />;
  };


  return (
    <div>
      <h3>{activityData.title}</h3>
      {/* Render text with blanks if results are not available */}
      {!results ? (
        <>
          {renderTextWithBlanks()}
          <button onClick={handleSubmit} disabled={loading}>Enviar Respuestas</button>
        </>
      ) : (
        // Render results if available
        <div>
          <h3>Resultados de la Actividad</h3>
          {/* Display detailed results */}
          {results.blankResults && (
            <div>
              <h4>Resultados por Espacio en Blanco:</h4>
              <ul>
                {results.blankResults.map(br => (
                  <li key={br.blankId}>
                    Espacio en blanco {br.blankId}: {br.isCorrect ? 'Correcto' : 'Incorrecto'}
                    {!br.isCorrect && br.correctAnswer && (
                      <span> (Respuesta correcta: {br.correctAnswer})</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* TODO: Display overall score and gamification updates */}
        </div>
      )}
    </div>
  );
};

export default FillInTheBlanksActivity;
