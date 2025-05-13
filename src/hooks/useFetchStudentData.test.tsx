import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import useFetchStudentData, { Achievement, RecommendedActivity, CulturalNarrative } from './useFetchStudentData'; // Asegúrate de que la ruta de importación sea correcta
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

describe('useFetchStudentData', () => {
  // Limpiar caché de react-query entre tests
  beforeEach(() => {
    queryClient.clear();
  });

  it('debería cargar datos de estudiante exitosamente', async () => {
    const mockUser = { id: 'student-1', username: 'testuser', roles: ['student'], email: 'test@example.com', firstName: 'Test', secondName: '', firstLastName: 'User', secondLastName: '' };
    const mockProgressData = { completedLessons: 5, totalLessons: 10, overallScore: 80 };
    const mockAchievements: Achievement[] = []; // Mockear con datos de logros si es necesario
    const mockRecommendations: RecommendedActivity[] = []; // Mockear con datos de recomendaciones si es necesario
    const mockNarratives: CulturalNarrative[] = []; // Mockear con datos de narrativas si es necesario

    // Mockear las respuestas de las APIs
    global.fetch = vi.fn((url: string) => {
      if (url.includes(`/students/${mockUser.id}/progress`)) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockProgressData) } as Response);
      }
      if (url.includes(`/students/${mockUser.id}/achievements`)) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockAchievements) } as Response);
      }
      if (url.includes(`/recommendations/for-student/${mockUser.id}`)) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockRecommendations) } as Response);
      }
       if (url.includes(`/cultural-narratives`)) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockNarratives) } as Response);
      }
      return Promise.reject(new Error(`Unexpected URL: ${url}`));
    });

    const { result } = renderHook(() => useFetchStudentData(mockUser), { wrapper });

    expect(result.current.loading).toBe(true);
    expect(result.current.progressData).toBeNull();
    expect(result.current.achievements).toEqual([]);
    expect(result.current.recommendedActivities).toEqual([]);
    expect(result.current.culturalNarratives).toEqual([]);
    expect(result.current.error).toBeNull();

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.progressData).toEqual(mockProgressData);
    expect(result.current.achievements).toEqual(mockAchievements);
    expect(result.current.recommendedActivities).toEqual(mockRecommendations);
    expect(result.current.culturalNarratives).toEqual(mockNarratives);
    expect(result.current.error).toBeNull();
  });

  it('debería manejar errores de carga de datos de estudiante', async () => {
    const mockUser = { id: 'student-1', username: 'testuser', roles: ['student'], email: 'test@example.com', firstName: 'Test', secondName: '', firstLastName: 'User', secondLastName: '' };
    const errorMessage = 'Error al obtener datos de estudiante';

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.reject(new Error(errorMessage)),
      } as Response)
    );

    const { result } = renderHook(() => useFetchStudentData(mockUser), { wrapper });

    expect(result.current.loading).toBe(true);
    expect(result.current.progressData).toBeNull();
    expect(result.current.achievements).toEqual([]);
    expect(result.current.recommendedActivities).toEqual([]);
    expect(result.current.culturalNarratives).toEqual([]);
    expect(result.current.error).toBeNull();

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.progressData).toBeNull();
    expect(result.current.achievements).toEqual([]);
    expect(result.current.recommendedActivities).toEqual([]);
    expect(result.current.culturalNarratives).toEqual([]);
    expect(result.current.error).not.toBeNull();
    expect(result.current.error).toContain("Error al obtener los datos del estudiante"); // Ajusta según la implementación del hook
  });

  it('debería manejar errores específicos al cargar el progreso del estudiante', async () => {
    const mockUser = { id: 'student-1', username: 'testuser', roles: ['student'], email: 'test@example.com', firstName: 'Test', secondName: '', firstLastName: 'User', secondLastName: '' };
    const progressErrorMessage = 'Error al obtener progreso';
    const mockAchievements: Achievement[] = [];
    const mockRecommendations: RecommendedActivity[] = [];
    const mockNarratives: CulturalNarrative[] = [];

    global.fetch = vi.fn((url: string) => {
      if (url.includes(`/students/${mockUser.id}/progress`)) {
        return Promise.resolve({ ok: false, status: 500, json: () => Promise.reject(new Error(progressErrorMessage)) } as Response);
      }
      if (url.includes(`/students/${mockUser.id}/achievements`)) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockAchievements) } as Response);
      }
      if (url.includes(`/recommendations/for-student/${mockUser.id}`)) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockRecommendations) } as Response);
      }
       if (url.includes(`/cultural-narratives`)) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockNarratives) } as Response);
      }
      return Promise.reject(new Error(`Unexpected URL: ${url}`));
    });

    const { result } = renderHook(() => useFetchStudentData(mockUser), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.progressData).toBeNull();
    expect(result.current.achievements).toEqual(mockAchievements);
    expect(result.current.recommendedActivities).toEqual(mockRecommendations);
    expect(result.current.culturalNarratives).toEqual(mockNarratives);
    expect(result.current.error).toContain("Error al obtener los datos del estudiante");
  });

  it('debería manejar errores específicos al cargar los logros del estudiante', async () => {
    const mockUser = { id: 'student-1', username: 'testuser', roles: ['student'], email: 'test@example.com', firstName: 'Test', secondName: '', firstLastName: 'User', secondLastName: '' };
    const achievementsErrorMessage = 'Error al obtener logros';
    const mockProgressData = { completedLessons: 5, totalLessons: 10, overallScore: 80 };
    const mockRecommendations: RecommendedActivity[] = [];
    const mockNarratives: CulturalNarrative[] = [];

    global.fetch = vi.fn((url: string) => {
      if (url.includes(`/students/${mockUser.id}/progress`)) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockProgressData) } as Response);
      }
      if (url.includes(`/students/${mockUser.id}/achievements`)) {
        return Promise.resolve({ ok: false, status: 500, json: () => Promise.reject(new Error(achievementsErrorMessage)) } as Response);
      }
      if (url.includes(`/recommendations/for-student/${mockUser.id}`)) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockRecommendations) } as Response);
      }
       if (url.includes(`/cultural-narratives`)) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockNarratives) } as Response);
      }
      return Promise.reject(new Error(`Unexpected URL: ${url}`));
    });

    const { result } = renderHook(() => useFetchStudentData(mockUser), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.progressData).toEqual(mockProgressData);
    expect(result.current.achievements).toEqual([]);
    expect(result.current.recommendedActivities).toEqual(mockRecommendations);
    expect(result.current.culturalNarratives).toEqual(mockNarratives);
    expect(result.current.error).toContain("Error al obtener los datos del estudiante");
  });

    it('debería manejar errores específicos al cargar las recomendaciones del estudiante', async () => {
    const mockUser = { id: 'student-1', username: 'testuser', roles: ['student'], email: 'test@example.com', firstName: 'Test', secondName: '', firstLastName: 'User', secondLastName: '' };
    const recommendationsErrorMessage = 'Error al obtener recomendaciones';
    const mockProgressData = { completedLessons: 5, totalLessons: 10, overallScore: 80 };
    const mockAchievements: Achievement[] = [];
    const mockNarratives: CulturalNarrative[] = [];

    global.fetch = vi.fn((url: string) => {
      if (url.includes(`/students/${mockUser.id}/progress`)) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockProgressData) } as Response);
      }
      if (url.includes(`/students/${mockUser.id}/achievements`)) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockAchievements) } as Response);
      }
      if (url.includes(`/recommendations/for-student/${mockUser.id}`)) {
        return Promise.resolve({ ok: false, status: 500, json: () => Promise.reject(new Error(recommendationsErrorMessage)) } as Response);
      }
       if (url.includes(`/cultural-narratives`)) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockNarratives) } as Response);
      }
      return Promise.reject(new Error(`Unexpected URL: ${url}`));
    });

    const { result } = renderHook(() => useFetchStudentData(mockUser), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.progressData).toEqual(mockProgressData);
    expect(result.current.achievements).toEqual(mockAchievements);
    expect(result.current.recommendedActivities).toEqual([]);
    expect(result.current.culturalNarratives).toEqual(mockNarratives);
    expect(result.current.error).toContain("Error al obtener los datos del estudiante");
  });

    it('debería manejar errores específicos al cargar las narrativas culturales', async () => {
    const mockUser = { id: 'student-1', username: 'testuser', roles: ['student'], email: 'test@example.com', firstName: 'Test', secondName: '', firstLastName: 'User', secondLastName: '' };
    const narrativesErrorMessage = 'Error al obtener narrativas';
    const mockProgressData = { completedLessons: 5, totalLessons: 10, overallScore: 80 };
    const mockAchievements: Achievement[] = [];
    const mockRecommendations: RecommendedActivity[] = [];

    global.fetch = vi.fn((url: string) => {
      if (url.includes(`/students/${mockUser.id}/progress`)) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockProgressData) } as Response);
      }
      if (url.includes(`/students/${mockUser.id}/achievements`)) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockAchievements) } as Response);
      }
      if (url.includes(`/recommendations/for-student/${mockUser.id}`)) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockRecommendations) } as Response);
      }
       if (url.includes(`/cultural-narratives`)) {
        return Promise.resolve({ ok: false, status: 500, json: () => Promise.reject(new Error(narrativesErrorMessage)) } as Response);
      }
      return Promise.reject(new Error(`Unexpected URL: ${url}`));
    });

    const { result } = renderHook(() => useFetchStudentData(mockUser), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.progressData).toEqual(mockProgressData);
    expect(result.current.achievements).toEqual(mockAchievements);
    expect(result.current.recommendedActivities).toEqual(mockRecommendations);
    expect(result.current.culturalNarratives).toEqual([]);
    expect(result.current.error).toContain("Error al obtener los datos del estudiante");
  });


  it('no debería cargar datos si el usuario es null', async () => {
    const { result } = renderHook(() => useFetchStudentData(null), { wrapper });

    expect(result.current.loading).toBe(false);
    expect(result.current.progressData).toBeNull();
    expect(result.current.achievements).toEqual([]);
    expect(result.current.recommendedActivities).toEqual([]);
    expect(result.current.culturalNarratives).toEqual([]);
    expect(result.current.error).toBe("Usuario no autenticado.");

    // Asegurarse de que fetch no fue llamado
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('debería manejar respuestas con datos nulos o inesperados para progreso', async () => {
    const mockUser = { id: 'student-1', username: 'testuser', roles: ['student'], email: 'test@example.com', firstName: 'Test', secondName: '', firstLastName: 'User', secondLastName: '' };
    const mockAchievements: Achievement[] = [];
    const mockRecommendations: RecommendedActivity[] = [];
    const mockNarratives: CulturalNarrative[] = [];

    global.fetch = vi.fn((url: string) => {
      if (url.includes(`/students/${mockUser.id}/progress`)) {
        // Simular respuesta con datos nulos o formato inesperado
        return Promise.resolve({ ok: true, json: () => Promise.resolve(null) } as Response);
      }
      if (url.includes(`/students/${mockUser.id}/achievements`)) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockAchievements) } as Response);
      }
      if (url.includes(`/recommendations/for-student/${mockUser.id}`)) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockRecommendations) } as Response);
      }
       if (url.includes(`/cultural-narratives`)) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockNarratives) } as Response);
      }
      return Promise.reject(new Error(`Unexpected URL: ${url}`));
    });

    const { result } = renderHook(() => useFetchStudentData(mockUser), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    // Asegurarse de que progressData es null o el valor por defecto esperado en caso de datos inesperados
    expect(result.current.progressData).toBeNull();
    expect(result.current.achievements).toEqual(mockAchievements);
    expect(result.current.recommendedActivities).toEqual(mockRecommendations);
    expect(result.current.culturalNarratives).toEqual(mockNarratives);
    expect(result.current.error).toBeNull(); // O manejar error si el hook lo hace
  });

    it('debería manejar respuestas con datos nulos o inesperados para logros', async () => {
    const mockUser = { id: 'student-1', username: 'testuser', roles: ['student'], email: 'test@example.com', firstName: 'Test', secondName: '', firstLastName: 'User', secondLastName: '' };
    const mockProgressData = { completedLessons: 5, totalLessons: 10, overallScore: 80 };
    const mockRecommendations: RecommendedActivity[] = [];
    const mockNarratives: CulturalNarrative[] = [];

    global.fetch = vi.fn((url: string) => {
      if (url.includes(`/students/${mockUser.id}/progress`)) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockProgressData) } as Response);
      }
      if (url.includes(`/students/${mockUser.id}/achievements`)) {
         // Simular respuesta con datos nulos o formato inesperado
        return Promise.resolve({ ok: true, json: () => Promise.resolve(null) } as Response);
      }
      if (url.includes(`/recommendations/for-student/${mockUser.id}`)) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockRecommendations) } as Response);
      }
       if (url.includes(`/cultural-narratives`)) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockNarratives) } as Response);
      }
      return Promise.reject(new Error(`Unexpected URL: ${url}`));
    });

    const { result } = renderHook(() => useFetchStudentData(mockUser), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.progressData).toEqual(mockProgressData);
    // Asegurarse de que achievements es un array vacío o el valor por defecto esperado
    expect(result.current.achievements).toEqual([]);
    expect(result.current.recommendedActivities).toEqual(mockRecommendations);
    expect(result.current.culturalNarratives).toEqual(mockNarratives);
    expect(result.current.error).toBeNull(); // O manejar error si el hook lo hace
  });

    it('debería manejar respuestas con datos nulos o inesperados para recomendaciones', async () => {
    const mockUser = { id: 'student-1', username: 'testuser', roles: ['student'], email: 'test@example.com', firstName: 'Test', secondName: '', firstLastName: 'User', secondLastName: '' };
    const mockProgressData = { completedLessons: 5, totalLessons: 10, overallScore: 80 };
    const mockAchievements: Achievement[] = [];
    const mockNarratives: CulturalNarrative[] = [];

    global.fetch = vi.fn((url: string) => {
      if (url.includes(`/students/${mockUser.id}/progress`)) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockProgressData) } as Response);
      }
      if (url.includes(`/students/${mockUser.id}/achievements`)) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockAchievements) } as Response);
      }
      if (url.includes(`/recommendations/for-student/${mockUser.id}`)) {
         // Simular respuesta con datos nulos o formato inesperado
        return Promise.resolve({ ok: true, json: () => Promise.resolve(null) } as Response);
      }
       if (url.includes(`/cultural-narratives`)) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockNarratives) } as Response);
      }
      return Promise.reject(new Error(`Unexpected URL: ${url}`));
    });

    const { result } = renderHook(() => useFetchStudentData(mockUser), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.progressData).toEqual(mockProgressData);
    expect(result.current.achievements).toEqual(mockAchievements);
    // Asegurarse de que recommendedActivities es un array vacío o el valor por defecto esperado
    expect(result.current.recommendedActivities).toEqual([]);
    expect(result.current.culturalNarratives).toEqual(mockNarratives);
    expect(result.current.error).toBeNull(); // O manejar error si el hook lo hace
  });

    it('debería manejar respuestas con datos nulos o inesperados para narrativas culturales', async () => {
    const mockUser = { id: 'student-1', username: 'testuser', roles: ['student'], email: 'test@example.com', firstName: 'Test', secondName: '', firstLastName: 'User', secondLastName: '' };
    const mockProgressData = { completedLessons: 5, totalLessons: 10, overallScore: 80 };
    const mockAchievements: Achievement[] = [];
    const mockRecommendations: RecommendedActivity[] = [];

    global.fetch = vi.fn((url: string) => {
      if (url.includes(`/students/${mockUser.id}/progress`)) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockProgressData) } as Response);
      }
      if (url.includes(`/students/${mockUser.id}/achievements`)) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockAchievements) } as Response);
      }
      if (url.includes(`/recommendations/for-student/${mockUser.id}`)) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockRecommendations) } as Response);
      }
       if (url.includes(`/cultural-narratives`)) {
         // Simular respuesta con datos nulos o formato inesperado
        return Promise.resolve({ ok: true, json: () => Promise.resolve(null) } as Response);
      }
      return Promise.reject(new Error(`Unexpected URL: ${url}`));
    });

    const { result } = renderHook(() => useFetchStudentData(mockUser), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.progressData).toEqual(mockProgressData);
    expect(result.current.achievements).toEqual(mockAchievements);
    expect(result.current.recommendedActivities).toEqual(mockRecommendations);
    // Asegurarse de que culturalNarratives es un array vacío o el valor por defecto esperado
    expect(result.current.culturalNarratives).toEqual([]);
    expect(result.current.error).toBeNull(); // O manejar error si el hook lo hace
  });

  // Agrega más casos de prueba según la lógica del hook useFetchStudentData
  
  // Fin de los tests
  });