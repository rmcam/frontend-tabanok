# Plan de Mejora de Diseño y Colores - Proyecto Tabanok

**Objetivo:** Integrar elementos visuales y una paleta de colores inspirada en la cultura Kamëntsá para enriquecer la interfaz de usuario de la aplicación Tabanok, creando una experiencia más inmersiva y culturalmente relevante.

**Propuesta de Estilo Visual:**

1.  **Paleta de Colores:** Ampliar la paleta de colores existente en `tailwind.config.js` para incluir tonos más vibrantes y terrosos que reflejen los colores presentes en la artesanía y la naturaleza del Putumayo. Se pueden incorporar colores como verdes profundos, azules celestes, rojos intensos, amarillos cálidos y tonos tierra.
2.  **Tipografía:** Mantener fuentes legibles como Open Sans o Merriweather, pero explorar la posibilidad de usar una fuente complementaria para títulos o elementos decorativos que evoque un sentido cultural sin sacrificar la usabilidad.
3.  **Elementos Gráficos:** Introducir sutiles patrones geométricos o motivos inspirados en los tejidos y tallados Kamëntsá en fondos, bordes de componentes o como iconos. Esto se haría de manera cuidadosa para no sobrecargar la interfaz.
4.  **Componentes:** Adaptar el diseño de componentes clave como tarjetas (`CustomCard.tsx`, `FeatureCard.tsx`), botones (`button.tsx`), modales (`Modal.tsx`, `AuthModals.tsx`) y elementos de navegación para incorporar la nueva paleta de colores y, si aplica, los elementos gráficos propuestos.

**Pasos para la Implementación:**

1.  **Actualizar `tailwind.config.js`:**
    *   Definir la nueva paleta de colores con nombres descriptivos (ej: `kamentsa-verde-oscuro`, `kamentsa-rojo-tierra`).
    *   (Opcional) Añadir nuevas definiciones de fuentes si se decide incorporar una tipografía adicional.
2.  **Definir Variables CSS:** Mapear los nuevos colores de Tailwind a variables CSS personalizadas para facilitar su uso y posible theming futuro.
3.  **Aplicar Colores y Estilos a Componentes:**
    *   Modificar los archivos de componentes React (`.tsx`) para usar las nuevas clases de utilidad de Tailwind o variables CSS.
    *   Comenzar por componentes de diseño general (layouts, contenedores) y luego pasar a componentes más específicos (botones, tarjetas, formularios).
4.  **Integrar Elementos Gráficos (Opcional):**
    *   Crear o obtener archivos SVG de patrones o motivos.
    *   Implementar estos elementos como imágenes de fondo CSS o componentes de icono donde sea apropiado.
5.  **Revisión y Ajuste:** Realizar pruebas visuales en diferentes partes de la aplicación para asegurar la coherencia y la estética del nuevo diseño.

**Diagrama de Flujo del Proceso:**

```mermaid
graph TD
    A[Inicio: Solicitud de Mejora de Diseño] --> B(Investigación Cultura Kamëntsá);
    B --> C{Información Recopilada?};
    C -- Sí --> D(Definir Paleta de Colores y Estilo Visual);
    D --> E(Crear Plan de Implementación);
    E --> F{Plan Aprobado por Usuario?};
    F -- Sí --> G(Actualizar tailwind.config.js);
    G --> H(Aplicar Estilos a Componentes);
    H --> I(Revisión y Ajuste);
    I --> J(Fin: Diseño Mejorado);
    C -- No --> B; %% Podría requerir más investigación si la información inicial es insuficiente
    F -- No --> E; %% Ajustar plan según feedback del usuario