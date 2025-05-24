import AuthModal from '@/features/auth/components/AuthModal';
import { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Componente de la sección principal (Hero) de la página de aterrizaje.
 * Muestra un mensaje de bienvenida y enlaces para empezar a aprender o iniciar sesión.
 * Utiliza Tailwind CSS para el estilizado.
 *
 * @returns El componente HeroSection.
 */
function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-background min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8" id="hero">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            ¡Bienvenido a Tabanok!
          </h2>
          <p className="mt-2 text-center text-sm text-secondary-foreground">
            Descubre la cultura Kamëntsá y aprende su idioma.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <Link
            to="/learn"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50"
          >
            Empieza ahora
          </Link>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-card text-sm text-card-foreground">
                  ¿Ya tienes cuenta?
                </span>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={handleOpenModal}
                className="w-full flex justify-center py-2 px-4 border border-border rounded-md shadow-sm text-sm font-medium text-card-foreground bg-card hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Iniciar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
      <AuthModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}

export default HeroSection;
