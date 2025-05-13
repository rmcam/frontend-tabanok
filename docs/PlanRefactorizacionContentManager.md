# Plan de Refactorización Detallado para ContentManager.tsx

Este documento describe el plan detallado para refactorizar el componente [`src/components/dashboard/components/ContentManager.tsx`](src/components/dashboard/components/ContentManager.tsx) con el objetivo de mejorar su estructura, modularidad, legibilidad y mantenibilidad.

## Áreas de Mejora Identificadas

Basado en el análisis del código actual, las principales áreas a abordar son:
- Lógica de Formulario y Estado
- Lógica de Fetching Inicial
- Manejo de Multimedia
- Validación
- Complejidad del Renderizado
- Comentarios TODO dispersos

## Plan de Acción Detallado

1.  **Refactorizar la lógica de estado y formulario:**
    *   Consolidar los estados individuales (`title`, `description`, `category`, `contentType`, `tags`, `content`) en un solo objeto de estado utilizando `useState` o `useReducer` para una gestión más centralizada.
    *   Ajustar los handlers `onChange` de los inputs para actualizar las propiedades correspondientes en el objeto de estado del formulario.
    *   Modificar la lógica de reinicio del formulario (al abrir/cerrar, al guardar, al cancelar) para resetear el objeto de estado del formulario a sus valores iniciales.
    *   Adaptar la lógica de carga de datos al editar (`useEffect` que depende de `editContent`) para poblar el objeto de estado del formulario.

2.  **Extraer lógica de fetching inicial:**
    *   Crear un hook personalizado (por ejemplo, `useFetchDashboardData` o generalizar `useFetchData`) para manejar la obtención inicial de contenidos y categorías.
    *   Este hook debe manejar los estados de carga (`loading`) y error (`error`) para el fetching inicial.
    *   Integrar este hook en `ContentManager.tsx` para reemplazar el `useEffect` actual que carga los datos.

3.  **Revisar y mejorar la validación:**
    *   Integrar la validación específica del contenido (verificar si el texto no está vacío o si se ha seleccionado un archivo multimedia) dentro de la lógica de validación manejada por `useFormValidation`.
    *   Considerar la posibilidad de usar una librería de validación de esquemas (como Zod o Yup) en conjunto con `useFormValidation` para definir reglas de validación más claras y robustas.
    *   Asegurar que los mensajes de error sean claros y estén correctamente asociados a los campos del formulario.

4.  **Dividir el renderizado complejo:**
    *   Crear subcomponentes para las secciones del formulario que dependen del tipo de contenido (`contentType`). Por ejemplo:
        *   `TextContentInput.tsx`: Componente para el editor de texto enriquecido.
        *   `MultimediaContentInput.tsx`: Componente para la subida de archivos multimedia y la visualización de multimedia asociada.
    *   Esto reducirá la complejidad del JSX en `ContentManager.tsx` y hará que el componente sea más legible y fácil de mantener.

5.  **Abordar los comentarios TODO:**
    *   Revisar todos los comentarios `TODO` en el archivo.
    *   Verificar la estructura exacta de las respuestas de los endpoints de API (`/content`, `/topics`, `/tags`, `/multimedia`).
    *   Definir un tipo más específico para los metadatos de `MultimediaItem`.
    *   Confirmar los payloads y endpoints correctos para las operaciones de creación, actualización y eliminación de contenido y multimedia.

## Próximos Pasos

Una vez que el plan sea aprobado, se procederá a implementar estos pasos de refactorización en el código de [`ContentManager.tsx`](src/components/dashboard/components/ContentManager.tsx).