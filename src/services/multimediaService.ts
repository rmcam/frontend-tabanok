import { MultimediaItem } from '@/types/multimediaTypes'; // Asumiendo que existe un tipo MultimediaItem

const API_URL = import.meta.env.VITE_API_URL; // Reemplazar con la URL real de tu backend

// Función para obtener la lista de contenido multimedia
export const getMultimediaItems = async (): Promise<MultimediaItem[]> => {
  try {
    const response = await fetch(`${API_URL}/multimedia`, { // Asumiendo endpoint GET /multimedia
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Incluir cookies para autenticación si es necesario
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = import.meta.env.NODE_ENV === 'production'
        ? 'Error al obtener la lista de contenido multimedia. Por favor, inténtalo de nuevo.'
        : errorData.message || 'Error al obtener la lista de contenido multimedia';
      throw new Error(errorMessage);
    }

    const multimediaItems: MultimediaItem[] = await response.json();
    return multimediaItems;

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al obtener la lista de contenido multimedia';
    console.error('Error fetching multimedia items:', error);
    throw new Error(errorMessage);
  }
};

// Puedes agregar más funciones relacionadas con multimedia aquí (ej. getMultimediaItemById, uploadMultimedia, deleteMultimedia)
