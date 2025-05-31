import React, { useState } from 'react';
import { cn } from '@/lib/utils'; // Asumiendo que tienes una utilidad cn para combinar clases

interface FAQItemProps {
  question: string;
  answer: string;
}

const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border py-4">
      <button
        className="flex justify-between items-center w-full text-left text-xl font-semibold text-card-foreground hover:text-primary transition-colors duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        {question}
        <ChevronDownIcon className={cn("h-6 w-6 transition-transform duration-300", isOpen ? "rotate-180" : "")} />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-screen opacity-100 mt-2" : "max-h-0 opacity-0"
        )}
      >
        <p className="text-secondary-foreground pt-2 pb-4">{answer}</p>
      </div>
    </div>
  );
};

const FAQSection: React.FC = () => {
  const faqs = [
    {
      question: "¿Qué es Tabanok?",
      answer: "Tabanok es una plataforma de aprendizaje interactivo dedicada a la enseñanza del idioma y la cultura Kamëntsá, con el objetivo de preservar y promover este valioso patrimonio."
    },
    {
      question: "¿Necesito conocimientos previos de Kamëntsá?",
      answer: "No, Tabanok está diseñado para estudiantes de todos los niveles, desde principiantes absolutos hasta aquellos con conocimientos intermedios que desean profundizar."
    },
    {
      question: "¿Cómo funciona el aprendizaje interactivo?",
      answer: "Nuestras lecciones incluyen una combinación de texto, audio, video, ejercicios prácticos y retroalimentación instantánea para asegurar una experiencia de aprendizaje dinámica y efectiva."
    },
    {
      question: "¿Hay una comunidad de apoyo?",
      answer: "Sí, Tabanok cuenta con una vibrante comunidad donde puedes conectar con otros estudiantes y hablantes nativos para practicar, hacer preguntas y compartir tu progreso."
    },
    {
      question: "¿Es Tabanok gratuito?",
      answer: "Tabanok ofrece una variedad de contenidos gratuitos y opciones premium para acceder a material exclusivo y funciones avanzadas. Puedes empezar a explorar sin costo alguno."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-background relative overflow-hidden">
      {/* Formas geométricas de fondo */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-1000"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/5 rounded-lg transform rotate-12 mix-blend-multiply filter blur-xl opacity-50 animate-blob-reverse animation-delay-3000"></div>

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl font-extrabold text-foreground text-center mb-12 leading-tight">
          Preguntas <span className="text-accent">Frecuentes</span>
        </h2>
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
