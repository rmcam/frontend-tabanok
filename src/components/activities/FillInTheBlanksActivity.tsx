import React, { useEffect, useState } from 'react';
import { toast } from "sonner"; // Import toast
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import * as activityService from '@/services/activityService'; // Importar el servicio de actividades
import { Activity } from '@/types/activityTypes'; // Importar el tipo Activity
// Definir interfaces específicas para los datos de la actividad de completar espacios en blanco
interface Blank {
  id: string;
  // The correct answer should ideally not be in the frontend data
}

// Extender el tipo Activity para incluir detalles específicos de completar espacios en blanco
interface FillInTheBlanksActivityData extends Activity {
  text: string; // Text with placeholders for blanks
  blanks: Blank[]; // Information about the blanks
  // Asegurarse de que las propiedades de Activity (id, title, description, type) también estén aquí
}

interface BlankResult {
  blankId: string;
  isCorrect: boolean;
  correctAnswer?: string; // Optional: backend might provide the correct answer
}

export interface FillInTheBlanksResultsData { // Exportar la interfaz
  score: number; // Assuming a score for the activity
  blankResults?: BlankResult[]; // Optional: feedback per blank
  pointsEarned?: number; // Added for gamification
  unlockedBadges?: { id: string; name: string }[]; // Added for gamification
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
        // Usar el nuevo servicio activityService para obtener los detalles de la actividad
        const data: FillInTheBlanksActivityData = await activityService.getActivityById(activityId) as FillInTheBlanksActivityData; // Cast to FillInTheBlanksActivityData
        // Verificar si la actividad obtenida es realmente de completar espacios en blanco
        if (data.type !== 'fill-in-the-blanks') {
           throw new Error(`La actividad ${activityId} no es de completar espacios en blanco.`);
        }
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
      // Usar la nueva función submitFillInTheBlanksAnswers del servicio activityService
      const results: FillInTheBlanksResultsData = await activityService.submitFillInTheBlanksAnswers(activityId, userAnswers);
      console.log("Resultados finales de la actividad de completar espacios en blanco:", results);
      setResults(results); // Store the final results
      // TODO: Display overall score and gamification updates - Now displaying in UI
      if (onActivityComplete) {
        onActivityComplete(); // Call the callback to refresh student data
      }
      toast.success("Actividad completada!", { // Display success message
        description: `Puntuación: ${results.score}`, // Assuming score is available in results
      });
      // navigate('/dashboard'); // Decide whether to redirect immediately or let user see results
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
    const parts = activityData.text.split(/\[BLANK_([^\]]+)\]/g); // Dividir el texto por los placeholders
    const elements = [];
    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        // Texto normal
        elements.push(<span key={`text-${i}`}>{parts[i]}</span>);
      } else {
        // Placeholder, renderizar input
        const blankId = parts[i];
        elements.push(
          <input
            key={`input-${blankId}`}
            type="text"
            value={userAnswers[blankId] || ''}
            onChange={(e) => handleInputChange(blankId, e.target.value)}
            className="border-b border-gray-400 mx-1 px-1 focus:outline-none focus:border-blue-500" // Estilos básicos para el input
          />
        );
      }
    }
    return <div>{elements}</div>;
  };


  return (
    <div className="container mx-auto py-8">
      <h3>{activityData.title}</h3>
      {/* Render text with blanks if results are not available */}
      {!results ? (
        <>
          {renderTextWithBlanks()}
          <button onClick={handleSubmit} disabled={loading} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Enviar Respuestas</button>
        </>
      ) : (
        // Render results if available, including gamification updates
        <div>
          <h3>Resultados de la Actividad</h3>
          <p>Puntuación: {results.score}</p>

          {/* Display gamification updates */}
          {results.pointsEarned !== undefined && (
            <p>Puntos ganados: {results.pointsEarned}</p>
          )}
          {results.unlockedBadges && results.unlockedBadges.length > 0 && (
            <div>
              <h4>Insignias desbloqueadas:</h4>
              <ul>
                {results.unlockedBadges.map(badge => (
                  <li key={badge.id}>{badge.name}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Display detailed results */}
          {results.blankResults && (
            <div>
              <h4>Resultados por Espacio en Blanco:</h4>
              <ul>
                {results.blankResults.map(br => (
                  <li key={br.blankId}>
                    Espacio en blanco {br.isCorrect ? 'Correcto' : 'Incorrecto'}
                    {!br.isCorrect && br.correctAnswer && (
                      <span> (Respuesta correcta: {br.correctAnswer})</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
           <button onClick={() => navigate('/dashboard')} className="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Volver al Dashboard</button> {/* Button to return to dashboard */}
        </div>
      )}
    </div>
  );
};

export default FillInTheBlanksActivity;
