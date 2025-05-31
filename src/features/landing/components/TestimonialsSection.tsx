import React from 'react';

interface TestimonialProps {
  quote: string;
  name: string;
  title: string;
}

const TestimonialCard: React.FC<TestimonialProps> = ({ quote, name, title }) => (
  <div className="bg-card rounded-xl shadow-lg p-8 border border-border flex flex-col items-center text-center">
    <p className="text-lg text-secondary-foreground italic mb-4">"{quote}"</p>
    <p className="text-card-foreground font-semibold text-xl">{name}</p>
    <p className="text-muted-foreground text-sm">{title}</p>
  </div>
);

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote: "Tabanok ha transformado mi forma de aprender Kamëntsá. Las lecciones interactivas son increíbles y la comunidad es muy acogedora.",
      name: "María Fernanda",
      title: "Estudiante de Idiomas"
    },
    {
      quote: "Como hablante nativo, me emociona ver una plataforma tan dedicada a preservar nuestra cultura. ¡Es una herramienta fantástica!",
      name: "Juan David",
      title: "Hablante Nativo Kamëntsá"
    },
    {
      quote: "La interfaz es intuitiva y el contenido es de alta calidad. Recomiendo Tabanok a cualquiera que quiera aprender un nuevo idioma.",
      name: "Carlos Andrés",
      title: "Entusiasta de la Cultura"
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-background to-secondary relative overflow-hidden">
      {/* Formas geométricas de fondo */}
      <div className="absolute top-1/4 left-1/3 w-40 h-40 bg-accent/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob-reverse animation-delay-2000"></div>
      <div className="absolute bottom-1/2 right-1/4 w-32 h-32 bg-primary/10 rounded-lg transform rotate-45 mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl font-extrabold text-foreground text-center mb-12 leading-tight">
          Lo que dicen nuestros <span className="text-primary">Estudiantes</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
