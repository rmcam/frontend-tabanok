import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { SidebarContext, SidebarContextProps, useSidebar } from './useSidebar'; // Asegúrate de que la ruta de importación sea correcta
import { useSidebarCookie } from './useSidebarCookie'; // Importar el hook de cookie

// Mock del hook useSidebarCookie
vi.mock('./useSidebarCookie', () => ({
  default: vi.fn(),
}));

describe('useSidebar', () => {
  // Mockear el valor retornado por useSidebarCookie
  const mockSetSidebarState = vi.fn();
  vi.mocked(useSidebarCookie).mockReturnValue(['open' === 'open', mockSetSidebarState]); // Mockear el valor retornado por useSidebarCookie

// Mock del SidebarProvider para envolver los tests
const mockSidebarContextValue: SidebarContextProps = {
  state: 'expanded', // O 'collapsed' según el test
  open: true, // O false según el test
  setOpen: vi.fn(),
  openMobile: false,
  setOpenMobile: vi.fn(),
  isMobile: false, // O true según el test
  toggleSidebar: vi.fn(),
};

const wrapper = ({ children, contextValue = mockSidebarContextValue }: { children: React.ReactNode, contextValue?: SidebarContextProps }) => (
  <SidebarContext.Provider value={contextValue}>
    {children}
  </SidebarContext.Provider>
);

  it('debería retornar el contexto del sidebar', () => {
    const { result } = renderHook(() => useSidebar(), { wrapper });

    expect(result.current).toEqual(mockSidebarContextValue);
  });

  it('debería lanzar un error si no se usa dentro de un SidebarProvider', () => {
    // Renderizar el hook sin el proveedor
    const { result } = renderHook(() => useSidebar());

    // Esperar que se lance un error
    expect(() => result.current).toThrow('useSidebar must be used within a SidebarProvider.');
  });

  // Nota: Los tests para toggleSidebar, openSidebar, closeSidebar, etc.
  // deben estar en el archivo de pruebas del SidebarProvider, ya que esas funciones
  // se definen y se proporcionan a través del contexto.
  // Aquí solo testeamos que el hook accede correctamente al contexto.
});