import { Link } from 'react-router-dom';

function CallToActionSection() {
  return (
    <section id="cta" className="py-12 bg-secondary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-extrabold text-card-foreground mb-4">
          ¡Comienza tu viaje de aprendizaje hoy!
        </h2>
        <p className="text-lg text-secondary-foreground mb-8">
          Únete a nuestra comunidad y descubre la riqueza de la cultura Kamëntsá.
        </p>
        <Link
          to="/dashboard"
          className="inline-block bg-card text-card-foreground font-medium py-3 px-6 rounded-md shadow-md hover:bg-accent"
        >
          Empieza ahora
        </Link>
      </div>
    </section>
  );
}

export default CallToActionSection;
