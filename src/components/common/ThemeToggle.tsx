import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button'; // Asumiendo que tienes un componente Button de shadcn/ui

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Button variant="outline" size="sm" onClick={toggleTheme}>
      {theme === 'light' ? 'Cambiar a Oscuro' : 'Cambiar a Claro'}
    </Button>
  );
};

export default ThemeToggle;