# Plan de Configuración de Tailwind CSS v4 con PostCSS y Shadcn UI

Este documento detalla los pasos para configurar Tailwind CSS v4 (versión `next`), PostCSS y Shadcn UI en el proyecto `frontend-tabanok` utilizando React y Vite.

**Consideración Importante:** Tailwind CSS v4 se encuentra en una versión experimental (`next`). La compatibilidad con Shadcn UI, que generalmente se basa en versiones estables de Tailwind (v3), puede no ser completa y podría requerir ajustes manuales.

## Pasos del Plan:

1.  **Actualizar Dependencias de Tailwind CSS:**
    *   Desinstalar la versión actual de Tailwind CSS y sus dependencias relacionadas (como `autoprefixer` si no es necesario por separado con v4).
    *   Instalar la versión `next` de Tailwind CSS:
        ```bash
        npm uninstall tailwindcss autoprefixer postcss
        npm install -D tailwindcss@next postcss
        ```
        *(Nota: `autoprefixer` podría no ser necesario con v4, pero lo mantendremos en la instalación inicial de `postcss` por si acaso. Se verificará en el paso 3).*

2.  **Configurar `tailwind.config.js`:**
    *   Revisar el archivo [`tailwind.config.js`](tailwind.config.js) existente.
    *   Tailwind CSS v4 tiene un enfoque diferente para la configuración. Es probable que necesitemos simplificar o ajustar este archivo según la nueva documentación de v4. La configuración básica podría ser similar, pero las opciones específicas podrían cambiar.

3.  **Configurar `postcss.config.cjs`:**
    *   Revisar el archivo [`postcss.config.cjs`](postcss.config.cjs).
    *   La configuración de PostCSS para v4 puede ser más simple. Es probable que solo necesite el plugin de Tailwind CSS.
    *   Verificar si `autoprefixer` sigue siendo necesario o si Tailwind CSS v4 lo incluye internamente.

4.  **Actualizar `src/index.css`:**
    *   Modificar el archivo CSS principal [`src/index.css`](src/index.css).
    *   Reemplazar las directivas `@tailwind base;`, `@tailwind components;`, `@tailwind utilities;` con la nueva sintaxis de v4, que generalmente implica importar directamente desde `tailwindcss`. La nueva sintaxis podría ser algo como:
        ```css
        @import 'tailwindcss';
        ```
        *(Se confirmará la sintaxis exacta con la documentación de v4 durante la implementación).*

5.  **Verificar y Adaptar Shadcn UI:**
    *   Este es el paso más crítico y potencialmente complejo.
    *   Investigar en la documentación de Shadcn UI, repositorios de GitHub o discusiones de la comunidad si hay soporte oficial o guías para usar Shadcn UI con Tailwind CSS v4.
    *   Si no hay soporte oficial, puede que sea necesario:
        *   Ajustar manualmente los estilos o la configuración de los componentes de Shadcn UI para que sean compatibles con v4. Esto podría implicar modificar clases CSS, variables o la estructura de los componentes.
        *   Evaluar si la compatibilidad actual es suficiente para tus necesidades o si los problemas encontrados justifican esperar a una versión de Shadcn UI que soporte oficialmente v4.

6.  **Probar la Configuración:**
    *   Ejecutar la aplicación de desarrollo (`npm run dev` o similar) para verificar que Tailwind CSS esté aplicando los estilos correctamente en toda la aplicación.
    *   Revisar exhaustivamente los componentes de Shadcn UI existentes para asegurarse de que se renderizan y funcionan sin problemas visuales o de funcionalidad relacionados con los cambios en CSS.
    *   Utilizar las herramientas de desarrollo del navegador para inspeccionar los estilos aplicados y depurar cualquier inconsistencia.

## Diagrama del Proceso (Mermaid):

```mermaid
graph TD
    A[Inicio: Revisar Configuración Actual] --> B{Decidir Versión de Tailwind};
    B -- Usar v4 --> C[Actualizar Dependencias a Tailwind v4 (next)];
    C --> D[Configurar tailwind.config.js para v4];
    D --> E[Configurar postcss.config.cjs para v4];
    E --> F[Actualizar src/index.css para v4];
    F --> G{Verificar Compatibilidad con Shadcn UI};
    G -- Compatible --> H[Probar y Confirmar Configuración];
    G -- No Compatible / Requiere Ajustes --> I[Adaptar Componentes de Shadcn UI];
    I --> H;
    H --> J[Fin: Configuración Completa];
    B -- Mantener v3 --> K[Asegurar Configuración Actual Correcta];
    K --> J;
```

Una vez que se haya guardado el plan, podemos proceder a la fase de implementación. Para realizar los cambios en los archivos de código, necesitaremos cambiar al modo "Code".