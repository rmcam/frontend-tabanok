import { useState, useEffect } from 'react';
import { SIDEBAR_COOKIE_NAME, SIDEBAR_COOKIE_MAX_AGE } from '@/components/ui/sidebar.constants';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null;
  }
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for(let i=0;i < ca.length;i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function setCookie(name: string, value: string, maxAge: number) {
  if (typeof document === 'undefined') {
    return;
  }
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}`;
}

function useSidebarCookie(defaultValue: boolean): [boolean, (value: boolean) => void] {
  const [value, setValue] = useState(() => {
    const cookieValue = getCookie(SIDEBAR_COOKIE_NAME);
    return cookieValue !== null ? cookieValue === 'true' : defaultValue;
  });

  useEffect(() => {
    setCookie(SIDEBAR_COOKIE_NAME, value.toString(), SIDEBAR_COOKIE_MAX_AGE);
  }, [value]);

  return [value, setValue];
}

export { useSidebarCookie };
