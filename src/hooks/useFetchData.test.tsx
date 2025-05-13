// Tests for useFetchData hook
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import useFetchData from './useFetchData'; // Asegúrate de que la ruta de importación sea correcta
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock del servicio de API si es necesario, o mockear fetch globalmente
// vi.mock('../lib/api', () => ({
//   fetchData: vi.fn(),
// }));

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useFetchData', () => {
  // Limpiar caché de react-query entre tests
  beforeEach(() => {
    queryClient.clear();
  });

  it('debería cargar datos exitosamente', async () => {
    // Mockear la respuesta de la API o fetch
    const mockData = { message: 'Datos de prueba' };
    // Si usas un mock del servicio:
    // vi.mocked(fetchData).mockResolvedValue(mockData);
    // Si mockeas fetch global:
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      } as Response)
    );

    const { result } = renderHook(() => useFetchData('/test-endpoint'), { wrapper });

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('debería manejar errores de carga de datos', async () => {
    const errorMessage = 'Error al obtener datos';
    // Si usas un mock del servicio:
    // vi.mocked(fetchData).mockRejectedValue(new Error(errorMessage));
    // Si mockeas fetch global:
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.reject(new Error(errorMessage)), // O mockear una respuesta de error JSON
      } as Response)
    );


    const { result } = renderHook(() => useFetchData('/test-endpoint'), { wrapper });

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).not.toBeNull();
    // Dependiendo de cómo el hook maneje el error, podrías esperar un objeto Error o un string
    expect(result.current.error).toBeInstanceOf(Error);
    // expect(result.current.error?.message).toContain(errorMessage); // Ajusta según la implementación del hook
  });

it('no debería cargar datos si el path es null', async () => {
    // Asegurarse de que fetch no sea llamado
    global.fetch = vi.fn();

    const { result } = renderHook(() => useFetchData(null), { wrapper });

    // Esperar un corto tiempo para asegurar que no se inicie ninguna carga
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();

    // Verificar que fetch no fue llamado
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('no debería cargar datos si el path es undefined', async () => {
    // Asegurarse de que fetch no sea llamado
    global.fetch = vi.fn();

    const { result } = renderHook(() => useFetchData(undefined), { wrapper });

    // Esperar un corto tiempo para asegurar que no se inicie ninguna carga
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();

    // Verificar que fetch no fue llamado
    expect(global.fetch).not.toHaveBeenCalled();
  });

 it('no debería cargar datos si el path es una cadena vacía', async () => {
   // Asegurarse de que fetch no sea llamado
   global.fetch = vi.fn();

   const { result } = renderHook(() => useFetchData(''), { wrapper });

   // Esperar un corto tiempo para asegurar que no se inicie ninguna carga
   await new Promise(resolve => setTimeout(resolve, 50));

   expect(result.current.loading).toBe(false);
   expect(result.current.data).toBeUndefined();
   expect(result.current.error).toBeNull();

   // Verificar que fetch no fue llamado
   expect(global.fetch).not.toHaveBeenCalled();
 });

  // Agrega más casos de prueba según la lógica del hook:
  // - Comportamiento con diferentes opciones de react-query si se usan
  // - Testing de estados de carga y error intermedios si aplica

  it('debería volver a cargar datos cuando el path cambia', async () => {
    const mockData1 = { message: 'Datos iniciales' };
    const mockData2 = { message: 'Datos actualizados' };

    // Mockear la primera respuesta
    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData1),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData2),
      } as Response);

    const { result, rerender } = renderHook(({ path }) => useFetchData(path), {
      wrapper,
      initialProps: { path: '/initial-endpoint' },
    });

    // Esperar a que carguen los datos iniciales
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual(mockData1);
    expect(global.fetch).toHaveBeenCalledWith('/initial-endpoint', expect.anything());

    // Cambiar el path y volver a renderizar
    rerender({ path: '/updated-endpoint' });

    // Esperar a que carguen los datos actualizados
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual(mockData2);
    expect(global.fetch).toHaveBeenCalledWith('/updated-endpoint', expect.anything());
  });
});