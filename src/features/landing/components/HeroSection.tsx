import { Link } from 'react-router-dom';
import { useAuthModalStore } from '@/stores/authModalStore';
import BookOpenIcon from '@/components/common/BookOpenIcon'; // Importar el nuevo ícono

/**
 * Componente de la sección principal (Hero) de la página de aterrizaje.
 * Muestra un mensaje de bienvenida y enlaces para empezar a aprender o iniciar sesión.
 * Utiliza Tailwind CSS para el estilizado.
 *
 * @returns El componente HeroSection.
 */
function HeroSection() {
  const { openModal } = useAuthModalStore();

  return (
    <div className="relative bg-background min-h-screen flex flex-col items-center justify-center pt-20 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden" id="hero">
      {/* Formas geométricas de fondo */}
      <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-secondary/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-accent/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="max-w-md w-full space-y-8 z-10 relative bg-card/80 p-8 rounded-lg shadow-lg backdrop-blur-sm">
        <div className="flex flex-col items-center justify-center">
          {/* Ícono central */}
          <BookOpenIcon className="h-24 w-24 text-primary mb-6 animate-bounce-slow" />
          <h2 className="mt-6 text-center text-4xl font-extrabold text-foreground">
            ¡Bienvenido a Tabanok!
          </h2>
          <p className="mt-2 text-center text-lg text-secondary-foreground">
            Descubre la cultura Kamëntsá y aprende su idioma.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <Link
            to="/learn"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-primary-foreground bg-primary hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 transition-all duration-300 ease-in-out transform hover:scale-105"
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
                onClick={openModal}
                className="w-full flex justify-center py-3 px-4 border border-border rounded-md shadow-sm text-base font-medium text-card-foreground bg-card hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Iniciar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
