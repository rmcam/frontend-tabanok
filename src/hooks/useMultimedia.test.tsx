import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import useMultimedia from './useMultimedia'; // Asegúrate de que la ruta de importación sea correcta
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MultimediaItem } from '@/types/multimediaTypes';

// Mock del servicio de API o fetch global
// vi.mock('../lib/api', () => ({
//   get: vi.fn(),
// }));

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useMultimedia', () => {
  // Limpiar caché de react-query entre tests
  beforeEach(() => {
    queryClient.clear();
  });

  it('debería cargar datos multimedia exitosamente', async () => {
    const mockMultimediaData = [{ id: '1', title: 'Video 1', type: 'video', url: 'video1.mp4' }];
    // Mockear la respuesta de la API o fetch
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockMultimediaData),
      } as Response)
    );

    const { result } = renderHook(() => useMultimedia(), { wrapper });

    expect(result.current.loading).toBe(true);
    expect(result.current.multimedia).toBeUndefined();
    expect(result.current.error).toBeNull();

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.multimedia).toEqual(mockMultimediaData);
    expect(result.current.error).toBeNull();
  });

  it('debería manejar errores de carga de datos multimedia', async () => {
    const errorMessage = 'Error al obtener datos multimedia';
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.reject(new Error(errorMessage)),
      } as Response)
    );

    const { result } = renderHook(() => useMultimedia(), { wrapper });

    expect(result.current.loading).toBe(true);
    expect(result.current.multimedia).toBeUndefined();
    expect(result.current.error).toBeNull();

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.multimedia).toBeUndefined();
    expect(result.current.error).not.toBeNull();
    // Dependiendo de cómo el hook maneje el error, podrías esperar un objeto Error o un string
    // expect(result.current.error).toBeInstanceOf(Error); // Ajusta según la implementación del hook
    // expect(result.current.error?.message).toContain(errorMessage); // Ajusta según la implementación del hook
  });

  it('debería manejar una respuesta de datos multimedia vacía', async () => {
    const mockMultimediaData: MultimediaItem[] = [];
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockMultimediaData),
      } as Response)
    );

    const { result } = renderHook(() => useMultimedia(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.multimedia).toEqual(mockMultimediaData);
    expect(result.current.error).toBeNull();
  });

  it('debería manejar errores de red al cargar datos multimedia', async () => {
    const networkError = new Error('Network Error');
    global.fetch = vi.fn(() => Promise.reject(networkError));

    const { result } = renderHook(() => useMultimedia(), { wrapper });

    expect(result.current.loading).toBe(true);
    expect(result.current.multimedia).toBeUndefined();
    expect(result.current.error).toBeNull();

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.multimedia).toBeUndefined();
    expect(result.current.error).not.toBeNull();
    // react-query envuelve el error, verificamos que el error original esté presente
    expect(result.current.error?.message).toContain(networkError.message);
  });
});