import LightbulbIcon from '@/components/common/LightbulbIcon';
import BookTextIcon from '@/components/common/BookTextIcon';
import UsersIcon from '@/components/common/UsersIcon';

function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-gradient-to-br from-secondary to-background relative overflow-hidden">
      {/* Formas geométricas de fondo */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob-reverse animation-delay-1000"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/5 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-3000"></div>

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl font-extrabold text-foreground text-center mb-12 leading-tight">
          Descubre las <span className="text-primary">Características</span> Clave
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Feature 1: Aprendizaje Interactivo */}
          <div className="bg-card rounded-xl shadow-lg p-8 flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-border">
            <div className="bg-primary/10 text-primary rounded-full p-4 mb-4">
              <LightbulbIcon className="h-12 w-12" />
            </div>
            <h3 className="text-2xl font-bold text-card-foreground mb-3">
              Aprendizaje Interactivo
            </h3>
            <p className="text-secondary-foreground text-lg">
              Lecciones dinámicas con multimedia, ejercicios prácticos y retroalimentación instantánea para un aprendizaje inmersivo y efectivo.
            </p>
          </div>
          {/* Feature 2: Diccionario Kamëntsá */}
          <div className="bg-card rounded-xl shadow-lg p-8 flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-border">
            <div className="bg-accent/10 text-accent rounded-full p-4 mb-4">
              <BookTextIcon className="h-12 w-12" />
            </div>
            <h3 className="text-2xl font-bold text-card-foreground mb-3">
              Diccionario Kamëntsá
            </h3>
            <p className="text-secondary-foreground text-lg">
              Acceso a un diccionario completo con miles de palabras, traducciones, pronunciaciones y ejemplos de uso contextualizados.
            </p>
          </div>
          {/* Feature 3: Comunidad Activa */}
          <div className="bg-card rounded-xl shadow-lg p-8 flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-border">
            <div className="bg-destructive/10 text-destructive rounded-full p-4 mb-4">
              <UsersIcon className="h-12 w-12" />
            </div>
            <h3 className="text-2xl font-bold text-card-foreground mb-3">
              Comunidad Activa
            </h3>
            <p className="text-secondary-foreground text-lg">
              Conéctate con una vibrante comunidad de estudiantes y hablantes nativos para practicar, compartir conocimientos y crecer juntos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
