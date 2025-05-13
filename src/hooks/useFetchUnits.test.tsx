import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import useFetchUnits from './useFetchUnits'; // Asegúrate de que la ruta de importación sea correcta
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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

describe('useFetchUnits', () => {
  // Limpiar caché de react-query entre tests
  beforeEach(() => {
    queryClient.clear();
  });

  it('debería cargar unidades exitosamente', async () => {
    const mockUnits = [{ id: '1', name: 'Unidad 1' }, { id: '2', name: 'Unidad 2' }];
    // Mockear la respuesta de la API o fetch
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUnits),
      } as Response)
    );

    const { result } = renderHook(() => useFetchUnits(), { wrapper });

    // Verificar estado inicial de carga
    expect(result.current.loading).toBe(true);
    expect(result.current.units).toEqual([]);
    expect(result.current.error).toBeNull();

    await waitFor(() => expect(result.current.loading).toBe(false));
    await waitFor(() => expect(result.current.units.length).toBeGreaterThan(0));

    expect(result.current.units).toEqual(mockUnits.map(unit => ({
      id: unit.id,
      name: unit.name,
      url: `/units/${unit.id}`,
    })));
    expect(result.current.error).toBeNull();
  });

  it('debería manejar errores al cargar unidades', async () => {
    const errorMessage = 'Error al obtener unidades.';
    global.fetch = vi.fn(() =>
      Promise.reject(new Error('API error')) // Simular un error de red o del servidor
    );

    const { result } = renderHook(() => useFetchUnits(), { wrapper });

    // Verificar estado inicial de carga
    expect(result.current.loading).toBe(true);
    expect(result.current.units).toEqual([]);
    expect(result.current.error).toBeNull();

    await waitFor(() => expect(result.current.loading).toBe(false));
    await waitFor(() => expect(result.current.error).toBe(errorMessage));
    expect(result.current.units).toEqual([]);
  });

  it('debería inicializar units como un array vacío', () => {
    // Mockear fetch para que no se resuelva y así testear el estado inicial
    // Mockear fetch para que no se resuelva y así testear el estado inicial
    // Retornar un objeto que simule una Response para satisfacer el tipo, aunque la promesa nunca se resuelva.
    global.fetch = vi.fn(() => new Promise(() => {}).then(() => ({
      ok: true,
      json: () => Promise.resolve([]),
    } as Response)));

    const { result } = renderHook(() => useFetchUnits(), { wrapper });
    expect(result.current.units).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('debería manejar una respuesta de API vacía', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      } as Response)
    );

    const { result } = renderHook(() => useFetchUnits(), { wrapper });

    // Verificar estado inicial de carga
    expect(result.current.loading).toBe(true);
    expect(result.current.units).toEqual([]);
    expect(result.current.error).toBeNull();

    await waitFor(() => expect(result.current.loading).toBe(false));
    await waitFor(() => expect(result.current.units).toEqual([]));
    expect(result.current.units.length).toBe(0);
    expect(result.current.error).toBeNull();
  });

  it('debería usar datos cacheados si están disponibles', async () => {
    const cachedUnits = [{ id: 'cached-1', name: 'Cached Unit 1', url: '/units/cached-1' }];
    vi.spyOn(sessionStorage, 'getItem').mockReturnValue(JSON.stringify(cachedUnits));
    // Asegurarse de que fetch no sea llamado si hay caché
    global.fetch = vi.fn();

    const { result } = renderHook(() => useFetchUnits(), { wrapper });

    // Debería cargar desde caché inmediatamente
    expect(result.current.loading).toBe(false);
    expect(result.current.units).toEqual(cachedUnits);
    expect(result.current.error).toBeNull();
    expect(global.fetch).not.toHaveBeenCalled();

    vi.spyOn(sessionStorage, 'getItem').mockRestore(); // Restaurar mock
  });

  it('debería refetch unidades y actualizar caché', async () => {
    const initialUnits = [{ id: 'initial-1', name: 'Initial Unit 1' }];
    const refetchedUnits = [{ id: 'refetched-1', name: 'Refetched Unit 1' }];

    // Mockear fetch para la carga inicial
    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(initialUnits),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(refetchedUnits),
      } as Response);

    vi.spyOn(sessionStorage, 'removeItem');
    vi.spyOn(sessionStorage, 'setItem');

    const { result } = renderHook(() => useFetchUnits(), { wrapper });

    // Esperar a la carga inicial
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.units).toEqual(initialUnits.map(unit => ({
      id: unit.id,
      name: unit.name,
      url: `/units/${unit.id}`,
    })));
    expect(sessionStorage.setItem).toHaveBeenCalledWith('units', JSON.stringify(initialUnits.map(unit => ({
      id: unit.id,
      name: unit.name,
      url: `/units/${unit.id}`,
    }))));

    // Llamar a refetch
    result.current.refetch();

    // Verificar estado de carga durante refetch
    expect(result.current.loading).toBe(true);
    expect(sessionStorage.removeItem).toHaveBeenCalledWith('units');

    // Esperar a que refetch complete
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.units).toEqual(refetchedUnits.map(unit => ({
      id: unit.id,
      name: unit.name,
      url: `/units/${unit.id}`,
    })));
    expect(sessionStorage.setItem).toHaveBeenCalledWith('units', JSON.stringify(refetchedUnits.map(unit => ({
      id: unit.id,
      name: unit.name,
      url: `/units/${unit.id}`,
    }))));

    vi.spyOn(sessionStorage, 'removeItem').mockRestore(); // Restaurar mock
    vi.spyOn(sessionStorage, 'setItem').mockRestore(); // Restaurar mock
  });
});