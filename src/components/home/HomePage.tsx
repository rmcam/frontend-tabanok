import { useAuth } from '@/auth/hooks/useAuth'; // Importar useAuth
import AuthModals from '@/components/common/AuthModals';
import FeatureCard from '@/components/common/FeatureCard';
import Loading from '@/components/common/Loading'; // Importar el componente Loading
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi, // Importar CarouselApi
} from '@/components/ui/carousel';
import clsx from 'clsx';
import Autoplay from 'embla-carousel-autoplay';
import { motion, useAnimation } from 'framer-motion';
import { Activity, Book, Gamepad2, Pause, Play } from 'lucide-react'; // Importar iconos de pausa/reproducción
import { useCallback, useEffect, useState } from 'react'; // Importar useCallback
import { useInView } from 'react-intersection-observer';
import { HashLink } from 'react-router-hash-link';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import { useCarousel } from '../../hooks/useCarousel';
import { Card, CardContent } from '../ui';
import ContactForm from './components/ContactForm';
import FAQ from './components/FAQ';
import FeaturedLessonCard from './components/FeaturedLessonCard'; // Importar el nuevo componente
import HeroSection from './components/HeroSection';
import HomeNavbar from './components/HomeNavbar'; // Importar HomeNavbar
import { heroCardsData } from './heroCards';

// Definir una interfaz para las lecciones destacadas
interface FeaturedLesson {
  id: string; // O number, dependiendo del tipo real del ID
  imageSrc: string;
  title: string;
  description: string;
  // Añadir otras propiedades si son necesarias y conocidas
}

const testimonials = [
  {
    name: 'Usuario 1',
    text: 'Excelente plataforma para aprender Kamëntsá. ¡Muy recomendada!',
    imageSrc: 'https://randomuser.me/api/portraits/lego/1.jpg',
  },
  {
    name: 'Usuario 2',
    text: 'Me encanta la interfaz y la facilidad de uso. ¡Sigan así!',
    imageSrc: 'https://randomuser.me/api/portraits/lego/2.jpg',
  },
  {
    name: 'Usuario 3',
    text: 'Los recursos interactivos son muy útiles para el aprendizaje. ¡Gracias!',
    imageSrc: 'https://randomuser.me/api/portraits/lego/3.jpg',
  },
];

