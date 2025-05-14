import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./auth/context/authProvider";
import "./index.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next'; // Importa I18nextProvider
import i18n from './i18n'; // Importa tu configuración de i18n
import { ThemeProvider } from './context/ThemeContext'; // Importa ThemeProvider

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider> {/* Envuelve la aplicación con ThemeProvider */}
      <BrowserRouter>
        <AuthProvider>
          {" "}
          {/* Envolver la aplicación con AuthProvider */}
          <QueryClientProvider client={queryClient}>
            <I18nextProvider i18n={i18n}> {/* Envolver la aplicación con I18nextProvider */}
              <App />
            </I18nextProvider>
          </QueryClientProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, err => {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
