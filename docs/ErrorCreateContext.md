# Error: Uncaught TypeError: Cannot read properties of undefined (reading 'createContext')

**Fecha:** 13 de mayo de 2025

**Problema:**
Se encontró un error en la consola del navegador: `Uncaught TypeError: Cannot read properties of undefined (reading 'createContext')`. Este error indicaba que `createContext` no estaba disponible en el contexto donde se intentaba utilizar, a pesar de que el proyecto utiliza una versión compatible de React (v18.2.0). El error apuntaba a un archivo JavaScript generado por Vite (`d3-xnPjQkik.js`).

**Investigación:**
1. Se verificó la versión de React en `package.json`, confirmando que era compatible con `createContext`.
2. Se realizó una búsqueda de `createContext` en los archivos `.ts`, `.tsx` y `.js` dentro del directorio `src`, sin encontrar usos directos. Esto sugirió que el problema podría estar en una librería de terceros o en el proceso de bundling.
3. Se revisó el archivo de configuración de Vite (`vite.config.ts`). Se observó que se utilizaba `@vitejs/plugin-react` y una configuración `manualChunks` para optimizar el tamaño de los bundles, separando dependencias como `react`, `react-dom`, `d3` y `recharts` en chunks separados.

**Causa Probable:**
La causa más probable identificada fue un conflicto relacionado con la configuración `manualChunks` de Vite. Es posible que la división de código estuviera causando que el chunk que necesitaba `createContext` (posiblemente relacionado con `d3` o `recharts`, que a menudo dependen de `d3`) se cargara antes que el chunk que contenía la definición de React (`react-vendor`), resultando en que `React` fuera `undefined` en ese momento.

**Solución:**
Se eliminó temporalmente la configuración `manualChunks` en `vite.config.ts`. Esto permitió a Vite manejar la división de código de forma predeterminada.

**Cambios realizados en `vite.config.ts`:**
Se eliminó el bloque `rollupOptions.output.manualChunks` dentro de la configuración `build`.

```typescript
// Antes del cambio:
build: {
  chunkSizeWarningLimit: 1000,
  rollupOptions: {
    output: {
      manualChunks: (id) => {
        // ... configuración manual de chunks ...
      },
    },
  },
},

// Después del cambio:
build: {
  chunkSizeWarningLimit: 1000,
},
```

**Resultado:**
Tras eliminar la configuración `manualChunks` y reiniciar el servidor de desarrollo, el error `Uncaught TypeError: Cannot read properties of undefined (reading 'createContext')` desapareció, confirmando que el problema estaba relacionado con la forma en que Vite estaba dividiendo los bundles con la configuración manual.

**Próximos Pasos:**
Si en el futuro se requiere optimizar el tamaño de los bundles nuevamente, se deberá revisar y refinar la configuración `manualChunks` para evitar este conflicto, asegurando que las dependencias se carguen en el orden correcto o explorando alternativas de configuración de bundling.