import { Button } from '@/components/ui/button';
import clsx from 'clsx';
import { motion } from 'framer-motion'; // Remove AnimatePresence as navbar is always mounted

interface HomeNavbarProps {
  onOpenSigninModal: () => void;
  onOpenSignupModal: () => void;
  isAuthenticated: boolean; // Añadir prop isAuthenticated
}

const HomeNavbar: React.FC<HomeNavbarProps> = ({
  onOpenSigninModal,
  onOpenSignupModal,
  isAuthenticated, // Recibir prop isAuthenticated
}) => {
  // Remove isVisible state and useEffect for scroll listener
  // The navbar will always be visible and fixed

  return (
    <motion.nav
      initial={{ opacity: 1, y: 0 }} // Set initial opacity to 1 and y to 0
      animate={{ opacity: 1, y: 0 }} // Keep animate opacity to 1 and y to 0
      transition={{ duration: 0 }} // Remove transition duration
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 bg-white shadow-md',
        'flex items-center justify-between px-4 py-2',
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* You can add a logo or site title here */}
        <span className="text-lg font-bold text-teal-700">Tabanok</span>

        <div className="space-x-4">
          {!isAuthenticated && ( // Renderizar solo si no está autenticado
            <>
              <Button variant="outline" onClick={onOpenSigninModal}>
                Iniciar Sesión
              </Button>
              <Button onClick={onOpenSignupModal}>
                Registrarse
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default HomeNavbar;
