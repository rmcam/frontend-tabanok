import { Link } from 'react-router-dom';
import RocketIcon from '@/components/common/RocketIcon'; // Importar el nuevo ícono

function CallToActionSection() {
  return (
    <section id="cta" className="py-20 bg-gradient-to-br from-primary to-accent relative overflow-hidden">
      {/* Formas geométricas de fondo */}
      <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-background/10 rounded-full mix-blend-overlay filter blur-xl opacity-70 animate-blob animation-delay-1500"></div>
      <div className="absolute bottom-1/4 right-1/3 w-32 h-32 bg-background/10 rounded-lg transform rotate-12 mix-blend-overlay filter blur-xl opacity-70 animate-blob-reverse animation-delay-3500"></div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="flex flex-col items-center justify-center mb-8">
          <RocketIcon className="h-20 w-20 text-background mb-4 animate-pulse-slow" />
          <h2 className="text-4xl font-extrabold text-background leading-tight mb-4">
            ¡Despega tu <span className="text-card">Aprendizaje</span> Hoy!
          </h2>
          <p className="text-xl text-primary-foreground max-w-2xl mx-auto mb-10">
            Únete a nuestra vibrante comunidad y embárcate en un viaje fascinante para dominar el idioma y sumergirte en la riqueza de la cultura Kamëntsá.
          </p>
        </div>
        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center bg-card text-card-foreground font-bold py-4 px-8 rounded-full shadow-lg hover:bg-card/90 focus:outline-none focus:ring-4 focus:ring-card/50 transition-all duration-300 ease-in-out transform hover:scale-110"
        >
          Empieza tu Aventura Ahora
          <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </section>
  );
}

export default CallToActionSection;
