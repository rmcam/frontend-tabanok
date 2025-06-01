import { lazy, Suspense } from 'react';
import Header from '@/components/layout/Header'; // Importar el componente Header

// Lazy load de los componentes de sección
const HeroSection = lazy(() => import('../components/HeroSection'));
const FeaturesSection = lazy(() => import('../components/FeaturesSection'));
const AboutSection = lazy(() => import('../components/AboutSection'));
const TestimonialsSection = lazy(() => import('../components/TestimonialsSection'));
const FAQSection = lazy(() => import('../components/FAQSection'));
const CallToActionSection = lazy(() => import('../components/CallToActionSection'));

function LandingPage() {
  return (
    <>
      <Header /> {/* Renderizar el Header aquí */}
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          Cargando...
        </div>
      }>
        <HeroSection /> {/* El padding-top se ajustará dentro de HeroSection */}
        <FeaturesSection />
        <AboutSection />
        <TestimonialsSection />
        <FAQSection />
        <CallToActionSection />
      </Suspense>
    </>
  );
}

export default LandingPage;
