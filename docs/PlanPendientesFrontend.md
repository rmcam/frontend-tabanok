# Plan de Implementación de Pendientes en Frontend - Proyecto Tabanok - Actualizado

Este documento detalla el plan para abordar los módulos y funcionalidades incompletas identificadas en el frontend del proyecto Tabanok, siguiendo las buenas prácticas de desarrollo.

## Objetivos Principales

*   Mejorar la organización y calidad del código en los componentes del frontend.
*   Incrementar la cobertura de pruebas para asegurar la estabilidad de la aplicación.
*   Mejorar la accesibilidad y el diseño responsive para una mejor experiencia de usuario.
*   Completar la internacionalización y explorar la validación lingüística avanzada.
*   Mantener la documentación actualizada.

## Plan de Acción Detallado

1.  **Análisis y Refactorización de Componentes:**
    *   Revisar la estructura y el código de los componentes en `src/components/` para mejorar la organización, modularidad y adherencia a buenas prácticas de React/TypeScript.
    *   Identificar y eliminar redundancias en el código base del frontend.
    *   Prestar especial atención a los componentes del módulo de gamificación para eliminar campos obsoletos restantes, según lo indicado en [`docs/Pendientes.md`](docs/Pendientes.md#L48). (Completado: Se refactorizaron los componentes de gamificación en `src/components/gamification/` para mejorar la modularidad y se revisó el manejo de datos de gamificación en los componentes de actividad. La eliminación de campos obsoletos en `GamificationSummary` requiere confirmación del backend.)

2.  **Mejora de Cobertura de Tests (Frontend):**
    *   Incrementar la cobertura de pruebas unitarias y de integración, priorizando las rutas protegidas (`src/components/common/PrivateRoute.tsx`) y los hooks personalizados (`src/hooks/`). Consultar [`docs/Pendientes.md`](docs/Pendientes.md#L18) para el estado actual. (En progreso: Se revisaron los tests existentes para `PrivateRoute` y los hooks personalizados, y se añadió un archivo de test para `useGamificationData`. La cobertura general requiere ejecución de tests para confirmación.)

3.  **Mejoras de Accesibilidad:**
    *   Continuar trabajando en la mejora de la navegación por teclado y la lectura por lectores de pantalla en los componentes que lo requieran, basándose en el progreso reportado en [`docs/Pendientes.md`](docs/Pendientes.md#L14) y [`docs/Pendientes.md`](docs/Pendientes.md#L16). (En progreso: Se implementó el manejo del foco en los formularios de autenticación (`SigninForm`, `SignupForm`, `ForgotPasswordForm`) para mejorar la navegación por teclado en los modales. Se habilitó la revisión ortográfica nativa del navegador en los campos de texto de los formularios de autenticación (`SigninForm`, `SignupForm`, `ForgotPasswordForm`).)
    *   Planificar y ejecutar las auditorías manuales de accesibilidad restantes según WCAG 2.1 y validar los resultados con herramientas automáticas y manuales, como se menciona en [`docs/Pendientes.md`](docs/Pendientes.md#L12) y [`docs/Pendientes.md`](docs/Pendientes.md#L13).

4.  **Verificación de Diseño Responsive:**
    *   Realizar pruebas exhaustivas del diseño en diversos dispositivos y tamaños de pantalla para asegurar un comportamiento responsive correcto, utilizando herramientas de desarrollo del navegador o pruebas automatizadas, según [`docs/Pendientes.md`](docs/Pendientes.md#L10).

5.  **Validación Lingüística e Internacionalización:**
    *   Investigar y resolver los errores de parsing/formato que impiden completar la internacionalización de mensajes existentes, como se detalla en [`docs/Pendientes.md`](docs/Pendientes.md#L42).
:start_line:32
-------
    *   Explorar opciones para integrar control ortográfico y gramatical en inputs de contenido textual, según [`docs/Pendientes.md`](docs/Pendientes.md#L43). (Completado: Se integró la revisión ortográfica nativa del navegador en los campos de texto de los formularios de autenticación (`SigninForm`, `SignupForm`, `ForgotPasswordForm`).)
    *   Documentar las reglas y filtros personalizados para la validación semántica si se implementan, como se sugiere en [`docs/Pendientes.md`](docs/Pendientes.md#L44).

6.  **Actualización de Documentación:**
    *   Mantener el documento [`docs/Pendientes.md`](docs/Pendientes.md) y otros documentos relevantes (como [`docs/EstadoProyecto.md`](docs/EstadoProyecto.md)) actualizados a medida que se completan las tareas, siguiendo la recomendación en [`docs/Pendientes.md`](docs/Pendientes.md#L72).

Este plan servirá como guía para las próximas tareas de desarrollo en el frontend, asegurando que se aborden las áreas identificadas como incompletas o que requieren mejora.