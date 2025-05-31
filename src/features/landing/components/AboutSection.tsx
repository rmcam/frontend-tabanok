import React from 'react';
import GlobeIcon from '@/components/common/GlobeIcon'; // Importar el nuevo ícono

function AboutSection() {
  return (
    <section id="about" className="py-20 bg-background relative overflow-hidden">
      {/* Formas geométricas de fondo */}
      <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-secondary/10 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-5000"></div>
      <div className="absolute bottom-1/3 left-1/4 w-32 h-32 bg-primary/10 rounded-lg transform rotate-45 mix-blend-multiply filter blur-xl opacity-60 animate-blob-reverse animation-delay-2500"></div>

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl font-extrabold text-foreground text-center mb-12 leading-tight">
          Conoce <span className="text-accent">Tabanok</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-lg">
            <p className="text-secondary-foreground leading-relaxed">
              Tabanok es una plataforma innovadora dedicada a la preservación y enseñanza del vibrante idioma y la rica cultura Kamëntsá. Creemos en el poder de la educación para conectar generaciones y mantener vivas las tradiciones.
            </p>
            <p className="text-secondary-foreground leading-relaxed">
              Nuestro objetivo es ofrecer una experiencia de aprendizaje única, combinando herramientas interactivas de última generación con una comunidad de apoyo, para que cada estudiante pueda sumergirse en el mundo Kamëntsá.
            </p>
          </div>
          <div className="relative bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl shadow-2xl p-8 flex items-center justify-center h-80 overflow-hidden transform rotate-3 hover:rotate-0 transition-all duration-500 ease-in-out">
            <GlobeIcon className="h-48 w-48 text-primary opacity-70 animate-spin-slow" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-card-foreground text-xl font-semibold z-10">Cultura Kamëntsá</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
