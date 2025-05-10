import { renderHook, act } from '@testing-library/react-hooks';
import { useCarousel } from './useCarousel';

describe('useCarousel', () => {
  it('should initialize with the first slide', () => {
    const { result } = renderHook(() => useCarousel(0, 5));
    expect(result.current.slide).toBe(0);
  });

  it('should move to the next slide', () => {
    const { result } = renderHook(() => useCarousel(0, 5));
    act(() => {
      result.current.nextSlide();
    });
    expect(result.current.slide).toBe(1);
  });

  it('should wrap around to the first slide when nextSlide is called on the last slide', () => {
    const { result } = renderHook(() => useCarousel(0, 5));
    act(() => {
      result.current.setSlide(4); // Go to the last slide (index 4)
    });
    act(() => {
      result.current.nextSlide();
    });
    expect(result.current.slide).toBe(0);
  });

  it('should move to the previous slide', () => {
    const { result } = renderHook(() => useCarousel(0, 5));
    act(() => {
      result.current.setSlide(2); // Start at slide 2
    });
    act(() => {
      result.current.prevSlide();
    });
    expect(result.current.slide).toBe(1);
  });

  it('should wrap around to the last slide when prevSlide is called on the first slide', () => {
    const { result } = renderHook(() => useCarousel(0, 5));
    act(() => {
      result.current.prevSlide();
    });
    expect(result.current.slide).toBe(4); // Last slide (index 4)
  });

  it('should go to a specific slide', () => {
    const { result } = renderHook(() => useCarousel(0, 5));
    act(() => {
      result.current.setSlide(3);
    });
    expect(result.current.slide).toBe(3);
  });

  it('should not go to a slide out of bounds', () => {
    const { result } = renderHook(() => useCarousel(0, 5));
    act(() => {
      result.current.setSlide(10); // Out of bounds
    });
    expect(result.current.slide).toBe(0); // Should stay at the current slide (0)
  });

  it('should handle zero slides', () => {
    const { result } = renderHook(() => useCarousel(0, 0));
    expect(result.current.slide).toBe(0);
    act(() => {
      result.current.nextSlide();
    });
    expect(result.current.slide).toBe(0);
    act(() => {
      result.current.prevSlide();
    });
    expect(result.current.slide).toBe(0);
    act(() => {
      result.current.setSlide(0);
    });
    expect(result.current.slide).toBe(0);
  });
});
