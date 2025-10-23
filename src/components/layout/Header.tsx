import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthModalStore } from '@/stores/authModalStore';
import { useTheme } from '@/hooks/useTheme'; // Importar el hook de tema
import SunIcon from '@/components/common/SunIcon'; // Importar ícono de sol
import MoonIcon from '@/components/common/MoonIcon'; // Importar ícono de luna
import { useTranslation } from 'react-i18next'; // Importar hook de traducción

const Header: React.FC = () => {
  const { openModal } = useAuthModalStore();
  const { theme, toggleTheme } = useTheme(); // Usar hook de tema
  const { t, i18n } = useTranslation(); // Usar hook de traducción y desestructurar 't'

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary">
          Tabanok
        </Link>
        <nav className="hidden md:flex space-x-6">
          <a href="#hero" className="text-foreground hover:text-primary transition-colors duration-300">Inicio</a>
          <a href="#features" className="text-foreground hover:text-primary transition-colors duration-300">Características</a>
          <a href="#about" className="text-foreground hover:text-primary transition-colors duration-300">Nosotros</a>
          <a href="#cta" className="text-foreground hover:text-primary transition-colors duration-300">Comienza</a>
        </nav>
        <div className="flex items-center space-x-4"> {/* Contenedor para botones adicionales */}
          {/* Botón de cambio de tema */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md text-foreground hover:bg-accent transition-colors duration-300"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
          </button>

          {/* Selector de idioma */}
          <select
            onChange={(e) => changeLanguage(e.target.value)}
            value={i18n.language}
            className="bg-card text-card-foreground rounded-md border border-border py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="es">Español</option>
            <option value="en">English</option>
            {/* Añadir más idiomas si están disponibles en i18n */}
          </select>

          {/* Botón de Iniciar Sesión */}
            <button
              onClick={openModal}
              className="hidden md:block px-4 py-2 border border-primary rounded-md text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
            >
              Iniciar Sesión
            </button>
        </div>
        {/* Mobile menu button - to be implemented */}
        <div className="md:hidden">
          <button className="text-foreground">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
