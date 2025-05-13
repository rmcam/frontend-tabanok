import { renderHook } from '@testing-library/react-hooks';
import { useIsMobile } from './use-mobile';

describe('useIsMobile', () => {
  const MOBILE_BREAKPOINT = 768;
  let originalInnerWidth: number;
  let originalMatchMedia: (query: string) => MediaQueryList;

  beforeAll(() => {
    originalInnerWidth = window.innerWidth;
    originalMatchMedia = window.matchMedia;
  });

  afterAll(() => {
    window.innerWidth = originalInnerWidth;
    window.matchMedia = originalMatchMedia;
  });

  beforeEach(() => {
    // Reset innerWidth before each test
    window.innerWidth = originalInnerWidth;
    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false, // Default state
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  it('should return true when window width is less than mobile breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, value: MOBILE_BREAKPOINT - 1 });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('should return false when window width is greater than or equal to mobile breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, value: MOBILE_BREAKPOINT });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('should update when window is resized below mobile breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, value: MOBILE_BREAKPOINT }); // Start above breakpoint
    const { result, rerender } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    Object.defineProperty(window, 'innerWidth', { writable: true, value: MOBILE_BREAKPOINT - 1 }); // Resize below breakpoint
    // Simulate resize event - Note: Directly calling the event listener mock might be needed depending on the mock implementation
    // For a basic test, rerendering might suffice if the hook re-evaluates on render
    rerender();
    // A more robust test would involve triggering the actual event listener mock
    // Since we mocked matchMedia, we need to access the mock to trigger the event
    const matchMediaMock = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const changeEvent = new Event('change');
    // Accessing mock properties requires casting to any or using a specific Jest type
    // Accessing mock properties requires casting to Jest.Mock
    const addEventListenerMock = matchMediaMock.addEventListener as jest.Mock;
    addEventListenerMock.mock.calls.forEach((call: [string, EventListenerOrEventListenerObject]) => {
      const eventHandler = call[1];
      if (typeof eventHandler === 'function') {
        eventHandler(changeEvent);
      } else if (eventHandler && typeof eventHandler.handleEvent === 'function') {
        eventHandler.handleEvent(changeEvent);
      }
    });


    expect(result.current).toBe(true);
  });

  it('should update when window is resized above mobile breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, value: MOBILE_BREAKPOINT - 1 }); // Start below breakpoint
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);

    Object.defineProperty(window, 'innerWidth', { writable: true, value: MOBILE_BREAKPOINT }); // Resize above breakpoint
     // Simulate resize event
    const matchMediaMock = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const changeEvent = new Event('change');
    // Accessing mock properties requires casting to Jest.Mock
    const addEventListenerMock = matchMediaMock.addEventListener as jest.Mock;
    addEventListenerMock.mock.calls.forEach((call: [string, EventListenerOrEventListenerObject]) => {
      const eventHandler = call[1];
       if (typeof eventHandler === 'function') {
        eventHandler(changeEvent);
      } else if (eventHandler && typeof eventHandler.handleEvent === 'function') {
        eventHandler.handleEvent(changeEvent);
      }
    });

    expect(result.current).toBe(false);
  });

  it('should remove event listener on unmount', () => {
    const { unmount } = renderHook(() => useIsMobile());
    const matchMediaMock = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    // Accessing mock properties requires casting to Jest.Mock
    const removeEventListenerMock = matchMediaMock.removeEventListener as jest.Mock;

    unmount();

    expect(removeEventListenerMock).toHaveBeenCalledTimes(1);
    expect(removeEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));
  });
});
