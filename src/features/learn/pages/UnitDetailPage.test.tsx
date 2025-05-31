import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UnitDetailPage from './UnitDetailPage';
import { useUnityById } from '@/hooks/unities/unities.hooks';
import { useLessonsByUnityId } from '@/hooks/lessons/lessons.hooks';
import { useTranslation } from 'react-i18next';

// Mock the hooks
jest.mock('@/hooks/unities/unities.hooks');
jest.mock('@/hooks/lessons/lessons.hooks');
jest.mock('react-i18next');

const queryClient = new QueryClient();

const mockUseUnityById = useUnityById as jest.Mock;
const mockUseLessonsByUnityId = useLessonsByUnityId as jest.Mock;
const mockUseTranslation = useTranslation as jest.Mock;

describe('UnitDetailPage', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockUseUnityById.mockReset();
    mockUseLessonsByUnityId.mockReset();
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key, // Simple mock translation
      i18n: {
        changeLanguage: jest.fn(),
      },
    });
  });

  test('renders loading state', () => {
    mockUseUnityById.mockReturnValue({ data: undefined, isLoading: true, error: null });
    mockUseLessonsByUnityId.mockReturnValue({ data: undefined, isLoading: true, error: null });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/learn/unit/test-unit-id']}>
          <Routes>
            <Route path="/learn/unit/:unitId" element={<UnitDetailPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText('Cargando unidad...')).toBeInTheDocument();
  });

  test('renders error state', () => {
    const errorMessage = 'Failed to fetch unit';
    mockUseUnityById.mockReturnValue({ data: undefined, isLoading: false, error: new Error(errorMessage) });
    mockUseLessonsByUnityId.mockReturnValue({ data: undefined, isLoading: false, error: null });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/learn/unit/test-unit-id']}>
          <Routes>
            <Route path="/learn/unit/:unitId" element={<UnitDetailPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText(`Error al cargar unidad: ${errorMessage}`)).toBeInTheDocument();
  });

  test('renders unit details and lessons', () => {
    const mockUnit = {
      id: 'test-unit-id',
      title: 'Test Unit Title',
      description: 'Test Unit Description',
      requiredPoints: 100,
      order: 1,
      isLocked: false,
    };
    const mockLessons = [
      {
        id: 'lesson-1',
        title: 'Lesson 1',
        description: 'Description 1',
        order: 1,
        exercises: [],
        isCompleted: false,
      },
      {
        id: 'lesson-2',
        title: 'Lesson 2',
        description: 'Description 2',
        order: 2,
        exercises: [],
        isCompleted: true,
      },
    ];

    mockUseUnityById.mockReturnValue({ data: mockUnit, isLoading: false, error: null });
    mockUseLessonsByUnityId.mockReturnValue({ data: mockLessons, isLoading: false, error: null });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/learn/unit/test-unit-id']}>
          <Routes>
            <Route path="/learn/unit/:unitId" element={<UnitDetailPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText(mockUnit.title)).toBeInTheDocument();
    expect(screen.getByText(mockUnit.description)).toBeInTheDocument();
    expect(screen.getByText(`Puntos Requeridos: ${mockUnit.requiredPoints}`)).toBeInTheDocument();
    expect(screen.getByText('Progreso de la Unidad: 50%')).toBeInTheDocument(); // 1 of 2 lessons completed

    expect(screen.getByText('Lecciones de la Unidad')).toBeInTheDocument();
    expect(screen.getByText('Lesson 1')).toBeInTheDocument();
    expect(screen.getByText('Lesson 2')).toBeInTheDocument();
  });

  test('renders message when no lessons are available', () => {
    const mockUnit = {
      id: 'test-unit-id',
      title: 'Test Unit Title',
      description: 'Test Unit Description',
      requiredPoints: 100,
      order: 1,
      isLocked: false,
    };

    mockUseUnityById.mockReturnValue({ data: mockUnit, isLoading: false, error: null });
    mockUseLessonsByUnityId.mockReturnValue({ data: [], isLoading: false, error: null }); // Empty lessons array

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/learn/unit/test-unit-id']}>
          <Routes>
            <Route path="/learn/unit/:unitId" element={<UnitDetailPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText('¡Aún no hay lecciones en esta unidad!')).toBeInTheDocument();
    expect(screen.getByText('Parece que esta unidad está vacía. Por favor, contacta al administrador para que añada contenido.')).toBeInTheDocument();
  });

  test('renders "Unidad no encontrada." when unit data is null', () => {
    mockUseUnityById.mockReturnValue({ data: null, isLoading: false, error: null });
    mockUseLessonsByUnityId.mockReturnValue({ data: [], isLoading: false, error: null });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/learn/unit/test-unit-id']}>
          <Routes>
            <Route path="/learn/unit/:unitId" element={<UnitDetailPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText('Unidad no encontrada.')).toBeInTheDocument();
  });
});
