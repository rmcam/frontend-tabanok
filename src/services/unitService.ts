import { UnitDetailData } from '@/components/units/UnitDetail'; // Importar UnitDetailData

const API_URL = import.meta.env.VITE_API_URL; // Reemplazar con la URL real de tu backend

// Función para obtener los detalles de una unidad por su ID
export const getUnitById = async (unitId: string): Promise<UnitDetailData> => {
  try {
    const response = await fetch(`${API_URL}/units/${unitId}`, { // Asumiendo endpoint GET /units/:unitId
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Incluir cookies para autenticación si es necesario
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = import.meta.env.NODE_ENV === 'production'
        ? `Error al obtener los detalles de la unidad ${unitId}. Por favor, inténtalo de nuevo.`
        : errorData.message || `Error al obtener los detalles de la unidad ${unitId}`;
      throw new Error(errorMessage);
    }

    const unit: UnitDetailData = await response.json();
    return unit;

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : `Error al obtener los detalles de la unidad ${unitId}`;
    console.error(`Error fetching unit ${unitId}:`, error);
    throw new Error(errorMessage);
  }
};

// Puedes agregar más funciones relacionadas con unidades aquí (ej. getUnits, createUnit, updateUnit, deleteUnit)
