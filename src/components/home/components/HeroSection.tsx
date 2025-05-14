import { Button } from '@/components/ui/button';
import { HashLink } from 'react-router-hash-link'; // Importar HashLink
import { useNavigate } from 'react-router-dom'; // Importar useNavigate

interface HeroProps {
  title: string;
  description: string;
  buttons?: {
    label: string;
    variant: 'default' | 'secondary' | 'link' | 'destructive' | 'outline' | 'ghost';
    onClick?: () => void;
    action?: 'openSignupModal';
    href?: string; // Añadir propiedad href
  }[];
  imageSrc: string;
  imageAlt: string;
  isAuthenticated: boolean; // Añadir propiedad isAuthenticated
  onComienzaAhoraClick?: () => void;
}

const HeroSection: React.FC<HeroProps> = ({
  title,
  description,
  buttons,
  imageSrc,
  isAuthenticated, // Añadir propiedad isAuthenticated
  onComienzaAhoraClick,
}) => {
  const navigate = useNavigate(); // Obtener la función de navegación

  return (
    <section className="flex flex-col md:flex-row items-center justify-center py-12 px-4 relative overflow-hidden h-screen bg-center" style={{
      backgroundImage: `url(${imageSrc})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
    }}>
      <div className="absolute inset-0 bg-kamentsa-verde-oscuro opacity-80"></div>
      <div className="hero-content text-center md:text-left relative z-10">
        <h2 className="text-4xl font-bold mb-6 text-white">{title}</h2>
        <p className="text-xl mb-8 text-white">{description}</p>
        {buttons && (
          <div className="space-x-4 mt-8">
            {buttons.map((button, buttonIndex) => {
              // Determinar el manejador de clic
              const handleClick = () => {
                if (button.action === 'openSignupModal') {
                  if (isAuthenticated) {
                    navigate('/dashboard'); // Redirigir si está autenticado
                  } else {
                    onComienzaAhoraClick?.(); // Abrir modal si no está autenticado
                  }
                } else {
                  button.onClick?.(); // Ejecutar onClick si existe
                }
              };

              // Renderizar como HashLink si tiene href, de lo contrario como Button
              if (button.href) {
                return (
                  <HashLink key={buttonIndex} to={button.href} smooth={true} duration={500}>
                    <Button
                      variant={
                        button.variant as
                          | 'default'
                          | 'secondary'
                          | 'link'
                          | 'destructive'
                          | 'outline'
                          | 'ghost'
                      }
                      onClick={handleClick} // Usar el nuevo manejador de clic
                    >
                      {button.label}
                    </Button>
                  </HashLink>
                );
              } else {
                return (
                  <Button
                    key={buttonIndex}
                    variant={
                      button.variant as
                        | 'default'
                        | 'secondary'
                        | 'link'
                        | 'destructive'
                        | 'outline'
                        | 'ghost'
                    }
                    onClick={handleClick} // Usar el nuevo manejador de clic
                  >
                    {button.label}
                  </Button>
                );
              }
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
