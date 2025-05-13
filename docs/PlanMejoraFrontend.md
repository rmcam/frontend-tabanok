# Plan de Mejora del Frontend - Proyecto Tabanok

Este documento detalla el plan acordado para abordar las funcionalidades incompletas y mejorar la calidad del código en el frontend del proyecto Tabanok, basándose en el análisis de los documentos de pendientes y las mejores prácticas de desarrollo.

## Áreas Clave a Abordar

El plan se centra en las siguientes áreas identificadas como prioritarias:

1.  **Análisis Detallado de Pendientes:**
    *   Revisar a fondo las secciones "Pendientes Clave" y "Próximos pasos recomendados" en [`docs/Pendientes.md`](docs/Pendientes.md:1) para comprender el alcance exacto de cada tarea pendiente en el frontend.
    *   Priorizar las tareas basándome en la urgencia y el impacto en la calidad y funcionalidad del proyecto.

2.  **Mejoras de Accesibilidad:**
    *   Completar las auditorías manuales de accesibilidad restantes según WCAG 2.1.
    *   Realizar pruebas de validación con herramientas automáticas y manuales después de implementar cualquier mejora.
    *   Evaluar y mejorar la navegación por teclado en componentes interactivos si es necesario, más allá de la base proporcionada por Radix UI.
    *   Revisar y mejorar la lectura por lectores de pantalla, asegurando el uso adecuado de roles ARIA, etiquetas y descripciones para elementos complejos o dinámicos.

3.  **Incremento de Cobertura de Tests (Frontend):**
    *   Identificar las rutas protegidas y hooks personalizados que aún no tienen una cobertura de tests adecuada.
    *   Escribir tests unitarios y de integración utilizando librerías como Jest y React Testing Library para asegurar la fiabilidad de estos componentes y lógicas.
    *   Enfocarse en casos de borde y escenarios de error para garantizar la robustez.

4.  **Implementación de Validación Lingüística Avanzada:**
    *   Investigar e integrar una librería o servicio para control ortográfico y gramatical en los campos de entrada de texto donde los usuarios generan contenido.
    *   Documentar las reglas y filtros personalizados que se implementen para la validación semántica del contenido.
    *   Desarrollar o adaptar funcionalidades para validar la calidad lingüística del contenido generado por los usuarios.

5.  **Refactorización y Optimización del Código:**
    *   Realizar una revisión exhaustiva del módulo de gamificación en busca de redundancias o código obsoleto, y aplicar las correcciones necesarias.
    *   Continuar con la refactorización de los componentes en el directorio [`src/components`](src/components/) para mejorar la organización, modularidad y adherencia a patrones de diseño recomendados en React y TypeScript.
    *   Aplicar principios SOLID y patrones de diseño relevantes para mejorar la mantenibilidad y escalabilidad del código.

6.  **Verificación y Mejora del Diseño Responsive:**
    *   Realizar pruebas exhaustivas en diferentes dispositivos y tamaños de pantalla (escritorio, tablet, móvil) utilizando herramientas de desarrollo del navegador.
    *   Identificar y corregir cualquier problema de layout, usabilidad o rendimiento en diferentes viewports.
    *   Considerar la implementación de pruebas de interfaz de usuario automatizadas con control de viewport si es viable.

Este plan servirá como guía para las próximas tareas de desarrollo en el frontend, asegurando un enfoque estructurado y basado en las necesidades identificadas del proyecto.