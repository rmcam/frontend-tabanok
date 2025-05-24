import React from 'react';

function FeaturesSection() {
  return (
    <section id="features" className="py-12 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-foreground text-center mb-8">
          Características Principales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-card rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-card-foreground mb-2">
              Aprendizaje Interactivo
            </h3>
            <p className="text-secondary-foreground">
              Lecciones interactivas con imágenes, audio y video para un aprendizaje inmersivo.
            </p>
          </div>
          {/* Feature 2 */}
          <div className="bg-card rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-card-foreground mb-2">
              Diccionario Kamëntsá
            </h3>
            <p className="text-secondary-foreground">
              Acceso a un diccionario completo con traducciones, pronunciaciones y ejemplos de uso.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="bg-card rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-card-foreground mb-2">
              Comunidad
            </h3>
            <p className="text-secondary-foreground">
              Conéctate con otros estudiantes y hablantes nativos para practicar y aprender juntos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
