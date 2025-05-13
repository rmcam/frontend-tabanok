import { renderHook, act } from '@testing-library/react-hooks';
import { useCarousel } from './useCarousel';

describe('useCarousel', () => {
  const totalSlides = 5;

  it('should initialize with the correct initial slide', () => {
    const initialSlide = 2;
    const { result } = renderHook(() => useCarousel(initialSlide, totalSlides));
    expect(result.current.slide).toBe(initialSlide);
  });

  it('should advance to the next slide', () => {
    const initialSlide = 0;
    const { result } = renderHook(() => useCarousel(initialSlide, totalSlides));

    act(() => {
      result.current.nextSlide();
    });

    expect(result.current.slide).toBe(initialSlide + 1);
  });

  it('should wrap around to the first slide when advancing from the last slide', () => {
    const initialSlide = totalSlides - 1;
    const { result } = renderHook(() => useCarousel(initialSlide, totalSlides));

    act(() => {
      result.current.nextSlide();
    });

    expect(result.current.slide).toBe(0);
  });

  it('should go to the previous slide', () => {
    const initialSlide = 2;
    const { result } = renderHook(() => useCarousel(initialSlide, totalSlides));

    act(() => {
      result.current.prevSlide();
    });

    expect(result.current.slide).toBe(initialSlide - 1);
  });

  it('should wrap around to the last slide when going back from the first slide', () => {
    const initialSlide = 0;
    const { result } = renderHook(() => useCarousel(initialSlide, totalSlides));

    act(() => {
      result.current.prevSlide();
    });

    expect(result.current.slide).toBe(totalSlides - 1);
  });

  it('should set the slide directly', () => {
    const initialSlide = 0;
    const newSlide = 3;
    const { result } = renderHook(() => useCarousel(initialSlide, totalSlides));

    act(() => {
      result.current.setSlide(newSlide);
    });

    expect(result.current.slide).toBe(newSlide);
  });
});
