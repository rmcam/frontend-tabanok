# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
});

## Authentication Module

A basic authentication module has been created in the `src/auth` directory. It includes:

*   Form components for sign-in and sign-up, styled with Shadcn UI, implemented as modals.
*   The "Forgot Password" functionality is now implemented as a modal that opens from the sign-in modal.
*   A "Regresar" button has been added to the "Forgot Password" modal, which redirects the user back to the sign-in modal.
*   Services for interacting with a backend API (placeholders).
*   Utility functions for token management (saving, retrieving, removing, and checking).
*   A `useAuth` hook for managing authentication state and providing sign-in, sign-up, and sign-out functions.
*   Protected routes and redirection based on authentication status.
*   Redirection to the main page after successful sign-in and sign-up.

To use the authentication module, you will need to:

1. Implement the backend API endpoints.
2. Connect the form components to the API.
3. Ensure the backend API redirects to the main page after successful authentication.
4. Add components using shadcn-ui with the command `pnpm dlx shadcn-ui@latest add <component-name>`.

## Component Organization

The components in this project are organized as follows:

- `src/components/ui/`: Contains the base components from Shadcn UI.
- `src/components/custom/`: Contains custom components that are specific to this project.
