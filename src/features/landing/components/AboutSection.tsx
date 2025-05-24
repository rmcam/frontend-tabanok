import React from 'react';

function AboutSection() {
  return (
    <section id="about" className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-foreground text-center mb-8">
          Acerca de Tabanok
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-secondary-foreground">
              Tabanok es una plataforma diseñada para facilitar el aprendizaje del idioma y la cultura Kamëntsá.
            </p>
            <p className="text-secondary-foreground">
              Nuestro objetivo es preservar y promover el conocimiento de esta rica cultura, ofreciendo herramientas interactivas y una comunidad de apoyo.
            </p>
          </div>
          <div>
            {/* Puedes agregar una imagen o un video aquí */}
            <div className="bg-accent rounded-lg h-64 flex items-center justify-center">
              <span className="text-accent-foreground">Imagen o video aquí</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
