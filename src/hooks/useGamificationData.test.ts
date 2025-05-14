import { describe, it, expect, vi, Mock } from 'vitest'; // Importar Mock explícitamente
import { renderHook, waitFor } from '@testing-library/react';
import { useGamificationData } from './useGamificationData';
import useFetchData from './useFetchData';

// Mock the useFetchData hook
vi.mock('./useFetchData', () => ({
  default: vi.fn() as Mock, // Usar Mock explícitamente
}));

describe('useGamificationData', () => {
  it('should fetch gamification data', async () => {
    // Mock the resolved value of useFetchData for each endpoint
    (useFetchData as Mock).mockImplementation((url) => { // Usar Mock explícitamente
      if (url === '/gamification/summary') {
        return { data: { totalPoints: 100, level: 5, streak: 3, achievementsUnlocked: 10, missionsCompleted: 2 }, loading: false, error: null };
      }
      if (url === '/gamification/achievements') {
        return { data: [{ id: '1', name: 'First Win', description: 'Win your first activity', unlocked: true }], loading: false, error: null };
      }
      if (url === '/gamification/leaderboard') {
        return { data: [{ userId: 'user1', username: 'testuser', totalPoints: 100, level: 5 }], loading: false, error: null };
      }
      return { data: null, loading: false, error: null };
    });

    const { result } = renderHook(() => useGamificationData());

    // Wait for the data to be fetched
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Assert that the data is returned correctly
    expect(result.current.summary).toEqual({ totalPoints: 100, level: 5, streak: 3, achievementsUnlocked: 10, missionsCompleted: 2 });
    expect(result.current.achievements).toEqual([{ id: '1', name: 'First Win', description: 'Win your first activity', unlocked: true }]);
    expect(result.current.leaderboard).toEqual([{ userId: 'user1', username: 'testuser', totalPoints: 100, level: 5 }]);
    expect(result.current.error).toBeNull();
  });

  it('should handle loading state', () => {
    // Mock useFetchData to be in a loading state
    (useFetchData as Mock).mockReturnValue({ data: null, loading: true, error: null }); // Usar Mock explícitamente

    const { result } = renderHook(() => useGamificationData());

    // Assert that the loading state is true
    expect(result.current.loading).toBe(true);
    expect(result.current.summary).toBeNull();
    expect(result.current.achievements).toBeNull();
    expect(result.current.leaderboard).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should handle error state', async () => {
    // Mock useFetchData to return an error
    const mockError = new Error('Failed to fetch');
    (useFetchData as Mock).mockImplementation((url) => { // Usar Mock explícitamente
      if (url === '/gamification/summary') {
        return { data: null, loading: false, error: mockError };
      }
      return { data: null, loading: false, error: null };
    });

    const { result } = renderHook(() => useGamificationData());

    // Wait for the error to be present
     await waitFor(() => {
       expect(result.current.error).toBe(mockError);
     });


    // Assert that the error state is handled
    expect(result.current.loading).toBe(false);
    expect(result.current.summary).toBeNull();
    expect(result.current.achievements).toBeNull();
    expect(result.current.leaderboard).toBeNull();
  });
});