import { Activity } from '@/types/activityTypes'; // Importar desde la nueva ubicación
import { QuizResult } from '@/components/activities/QuizActivity'; // Importar tipo QuizResult
import { MatchingActivityResult } from '@/components/activities/MatchingActivity'; // Importar tipo MatchingActivityResult
import { FillInTheBlanksResultsData } from '@/components/activities/FillInTheBlanksActivity'; // Importar tipo FillInTheBlanksResultsData


const API_URL = import.meta.env.VITE_API_URL; // Reemplazar con la URL real de tu backend

// Función para obtener la lista de actividades
export const getActivities = async (): Promise<Activity[]> => {
  try {
    const response = await fetch(`${API_URL}/activities`, { // Asumiendo endpoint GET /activities
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Incluir cookies para autenticación si es necesario
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = import.meta.env.NODE_ENV === 'production'
        ? 'Error al obtener la lista de actividades. Por favor, inténtalo de nuevo.'
        : errorData.message || 'Error al obtener la lista de actividades';
      throw new Error(errorMessage);
    }

    const activities: Activity[] = await response.json();
    return activities;

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al obtener la lista de actividades';
    console.error('Error fetching activities:', error);
    throw new Error(errorMessage);
  }
};

// Función para obtener los detalles de una actividad por su ID
export const getActivityById = async (activityId: string): Promise<Activity> => {
  try {
    const response = await fetch(`${API_URL}/activities/${activityId}`, { // Asumiendo endpoint GET /activities/:id
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Incluir cookies para autenticación si es necesario
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = import.meta.env.NODE_ENV === 'production'
        ? `Error al obtener los detalles de la actividad ${activityId}. Por favor, inténtalo de nuevo.`
        : errorData.message || `Error al obtener los detalles de la actividad ${activityId}`;
      throw new Error(errorMessage);
    }

    const activity: Activity = await response.json();
    return activity;

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : `Error al obtener los detalles de la actividad ${activityId}`;
    console.error(`Error fetching activity ${activityId}:`, error);
    throw new Error(errorMessage);
  }
};

// Función para enviar las respuestas de un quiz
export const submitQuizAnswers = async (activityId: string, answers: Record<string, string>): Promise<QuizResult> => { // Usar tipo QuizResult
  try {
    const response = await fetch(`${API_URL}/activities/quiz/${activityId}/submit`, { // Asumiendo endpoint POST /activities/quiz/:id/submit
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers }),
      credentials: 'include', // Incluir cookies para autenticación si es necesario
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = import.meta.env.NODE_ENV === 'production'
        ? `Error al enviar las respuestas del quiz ${activityId}. Por favor, inténtalo de nuevo.`
        : errorData.message || `Error al enviar las respuestas del quiz ${activityId}`;
      throw new Error(errorMessage);
    }

    const results = await response.json(); // TODO: Definir tipo de retorno más específico
    return results;

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : `Error al enviar las respuestas del quiz ${activityId}`;
    console.error(`Error submitting quiz answers for ${activityId}:`, error);
    throw new Error(errorMessage);
  }
};

// Función para validar una pareja en una actividad de emparejamiento
export const validateMatchingPair = async (activityId: string, item1Id: string, item2Id: string): Promise<{ isCorrect: boolean; pairId?: string }> => {
  try {
    const response = await fetch(`${API_URL}/activities/matching/${activityId}/validate-pair`, { // Asumiendo endpoint POST /activities/matching/:id/validate-pair
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ item1Id, item2Id }),
      credentials: 'include', // Incluir cookies para autenticación si es necesario
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = import.meta.env.NODE_ENV === 'production'
        ? `Error al validar la pareja para la actividad de emparejamiento ${activityId}. Por favor, inténtalo de nuevo.`
        : errorData.message || `Error al validar la pareja para la actividad de emparejamiento ${activityId}`;
      throw new Error(errorMessage);
    }

    const results: { isCorrect: boolean; pairId?: string } = await response.json();
    return results;

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : `Error al validar la pareja para la actividad de emparejamiento ${activityId}`;
    console.error(`Error validating matching pair for ${activityId}:`, error);
    throw new Error(errorMessage);
  }
};


// Función para enviar las respuestas de una actividad de emparejamiento
export const submitMatchingAnswers = async (activityId: string, matchedPairs: string[]): Promise<MatchingActivityResult> => { // Usar tipo MatchingActivityResult
  try {
    const response = await fetch(`${API_URL}/activities/matching/${activityId}/complete`, { // Asumiendo endpoint POST /activities/matching/:id/complete
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ matchedPairs }),
      credentials: 'include', // Incluir cookies para autenticación si es necesario
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = import.meta.env.NODE_ENV === 'production'
        ? `Error al completar la actividad de emparejamiento ${activityId}. Por favor, inténtalo de nuevo.`
        : errorData.message || `Error al completar la actividad de emparejamiento ${activityId}`;
      throw new Error(errorMessage);
    }

    const results = await response.json(); // TODO: Definir tipo de retorno más específico
    return results;

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : `Error al completar la actividad de emparejamiento ${activityId}`;
    console.error(`Error completing matching activity ${activityId}:`, error);
    throw new Error(errorMessage);
  }
};

// Función para enviar las respuestas de una actividad de completar espacios en blanco
export const submitFillInTheBlanksAnswers = async (activityId: string, answers: Record<string, string>): Promise<FillInTheBlanksResultsData> => { // Usar tipo FillInTheBlanksResultsData
  try {
    const response = await fetch(`${API_URL}/activities/fill-in-the-blanks/${activityId}/complete`, { // Asumiendo endpoint POST /activities/fill-in-the-blanks/:id/complete
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers }),
      credentials: 'include', // Incluir cookies para autenticación si es necesario
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = import.meta.env.NODE_ENV === 'production'
        ? `Error al completar la actividad de completar espacios en blanco ${activityId}. Por favor, inténtalo de nuevo.`
        : errorData.message || `Error al completar la actividad de completar espacios en blanco ${activityId}`;
      throw new Error(errorMessage);
    }

    const results = await response.json(); // TODO: Definir tipo de retorno más específico
    return results;

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : `Error al completar la actividad de completar espacios en blanco ${activityId}`;
    console.error(`Error completing fill-in-the-blanks activity ${activityId}:`, error);
    throw new Error(errorMessage);
  }
};


// Puedes agregar más funciones relacionadas con actividades aquí (ej. createActivity, updateActivity, deleteActivity)
