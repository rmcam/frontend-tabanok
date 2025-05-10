// src/types/activityTypes.ts

export interface Activity {
  id: string;
  title: string;
  description: string;
  type: 'quiz' | 'matching' | 'fill-in-the-blanks'; // Tipos de actividad conocidos
  // Agrega otras propiedades relevantes para una actividad
}

// Puedes agregar otros tipos relacionados con actividades aquí
