import { useState, useEffect, useCallback } from 'react';

const MOBILE_BREAKPOINT = 768;

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

const handleResize = useCallback(() => {
  setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
}, []);

useEffect(() => {

    // Set initial value after mount
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile;
};
