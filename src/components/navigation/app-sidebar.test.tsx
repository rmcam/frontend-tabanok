import { render, screen } from '@testing-library/react';
import { AppSidebar } from './app-sidebar';
import { useAuth } from '@/auth/hooks/useAuth';
import { useFetchUnits } from '@/hooks/useFetchUnits';
import { BrowserRouter as Router } from 'react-router-dom';
import { NavMain } from './nav-main'; // Import NavMain

// Mock de los hooks y componentes
jest.mock('@/auth/hooks/useAuth');
jest.mock('@/hooks/useFetchUnits');
jest.mock('./nav-main', () => ({ // Mock NavMain
  NavMain: jest.fn(() => null), // Mock implementation returns null
}));

const mockUseAuth = useAuth as jest.Mock;
const mockUseFetchUnits = useFetchUnits as jest.Mock;
const mockNavMain = NavMain as jest.Mock; // Get the mocked NavMain

describe('AppSidebar', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockUseAuth.mockReset();
    mockUseFetchUnits.mockReset();
    mockNavMain.mockReset(); // Reset NavMain mock
  });

  test('renders Loading when authentication is loading', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true });
    mockUseFetchUnits.mockReturnValue({ units: [], loading: false, error: null, refetch: jest.fn() });

    render(
      <Router>
        <AppSidebar />
      </Router>
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(mockNavMain).not.toHaveBeenCalled(); // NavMain should not be called when loading
  });

  test('renders Loading when units are loading', () => {
    mockUseAuth.mockReturnValue({ user: { roles: [] }, loading: false });
    mockUseFetchUnits.mockReturnValue({ units: [], loading: true, error: null, refetch: jest.fn() });

    render(
      <Router>
        <AppSidebar />
      </Router>
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(mockNavMain).not.toHaveBeenCalled(); // NavMain should not be called when loading
  });

  test('renders error message and buttons when units fail to load', () => {
    const errorMessage = 'Failed to fetch units';
    mockUseAuth.mockReturnValue({ user: { roles: [] }, loading: false });
    mockUseFetchUnits.mockReturnValue({ units: [], loading: false, error: errorMessage, refetch: jest.fn() });

    render(
      <Router>
        <AppSidebar />
      </Router>
    );

    expect(screen.getByText(`Error al cargar las unidades: ${errorMessage}`)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Recargar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Dashboard/i })).toBeInTheDocument();
    expect(mockNavMain).not.toHaveBeenCalled(); // NavMain should not be called on error
  });

  test('renders teacher panel button for teacher role on error', () => {
    const errorMessage = 'Failed to fetch units';
    mockUseAuth.mockReturnValue({ user: { roles: ['teacher'] }, loading: false });
    mockUseFetchUnits.mockReturnValue({ units: [], loading: false, error: errorMessage, refetch: jest.fn() });

    render(
      <Router>
        <AppSidebar />
      </Router>
    );

    expect(screen.getByRole('button', { name: /Panel Docente/i })).toBeInTheDocument();
    expect(mockNavMain).not.toHaveBeenCalled(); // NavMain should not be called on error
  });

  test('renders sidebar content and calls NavMain with correct items for non-teacher users', () => {
    const mockUnits = [{ id: '1', title: 'Unit 1', url: '/units/1' }];
    mockUseAuth.mockReturnValue({ user: { roles: ['student'] }, loading: false });
    mockUseFetchUnits.mockReturnValue({ units: mockUnits, loading: false, error: null, refetch: jest.fn() });

    render(
      <Router>
        <AppSidebar />
      </Router>
    );

    expect(screen.getByText('Tabanok')).toBeInTheDocument();
    expect(mockNavMain).toHaveBeenCalledTimes(1);
    const passedItems = mockNavMain.mock.calls[0][0].items;
    expect(passedItems).toHaveLength(2); // Dashboard + Units
    expect(passedItems[0].title).toBe('Dashboard');
    expect(passedItems[0].url).toBe('/dashboard');
    expect(passedItems[1].title).toBe('Unidades');
    expect(passedItems[1].items).toEqual(mockUnits.map(unit => ({ title: unit.title, url: unit.url })));
  });

  test('renders sidebar content and calls NavMain with correct items for teacher users', () => {
    const mockUnits = [{ id: '1', title: 'Unit 1', url: '/units/1' }];
    mockUseAuth.mockReturnValue({ user: { roles: ['teacher'] }, loading: false });
    mockUseFetchUnits.mockReturnValue({ units: mockUnits, loading: false, error: null, refetch: jest.fn() });

    render(
      <Router>
        <AppSidebar />
      </Router>
    );

    expect(screen.getByText('Tabanok')).toBeInTheDocument();
    expect(mockNavMain).toHaveBeenCalledTimes(1);
    const passedItems = mockNavMain.mock.calls[0][0].items;
    expect(passedItems).toHaveLength(2); // Panel Docente + Units
    expect(passedItems[0].title).toBe('Panel Docente');
    expect(passedItems[0].url).toBe('/dashboard');
    expect(passedItems[1].title).toBe('Unidades');
    expect(passedItems[1].items).toEqual(mockUnits.map(unit => ({ title: unit.title, url: unit.url })));
  });
});