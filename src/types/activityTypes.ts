// src/types/activityTypes.ts

export interface Activity {
  id: string;
  title: string;
  description: string;
  type: 'quiz' | 'matching' | 'fill-in-the-blanks'; // Tipos de actividad conocidos
  // Agrega otras propiedades relevantes para una actividad
}

export interface Category {
  id: string;
  name: string;
}


export type ContentType = 'text' | 'image' | 'video' | 'audio';

// Puedes agregar otros tipos relacionados con actividades aquí
