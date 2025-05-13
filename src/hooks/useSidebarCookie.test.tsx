import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSidebarCookie } from './useSidebarCookie'; // Asegúrate de que la ruta de importación sea correcta

// Mockear document.cookie
const mockCookie = (value: string | null) => {
  Object.defineProperty(document, 'cookie', {
    writable: true,
    value: value ? `test_sidebar_state=${value}` : '',
  });
};

describe('useSidebarCookie', () => {
  // Limpiar mocks y cookies antes de cada test
  beforeEach(() => {
    vi.resetAllMocks();
    mockCookie(null); // Limpiar la cookie antes de cada test
  });

  it('debería inicializar con el valor de la cookie si existe', () => {
    mockCookie('true');
    const { result } = renderHook(() => useSidebarCookie(false));

    expect(result.current[0]).toBe(true);
  });

  it('debería inicializar con el valor por defecto si la cookie no existe', () => {
    mockCookie(null);
    const { result } = renderHook(() => useSidebarCookie(false));

    expect(result.current[0]).toBe(false);
  });

  it('debería inicializar con el valor por defecto si la cookie tiene un valor diferente a "true" o "false"', () => {
    mockCookie('some_other_value');
    const { result } = renderHook(() => useSidebarCookie(true));

    expect(result.current[0]).toBe(true);
  });


  it('debería actualizar la cookie cuando el estado cambia', () => {
    mockCookie('false'); // Estado inicial
    const { result } = renderHook(() => useSidebarCookie(false));

    expect(result.current[0]).toBe(false);

    act(() => {
      result.current[1](true); // Cambiar estado a true
    });

    expect(result.current[0]).toBe(true);
    // Verificar que la cookie se actualizó (esto requiere inspeccionar document.cookie)
    expect(document.cookie).toContain('test_sidebar_state=true');

    act(() => {
      result.current[1](false); // Cambiar estado a false
    });

    expect(result.current[0]).toBe(false);
    expect(document.cookie).toContain('test_sidebar_state=false');
  });

   it('debería manejar entornos sin objeto document (SSR)', () => {
    // Simular entorno SSR
    const originalDocument = global.document;
    Object.defineProperty(global, 'document', { value: undefined });

    const { result } = renderHook(() => useSidebarCookie(true));

    expect(result.current[0]).toBe(true); // Debería usar el valor por defecto
    act(() => {
        result.current[1](false); // Intentar cambiar el estado
    });
    expect(result.current[0]).toBe(false); // El estado local cambia

    // Restaurar objeto document
    Object.defineProperty(global, 'document', { value: originalDocument });
  });


  // Agrega más casos de prueba según la lógica del hook useSidebarCookie
});