const HomePage = () => {
  const { user, loading } = useAuth(); // Obtener el estado de autenticación y loading
  const navigate = useNavigate(); // Obtener la función de navegación
  const { slide, setSlide } = useCarousel(0, heroCardsData.length);
  const [featuredLessons, setFeaturedLessons] = useState<FeaturedLesson[]>([]); // Usar la interfaz definida
  const [loadingFeaturedLessons, setLoadingFeaturedLessons] = useState(true); // Estado de carga
  const [errorFeaturedLessons, setErrorFeaturedLessons] = useState<string | null>(null); // Estado de error
  const [testimonialCarouselApi, setTestimonialCarouselApi] = useState<CarouselApi | null>(null); // Estado para la API del carrusel de testimonios
  const [isTestimonialAutoplayPlaying, setIsTestimonialAutoplayPlaying] = useState(true); // Estado para el autoplay de testimonios
  const [fetchTrigger, setFetchTrigger] = useState(0); // Estado para forzar reintento de fetch

  const fetchFeaturedLessons = useCallback(async () => {
    try {
      setLoadingFeaturedLessons(true); // Iniciar carga
      setErrorFeaturedLessons(null); // Limpiar error previo
      const response = await fetch(`${import.meta.env.VITE_API_URL}/lesson/featured`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setFeaturedLessons(data);
    } catch (error: unknown) {
      console.error('Error fetching featured lessons:', error);
      setErrorFeaturedLessons(
        'Hubo un problema al cargar las lecciones destacadas. Por favor, inténtalo de nuevo más tarde.',
      ); // Establecer mensaje de error
      setFeaturedLessons([]); // Limpiar lecciones en caso de error
    } finally {
      setLoadingFeaturedLessons(false); // Finalizar carga
    }
  }, []); // Dependencias vacías ya que VITE_API_URL es una variable de entorno

  useEffect(() => {
    fetchFeaturedLessons();
  }, [fetchTrigger, fetchFeaturedLessons]); // Dependencia en fetchTrigger y fetchFeaturedLessons

  const handleRetryFetch = () => {
    setFetchTrigger((prev) => prev + 1); // Incrementar para forzar useEffect
  };

  // Controlar el estado del autoplay de testimonios
  const toggleTestimonialAutoplay = useCallback(() => {
    if (!testimonialCarouselApi) return;

    if (isTestimonialAutoplayPlaying) {
      testimonialCarouselApi.plugins().autoplay.stop();
    } else {
      testimonialCarouselApi.plugins().autoplay.play();
    }
    setIsTestimonialAutoplayPlaying(!isTestimonialAutoplayPlaying);
  }, [testimonialCarouselApi, isTestimonialAutoplayPlaying]);

  // Sincronizar el estado del autoplay con el evento 'play' y 'stop' del carrusel
  useEffect(() => {
    if (!testimonialCarouselApi) return;

    const onAutoplayPlay = () => setIsTestimonialAutoplayPlaying(true);
    const onAutoplayStop = () => setIsTestimonialAutoplayPlaying(false);

    testimonialCarouselApi.on('autoplay:play', onAutoplayPlay);
    testimonialCarouselApi.on('autoplay:stop', onAutoplayStop);

    return () => {
      testimonialCarouselApi.off('autoplay:play', onAutoplayPlay);
      testimonialCarouselApi.off('autoplay:stop', onAutoplayStop);
    };
  }, [testimonialCarouselApi]);

  const [defaultAuthModal, setDefaultAuthModal] = useState<
    'signin' | 'signup' | 'forgotPassword' | undefined
  >(undefined);

  const handleOpenSignupModal = () => {
    setDefaultAuthModal('signup');
  };

  const handleOpenSigninModal = () => {
    setDefaultAuthModal('signin');
  };

  // Function to reset the defaultAuthModal state when any modal closes
  const handleModalClose = () => {
    setDefaultAuthModal(undefined);
  };

  // Clases comunes para los FeatureCard
  const featureCardCommonClasses =
    'hover:scale-105 transition-transform duration-300 hover:bg-gray-100';

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const animation = useAnimation();

  useEffect(() => {
    if (inView) {
      animation.start({
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          ease: 'easeOut',
        },
      });
    }

    if (!inView) {
      animation.start({
        opacity: 0,
        y: 100,
      });
    }
  }, [inView, animation]);

  // Efecto para redirigir al usuario si ya está autenticado y la carga inicial ha terminado
  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]); // Dependencias: user, loading, navigate

  // Función para manejar el clic en "Empieza ahora"
  const handleComienzaAhoraClick = () => {
    if (user) {
      // Si está autenticado, redirigir al dashboard
      navigate('/dashboard'); // Usar useNavigate
    } else {
      // Si no está autenticado, abrir el modal de iniciar sesión
      handleOpenSigninModal();
    }
  };

  // Si el usuario está cargando o ya autenticado, no renderizar el contenido de la página de inicio
  // Esto evita que la página de inicio parpadee antes de la redirección.
  if (loading || user) {
    return <Loading />; // O un spinner, etc.
  }

  return (
    <>
      {' '}
      {/* Usar fragmento para envolver múltiples elementos */}
      <HomeNavbar
        onOpenSigninModal={handleOpenSigninModal}
        onOpenSignupModal={handleOpenSignupModal}
        isAuthenticated={!!user} // Pasar el estado de autenticación
      />
      <motion.div
        className="container mx-auto py-8"
        ref={ref}
        initial={{ opacity: 0, y: 100 }}
        animate={animation}
      >
        {/* Hide default triggers and pass the close handler */}
        <AuthModals
          defaultOpen={defaultAuthModal}
          showDefaultTriggers={false}
          onModalClose={handleModalClose} // Pass the handler
        />
        <Carousel
          className="w-full max-w-5xl mx-auto"
          role="region"
          aria-roledescription="carousel"
        >
          <CarouselContent
            className="w-full h-[500px]"
            role="group"
            aria-label="Elementos del carrusel"
          >
            {' '}
            {/* Añadida altura fija */}
            {heroCardsData.map((card, index) => (
              <CarouselItem key={index} className="md:w-1/2 lg:w-1/3 h-full">
                {' '}
                {/* Asegurar que el item ocupe la altura */}
                <HeroSection
                  title={card.title}
                  description={card.description}
                  buttons={card.buttons}
                  imageSrc={card.imageSrc}
                  imageAlt={card.alt}
                  isAuthenticated={!!user} // Pasar el estado de autenticación
                  onComienzaAhoraClick={handleComienzaAhoraClick} // Pasar el nuevo manejador
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
          <div className="absolute bottom-4 left-0 w-full">
            <div className="container mx-auto max-w-5xl flex justify-center">
              {heroCardsData.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full mx-1 transition-colors duration-300 ${
                    slide === index
                      ? 'bg-red-500' // Color para el indicador activo
                      : 'bg-gray-300 hover:bg-gray-400' // Color simple para indicadores inactivos
                  }`}
                  aria-label={`Slide ${index + 1}`}
                  onClick={() => setSlide(index)}
                />
              ))}
            </div>
          </div>
        </Carousel>

        {/* Features Section */}
        <section className="py-12">
          {' '}
          {/* Ajustado espaciado */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              title="Lecciones Interactivas"
              description="Descubre la riqueza de la cultura Kamëntsá a través de lecciones interactivas y atractivas."
              icon={Book}
              iconColor="blue"
              ariaLabel="Descubre la riqueza de la cultura Kamëntsá a través de lecciones interactivas y atractivas."
              className={clsx(
                featureCardCommonClasses, // Usar constante
                'border border-red-500',
              )} // Usar clsx
            />
            <FeatureCard
              title="Gamificación"
              description="Gana puntos y recompensas mientras avanzas en tu aprendizaje."
              icon={Gamepad2}
              iconColor="green"
              ariaLabel="Gana puntos y recompensas mientras avanzas en tu aprendizaje."
              className={clsx(
                featureCardCommonClasses, // Usar constante
                'border border-yellow-500',
              )} // Usar clsx
            />
            <FeatureCard
              title="Seguimiento de Progreso"
              description="Visualiza tu progreso y mantente motivado para alcanzar tus metas."
              icon={Activity}
              iconColor="purple"
              ariaLabel="Visualiza tu progreso y mantente motivado para alcanzar tus metas."
              className={clsx(
                featureCardCommonClasses, // Usar constante
                'border border-teal-500',
              )} // Usar clsx
            />
          </div>
        </section>

        {/* Featured Lessons Section */}
        <section className="py-12">
          {' '}
          {/* Ajustado espaciado */}
          <h2 className="text-2xl font-bold text-center mb-4">Lecciones Destacadas</h2>
          {loadingFeaturedLessons && (
            <div className="flex justify-center items-center py-8">
              <Loading /> {/* Mostrar indicador de carga */}
            </div>
          )}
          {errorFeaturedLessons && (
            <div className="text-center text-red-500 py-8">
              {errorFeaturedLessons} {/* Mostrar mensaje de error */}
              {/* Botón de reintento */}
              <Button variant="outline" onClick={handleRetryFetch} className="mt-4">
                Reintentar
              </Button>
            </div>
          )}
          {!loadingFeaturedLessons && !errorFeaturedLessons && featuredLessons.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
              {featuredLessons.map((lesson: FeaturedLesson) => (
                <FeaturedLessonCard key={lesson.id} lesson={lesson} />
              ))}
            </div>
          )}
          {!loadingFeaturedLessons && !errorFeaturedLessons && featuredLessons.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No hay lecciones destacadas disponibles en este momento.
            </div>
          )}
          {!loadingFeaturedLessons && !errorFeaturedLessons && (
            <div className="text-center mt-4">
              <Button variant="link" asChild>
                <HashLink to="/lessons#top" smooth={true} duration={500}>
                  Ver todas las lecciones
                </HashLink>
              </Button>
            </div>
          )}
        </section>

        {/* Testimonials Section */}
        {/* Testimonials Section */}
        <section className="py-12">
          {' '}
          {/* Ajustado espaciado */}
          <h2 className="text-2xl font-bold text-center mb-4">Testimonios</h2>
          <motion.div
            className="w-full max-w-2xl mx-auto relative" // Añadido relative para posicionar el botón
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Carousel
              className="w-full"
              plugins={[Autoplay({ delay: 5000 })]}
              setApi={setTestimonialCarouselApi} // Obtener la API del carrusel
              role="region" // Añadir rol ARIA
              aria-roledescription="carousel" // Añadir descripción de rol ARIA
              aria-label="Testimonios de usuarios" // Añadir etiqueta ARIA
            >
              <CarouselContent role="group" aria-label="Elementos del carrusel de testimonios">
                {' '}
                {/* Añadir rol y etiqueta ARIA */}
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index}>
                    <Card className="">
                      {' '}
                      {/* Eliminado borde amarillo */}
                      <CardContent className="p-4 flex flex-col items-center">
                        <p className="text-center">{testimonial.text}</p>
                        <div className="flex items-center mt-2">
                          <div className="mr-2">
                            <img
                              src={testimonial.imageSrc}
                              alt={`Imagen de ${testimonial.name}`}
                              className="rounded-full w-8 h-8"
                            />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 text-center">
                              - {testimonial.name}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
            {/* Botón de pausa/reproducción */}
            {testimonialCarouselApi && (
              <Button
                variant="outline"
                size="icon"
                className="absolute bottom-4 right-4 size-8 rounded-full" // Posicionar el botón
                onClick={toggleTestimonialAutoplay}
                aria-label={
                  isTestimonialAutoplayPlaying ? 'Pausar autoplay' : 'Reproducir autoplay'
                }
              >
                {isTestimonialAutoplayPlaying ? (
                  <Pause className="size-4" />
                ) : (
                  <Play className="size-4" />
                )}
              </Button>
            )}
          </motion.div>
        </section>

        {/* FAQ Section */}
        <FAQ />

        {/* Contact Section */}
        <section className="py-12 bg-white">
          {' '}
          {/* Ajustado espaciado */}
          <h2 className="text-2xl font-bold text-center mb-4">¿Tienes preguntas?</h2>
          <ContactForm />
        </section>

        {/* Footer */}
        <footer className="text-center py-4 text-gray-500 text-sm">
          {' '}
          {/* Increased padding */}
          <div className="flex justify-center space-x-4 mb-2">
            <HashLink to="/privacy" smooth={true} duration={500} className="hover:underline">
              Política de Privacidad
            </HashLink>
            <HashLink to="/terms" smooth={true} duration={500} className="hover:underline">
              Términos de Servicio
            </HashLink>
            <HashLink to="/contact" smooth={true} duration={500} className="hover:underline">
              Contacto
            </HashLink>
          </div>
          <p>© 2025 Tabanok - Todos los derechos reservados</p>
        </footer>
      </motion.div>
    </> // Cerrar fragmento
  );
};

export default HomePage;
