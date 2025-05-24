import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combina y resuelve clases de CSS de forma condicional,
 * fusionando clases de Tailwind duplicadas o conflictivas.
 * Utiliza `clsx` para manejar condicionales y arrays,
 * y `tailwind-merge` para la fusión de clases de Tailwind.
 *
 * @param inputs - Una lista de valores de clase (strings, arrays, objetos, booleanos, null, undefined).
 * @returns Una cadena de texto con las clases de CSS combinadas y resueltas.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
