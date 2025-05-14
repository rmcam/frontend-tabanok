# Plan Detallado de Implementación de Pendientes en Frontend - Proyecto Tabanok

Este documento detalla las subtareas específicas y el orden de implementación para abordar los pendientes en el frontend del proyecto Tabanok.

## Tareas Priorizadas

1.  Accesibilidad
2.  Testing
3.  Validación Lingüística
4.  Diseño Responsive
5.  Refactorización y Limpieza

## Subtareas y Orden de Implementación

1.  **Accesibilidad:**
    *   1.1: Revisar los componentes de UI basados en Radix UI para asegurar la correcta navegación por teclado y la lectura por lectores de pantalla.
    *   1.2: Revisar los formularios (`src/components/ui/Form.tsx`, `SigninForm.tsx`, `SignupForm.tsx`, `ForgotPasswordForm.tsx`) para asegurar que tengan etiquetas asociadas a cada campo y mensajes de error accesibles (`aria-invalid`, `aria_describedby`).
    *   1.3: Realizar auditorías manuales de accesibilidad según WCAG 2.1.
    *   1.4: Validar la accesibilidad con herramientas automáticas y manuales después de implementar mejoras.
2.  **Testing:**
    *   2.1: Identificar las áreas del frontend con baja cobertura de tests.
    *   2.2: Escribir pruebas unitarias y de integración para las áreas identificadas.
3.  **Validación Lingüística:**
    *   3.1: Revisar los archivos de traducción (`src/locales/en/translation.json`, `src/locales/es/translation.json`) para asegurar que todos los mensajes estén internacionalizados.
    *   3.2: Integrar control ortográfico y gramatical en inputs de contenido textual.
    *   3.3: Documentar reglas y filtros personalizados para validación semántica.
4.  **Diseño Responsive:**
    *   4.1: Realizar pruebas exhaustivas del diseño en diversos dispositivos y tamaños de pantalla.
5.  **Refactorización y Limpieza:**
    *   5.1: Revisar y eliminar redundancias y campos obsoletos en el código.

## Orden de Implementación

1.  Subtarea 1.1
2.  Subtarea 1.2
3.  Subtarea 2.1
4.  Subtarea 3.1
5.  Subtarea 5.1
6.  Subtarea 1.3
7.  Subtarea 1.4
8.  Subtarea 2.2
9.  Subtarea 3.2
10. Subtarea 3.3
11. Subtarea 4.1