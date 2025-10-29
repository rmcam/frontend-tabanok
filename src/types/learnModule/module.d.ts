/**
 * @interface LearnModule
 * @description Interfaz para la vista de /learn/module/:id
 */
export interface LearnModule {
  id: string;
  name: string;
  description: string;
  unities: LearnUnity[];
}

/**
 * @interface Unities
 * @description Interfaz para la vista de /learn/module/:id
 */

export interface LearnUnity {
  id: string;
  title: string;
  description: string;
  order: number;
  isLocked: boolean;
  requiredPoints: number;
  isActive: boolean;
  lessons: any[];
  icon: any;
}
