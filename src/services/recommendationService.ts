import { Recommendation } from "@/types/recommendationTypes";

const API_URL = import.meta.env.VITE_API_URL; // Reemplazar con la URL real de tu backend

// Función para obtener recomendaciones basadas en el ID de la unidad
export const getRecommendationsByUnitId = async (unitId: string): Promise<Recommendation[]> => {
  try {
    const response = await fetch(`${API_URL}/recommendations/unit/${unitId}`, { // Asumiendo endpoint GET /recommendations/unit/:unitId
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Incluir cookies para autenticación si es necesario
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = import.meta.env.NODE_ENV === 'production'
        ? `Error al obtener recomendaciones para la unidad ${unitId}. Por favor, inténtalo de nuevo.`
        : errorData.message || `Error al obtener recomendaciones para la unidad ${unitId}`;
      throw new Error(errorMessage);
    }

    const recommendations: Recommendation[] = await response.json();
    return recommendations;

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : `Error al obtener recomendaciones para la unidad ${unitId}`;
    console.error(`Error fetching recommendations for unit ${unitId}:`, error);
    throw new Error(errorMessage);
  }
};

// Puedes agregar más funciones relacionadas con recomendaciones aquí
