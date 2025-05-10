import { renderHook } from '@testing-library/react-hooks';
import { useIsMobile } from './use-mobile';

describe('useIsMobile', () => {
  const setScreenWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
    window.dispatchEvent(new Event('resize'));
  };

  beforeEach(() => {
    // Reset screen width before each test
    setScreenWidth(1024); // Default desktop size
  });

  it('should return false for desktop width', () => {
    setScreenWidth(1024);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('should return true for mobile width', () => {
    setScreenWidth(767); // Typical mobile breakpoint
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('should update on window resize', () => {
    const { result } = renderHook(() => useIsMobile());

    setScreenWidth(767);
    expect(result.current).toBe(true);

    setScreenWidth(1024);
    expect(result.current).toBe(false);
  });
});
