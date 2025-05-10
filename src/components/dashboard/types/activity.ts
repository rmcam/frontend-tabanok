export interface BaseActivity {
  id: string;
  title: string;
  description: string;
  type: string; // Añadir campo type para identificar el tipo de actividad
}

// Ejemplo de interfaz para un tipo específico de actividad (Quiz)
export interface QuizActivity extends BaseActivity {
  type: 'quiz'; // Tipo específico para Quiz
  questions: Array<{
    questionText: string;
    options: string[];
    correctAnswer: string;
  }>;
}

// Puedes añadir más interfaces para otros tipos de actividades (Matching, FillInTheBlanks, etc.)

// Usar una unión para representar cualquier tipo de actividad posible
export type Activity = QuizActivity; // | MatchingActivity | FillInTheBlanksActivity, etc.
