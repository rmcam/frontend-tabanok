import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import i18n from "./i18n"; // Importa tu configuración de i18n
import { I18nextProvider } from "react-i18next"; // Importa I18nextProvider

import "../index.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "./components/common/theme-provider";

import { Toaster, toast } from 'sonner'; // Importa el componente Toaster y toast

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3, // Reintentar las queries 3 veces por defecto
      staleTime: 1000 * 60 * 5, // Datos considerados "frescos" por 5 minutos por defecto
      gcTime: 1000 * 60 * 10, // Los datos se mantienen en caché por 10 minutos después de que no hay observadores
    },
    mutations: {
      onError: (error: any) => { // Tipar el error para evitar 'any' implícito
        console.error('Error global en mutación:', error.message);
        toast.error(error.message || 'Ocurrió un error inesperado.');
      },
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <I18nextProvider i18n={i18n}> {/* Envuelve tu App con I18nextProvider */}
            <App />
          </I18nextProvider>
          <Toaster /> 
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
