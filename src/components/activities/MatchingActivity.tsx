import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { toast } from "sonner"; // Import toast
import { useNavigate } from 'react-router-dom'; // Import useNavigate

interface MatchingPair {
  id: string;
  item1: string;
  item2: string;
}

interface MatchingActivityData {
  id: string;
  title: string;
  pairs: MatchingPair[];
}

const MatchingActivity: React.FC<{ activityId: string; onActivityComplete?: () => void }> = ({ activityId, onActivityComplete }) => {
  const [activityData, setActivityData] = useState<MatchingActivityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]); // To store selected item IDs for matching
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]); // To store IDs of successfully matched pairs
  const [results, setResults] = useState<any>(null); // State to store results from backend

  const navigate = useNavigate(); // Get navigate function


  useEffect(() => {
    const fetchActivityData = async () => {
      setLoading(true);
      setError(null);
      setResults(null); // Clear previous results
      try {
        // Assuming backend endpoint for matching activity data is /activities/matching/:id
        const data: MatchingActivityData = await api.get(`/activities/matching/${activityId}`);
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
      const item1Id = selectedItems[0];
      const item2Id = itemId;

      setLoading(true); // Indicate loading while validating
      setError(null); // Clear previous errors

      try {
        // Assuming backend endpoint for validating a pair is POST /activities/matching/:id/validate-pair
        const validationResult = await api.post(`/activities/matching/${activityId}/validate-pair`, { item1Id, item2Id });

        if (validationResult.isCorrect) {
          // Find the pair ID based on the item IDs (assuming item IDs are unique across pairs or backend returns pair ID)
          // For simplicity, let's assume the backend response includes the pair ID if correct
          const matchedPairId = validationResult.pairId; // Assuming backend returns pairId
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
      // Assuming backend endpoint for completing matching activity is POST /activities/matching/:id/complete
      const finalResults = await api.post(`/activities/matching/${activityId}/complete`, { matchedPairs });
      console.log("Resultados finales de la actividad de emparejamiento:", finalResults);
      setResults(finalResults); // Store the final results
      // TODO: Handle gamification updates based on final results (e.g., points earned, badges unlocked)
      if (onActivityComplete) {
        onActivityComplete(); // Call the callback to refresh student data
      }
      toast.success("Actividad de emparejamiento completada!", { // Display success message
        description: `Parejas correctas: ${finalResults.correctMatches} / ${finalResults.totalPairs}`,
      });
      navigate('/dashboard'); // Redirect to dashboard after completion
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
      {/* Add submit button and display results */}
      <button onClick={handleSubmit} disabled={loading || matchedPairs.length !== activityData.pairs.length}>
        Completar Actividad
      </button>
      {results && (
        <div>
          <h3>Resultados de la Actividad</h3>
          {/* Display detailed results */}
          <p>Parejas correctas: {results.correctMatches} / {results.totalPairs}</p>
          {/* TODO: Display more detailed feedback or highlight correct pairs */}
          {/* TODO: Update gamification UI based on results */}
        </div>
      )}
    </div>
  );
};

export default MatchingActivity;
