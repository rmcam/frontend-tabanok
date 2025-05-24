import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import jaxA11y from 'eslint-plugin-jsx-a11y'
import pluginImport from 'eslint-plugin-import'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      jaxA11y.configs.recommended, // Añadir reglas de accesibilidad
      pluginImport.configs.recommended, // Añadir reglas de importación
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json', // Necesario para algunas reglas de importación y tipado
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jaxA11y, // Añadir plugin de accesibilidad
      import: pluginImport, // Añadir plugin de importación
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // Reglas adicionales para mejorar la calidad del código
      '@typescript-eslint/no-explicit-any': 'warn', // Advertir sobre el uso de 'any'
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Advertir sobre variables no usadas
      'import/order': [ // Ordenar importaciones
        'warn',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@/**',
              group: 'internal',
            },
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-unresolved': 'off', // Desactivar si TypeScript ya lo maneja
      'import/named': 'off', // Desactivar si TypeScript ya lo maneja
      'import/namespace': 'off', // Desactivar si TypeScript ya lo maneja
      'import/default': 'off', // Desactivar si TypeScript ya lo maneja
      'import/export': 'off', // Desactivar si TypeScript ya lo maneja
    },
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
      react: {
        version: 'detect', // Detecta automáticamente la versión de React
      },
    },
  },
)
