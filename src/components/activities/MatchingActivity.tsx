import React, { useEffect, useState } from 'react';
import { toast } from "sonner"; // Import toast
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import * as activityService from '@/services/activityService'; // Importar el servicio de actividades
import { Activity } from '@/types/activityTypes'; // Importar el tipo Activity

// Definir interfaces específicas para los datos de la actividad de emparejamiento
interface MatchingPair {
  id: string;
  item1: string;
  item2: string;
}

// Extender el tipo Activity para incluir detalles específicos de emparejamiento
interface MatchingActivityData extends Activity {
  pairs: MatchingPair[];
  // Asegurarse de que las propiedades de Activity (id, title, description, type) también estén aquí
}

export interface MatchingActivityResult { // Exportar la interfaz
  correctMatches: number;
  totalPairs: number;
  pointsEarned?: number; // Added for gamification
  unlockedBadges?: { id: string; name: string }[]; // Added for gamification
}

const MatchingActivity: React.FC<{ activityId: string; onActivityComplete?: () => void }> = ({ activityId, onActivityComplete }) => {
  const [activityData, setActivityData] = useState<MatchingActivityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]); // To store selected item IDs for matching
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]); // To store IDs of successfully matched pairs
  const [results, setResults] = useState<MatchingActivityResult | null>(null); // Updated state type

  const navigate = useNavigate(); // Get navigate function


  useEffect(() => {
    const fetchActivityData = async () => {
      setLoading(true);
      setError(null);
      setResults(null); // Clear previous results
      try {
        // Usar el nuevo servicio activityService para obtener los detalles de la actividad
        const data: MatchingActivityData = await activityService.getActivityById(activityId) as MatchingActivityData; // Cast to MatchingActivityData
        // Verificar si la actividad obtenida es realmente de emparejamiento
        if (data.type !== 'matching') {
           throw new Error(`La actividad ${activityId} no es de emparejamiento.`);
        }
        setActivityData(data);
      } catch (err: unknown) {
        setError(
          "Error al obtener los datos de la actividad de emparejamiento: " +
            (err instanceof Error ? err.message : String(err))
        );
      } finally {
        setLoading(false);
      }
    };

    fetchActivityData();
  }, [activityId]); // Refetch when activityId changes

  const handleItemClick = async (itemId: string) => {
    if (selectedItems.length === 1 && selectedItems[0] !== itemId) {
      // Attempt to match the two selected items

      setLoading(true); // Indicate loading while validating
      setError(null); // Clear previous errors

      try {
        // Call the backend service to validate the pair
        const validationResult = await activityService.validateMatchingPair(activityId, selectedItems[0], itemId);

        if (validationResult.isCorrect) {
          const matchedPairId = validationResult.pairId;
          if (matchedPairId && !matchedPairs.includes(matchedPairId)) {
            setMatchedPairs([...matchedPairs, matchedPairId]);
            toast.success("¡Pareja correcta!");
          } else {
             toast.info("Esta pareja ya ha sido encontrada.");
          }
        } else {
          toast.error("Pareja incorrecta. Inténtalo de nuevo.");
        }
      } catch (err: unknown) {
        setError(
          "Error al validar la pareja: " +
            (err instanceof Error ? err.message : String(err))
        );
        console.error("Error validating pair:", err);
        toast.error("Error al validar la pareja.");
      } finally {
        setSelectedItems([]); // Clear selected items after attempt
        setLoading(false); // End loading
      }
    } else if (selectedItems.length === 0) {
      // Select the first item
      setSelectedItems([itemId]);
    } else {
      // Deselect the item if clicked again
      setSelectedItems([]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true); // Indicate loading while submitting
    setError(null); // Clear previous errors
    try {
      // Usar la nueva función submitMatchingAnswers del servicio activityService
      const finalResults: MatchingActivityResult = await activityService.submitMatchingAnswers(activityId, matchedPairs);
      console.log("Resultados finales de la actividad de emparejamiento:", finalResults);
      setResults(finalResults); // Store the final results
      // TODO: Handle gamification updates based on final results (e.g., points earned, badges unlocked) - Now displaying in UI
      if (onActivityComplete) {
        onActivityComplete(); // Call the callback to refresh student data
      }
      toast.success("Actividad de emparejamiento completada!", { // Display success message
        description: `Parejas correctas: ${finalResults.correctMatches} / ${finalResults.totalPairs}`,
      });
      // navigate('/dashboard'); // Decide whether to redirect immediately or let user see results
    } catch (err: unknown) {
      setError(
        "Error al completar la actividad de emparejamiento: " +
        (err instanceof Error ? err.message : String(err))
      );
      console.error("Error completing matching activity:", err);
      toast.error("Error al completar la actividad.");
    } finally {
      setLoading(false); // End loading
    }
  };


  if (loading) {
    return <div>Cargando actividad de emparejamiento...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!activityData) {
    return <div>No se encontraron datos para esta actividad de emparejamiento.</div>;
  }

  return (
    <div>
      <h3>{activityData.title}</h3>
      {/* Render matching pairs */}
      {!results ? (
        <div className="matching-container">
          {activityData.pairs.map(pair => (
            <div key={pair.id} className="matching-pair">
              {/* Render item1 and item2, allow clicking */}
              <div
                className={`matching-item ${selectedItems.includes(pair.item1) ? 'selected' : ''} ${matchedPairs.includes(pair.id) ? 'matched' : ''}`}
                onClick={() => handleItemClick(pair.item1)}
              >
                {pair.item1}
              </div>
              <div
                className={`matching-item ${selectedItems.includes(pair.item2) ? 'selected' : ''} ${matchedPairs.includes(pair.id) ? 'matched' : ''}`}
                onClick={() => handleItemClick(pair.item2)}
              >
                {pair.item2}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Render results if available, including gamification updates
        <div>
          <h3>Resultados de la Actividad</h3>
          {/* Display detailed results */}
          <p>Parejas correctas: {results.correctMatches} / {results.totalPairs}</p>

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

          {/* TODO: Display more detailed feedback or highlight correct pairs */}
           <button onClick={() => navigate('/dashboard')}>Volver al Dashboard</button> {/* Button to return to dashboard */}
        </div>
      )}
      {!results && (
        <button onClick={handleSubmit} disabled={loading || matchedPairs.length !== activityData.pairs.length}>
          Completar Actividad
        </button>
      )}
    </div>
  );
};

export default MatchingActivity;
