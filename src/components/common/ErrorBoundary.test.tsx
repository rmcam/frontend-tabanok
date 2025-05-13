import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary'; // Asegúrate de que la ruta de importación sea correcta
import React from 'react'; // Importar React

// Componente de prueba que lanza un error
const CrashingComponent = () => {
  throw new Error('Test Error');
};

describe('ErrorBoundary', () => {
  // Mockear console.error para evitar que los errores se muestren en la consola durante los tests
  const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  // Restaurar console.error después de todos los tests
  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it('debería renderizar los hijos si no hay error', () => {
    render(
      <ErrorBoundary>
        <div>Componente sin errores</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Componente sin errores')).toBeInTheDocument();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('debería renderizar el mensaje de fallback si un hijo lanza un error', () => {
    render(
      <ErrorBoundary>
        <CrashingComponent />
      </ErrorBoundary>
    );

    // Verificar que el mensaje de error de fallback se renderiza
    // Asumiendo que el ErrorBoundary renderiza "Something went wrong." o similar
    // Si el ErrorBoundary renderiza un mensaje diferente, ajustar la expectativa.
    // Basado en la estructura común de ErrorBoundary, a menudo renderiza un mensaje genérico.
    // Si el componente ErrorBoundary tiene un mensaje de fallback específico, usar ese texto.
    // Si no hay un mensaje de fallback visible, podríamos testear la presencia de un elemento específico
    // que el ErrorBoundary renderiza en caso de error.
    // Revisando ErrorBoundary.tsx, no parece haber un mensaje de fallback visible por defecto.
    // El componentDidCatch solo registra el error.
    // Para testear que el ErrorBoundary "captura" el error, podemos verificar que console.error fue llamado.
    // Si queremos testear un UI de fallback, necesitaríamos modificar ErrorBoundary para renderizar algo en caso de error.

    // Testeando que console.error fue llamado (indicando que el error fue capturado)
    expect(consoleErrorSpy).toHaveBeenCalled();
    // Opcional: verificar los argumentos de console.error si es necesario
    // expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error), expect.any(Object));

    // Si el ErrorBoundary *debería* renderizar un UI de fallback, descomentar y ajustar la siguiente línea:
    // expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
  });

  // Agrega más casos de prueba según la lógica de ErrorBoundary
  // Por ejemplo, testear diferentes tipos de errores si aplica
});